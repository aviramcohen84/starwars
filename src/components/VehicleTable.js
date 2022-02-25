import React, { useEffect, useState } from 'react';
import { VEHICLES_API } from '../consts';
import Loading from './Loading';

export default function VehicleTable() {
    const [highestValueVehicle, setHighestValueVehicle] = useState({totalPopulation: 0});
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
        initData();
    }, [])

    const initData = async () => {
        const data = [];

        // we want to have our data array contain all results from multple requests so we init it in the outer scope.
        // getVehicles will be called recrusively each time we have a new url for fetching new vehicles.
        const getVehicles = async (url) => {
            const response = await fetch(url);
            const result = await response.json();

            if (result.results.length) data.push(...result.results);

            // go to next endpoint
            if (result?.next) return getVehicles(result.next);

            return data;
        }

        // id something goes wrong
        try {
            const vehicles = await getVehicles(VEHICLES_API);
            // we want to keep only vehicles that has pilots (and therefore has planets).
            setVehiclesData(vehicles.filter(vehicle => vehicle.pilots.length));
        } catch (error) {
            // remove loading when error.
            setIsLoading(false);
            console.error(error)
        }
    }

    // instead of writing fetch for both pilots and planets, we can use only one
    const getResult = async (url) => {
        const response = await fetch(url);
        const result = await response.json();

        return result;
    }

    const setVehiclesData = async (data) => {
        for (const vehicle of data) {
            // init the vehicle object with empty values and population to zero
            const currentVehicleData = {
                name: vehicle.name,
                pilots: [],
                planets: [],
                totalPopulation: 0
            };

            // we iterate over all pilots of vehicles in order to get their planets.
            for (const pilot of vehicle.pilots) {
                const pilotResult = await getResult(pilot);
                const planetResult = await getResult(pilotResult.homeworld);

                // if population is not determined then we leave current iteration.
                if ( planetResult.population === 'unknown') continue;
                
                // if we do have a value we want to save the data so we can have it all at the end when we save the vehicle
                currentVehicleData.pilots.push(pilotResult.name);
                currentVehicleData.planets.push({name: planetResult.name, number: parseInt(planetResult.population)});
                currentVehicleData.totalPopulation += parseInt(planetResult.population);
            }

            // if current vehicle population is larger than the highest so far (saved in state) we want to update it.
            if (currentVehicleData.totalPopulation > highestValueVehicle.totalPopulation) setHighestValueVehicle(currentVehicleData);
        }

        setIsLoading(false);
    }

    // after writing it i realized i should have used styled components at first, if i had more time i would refactor this a bit. maybe even seperate to a different table component.
    return (
        <div className="table">
            <Loading
                value={ isLoading }
                text="Finding Vehicle with largest population..." />
            <div className="row">
                <div className="cell">
                    Vehicle name with the largest sum
                </div>
                <div className="cell">
                { highestValueVehicle.name }
                </div>
            </div>
            <div className="row">
                <div className="cell">
                    Related home planets and their respective population
                </div>
                <div className="cell">
                { highestValueVehicle.planets && highestValueVehicle.planets.map((planet, i) => {
                    return <div key={`planet-${i}`}>{planet.name}, {planet.number}</div>
                })}
                </div>
            </div>
            <div className="row">
                <div className="cell">
                    Related pilot names
                </div>
                <div className="cell">
                { highestValueVehicle.pilots && highestValueVehicle.pilots.map((pilot, i) => {
                    return <div key={`pilot-${i}`}>{pilot}</div>
                })}
                </div>
            </div>
        </div>
    )
}
