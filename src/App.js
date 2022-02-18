import React, { useEffect, useState } from 'react';
import './App.css';

const VEHICLES_API = 'https://swapi.py4e.com/api/vehicles/';

function App() {
  const [vehicleData, setVehicleData] = useState({totalPopulation: 0});
  
  useEffect(() => {
    initData();
  }, [])

  const initData = async () => {
    const data = [];

    const getVehicles = async (url) => {
      const response = await fetch(url);
      const result = await response.json();

      data.push(...result.results);

      if (result.next) return getVehicles(result.next);

      return data;
    }

    const results = await getVehicles(VEHICLES_API);

    setVehiclesData(results.filter(result => result.pilots.length));
  }

  const getResult = async (url) => {
    const response = await fetch(url);
    const result = await response.json();

    return result;
  }

  const setVehiclesData = async (data) => {
    for (const vehicle of data) {
      const currentVehicleData = {
        name: vehicle.name,
        pilots: [],
        planets: [],
        totalPopulation: 0
      };

      for (const pilot of vehicle.pilots) {
        const pilotResult = await getResult(pilot);
        const planetResult = await getResult(pilotResult.homeworld);

        if ( planetResult.population === 'unknown') break;
        
        currentVehicleData.pilots.push(pilotResult.name);
        currentVehicleData.planets.push({name: planetResult.name, number: parseInt(planetResult.population)});
        currentVehicleData.totalPopulation += parseInt(planetResult.population);
      }

      if (currentVehicleData.totalPopulation > vehicleData.totalPopulation) setVehicleData(currentVehicleData);
    }
  }

  return (
    <div className="App">
      <div className="table">
        <div className="row">
          <div className="cell">
            Vehicle name with the largest sum
          </div>
          <div className="cell">
            { vehicleData.name }
          </div>
        </div>
        <div className="row">
          <div className="cell">
            Related home planets and their respective population
          </div>
          <div className="cell">
            { vehicleData.planets && vehicleData.planets.map(planet => {
              return <div>{planet.name}, {planet.number}</div>
            })}
          </div>
        </div>
        <div className="row">
          <div className="cell">
            Related pilot names
          </div>
          <div className="cell">
            { vehicleData.pilots && vehicleData.pilots.map(pilot => {
              return <div>{pilot}</div>
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
