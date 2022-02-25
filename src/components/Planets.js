import React, { useState, useEffect } from 'react';
import { PLANETS_API, PLANETS } from '../consts';
import Loading from './Loading';
import Chart from './Chart';

export default function Planets() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // fetch all planets. yes, there are many more results when request next endpoints, and it can be done recursively as in part 1 of this task. 
        fetchData(PLANETS_API);
    }, []);

    const fetchData = async (url) => {
        const matchedPlanets = [];
        const response = await fetch(url);
        const result = await response.json();

        for (const planet of result.results) {
            // check if planet exist in our pre defined planets
            if (PLANETS.includes(planet.name)) {
                matchedPlanets.push({ name: planet.name, value: planet.population });
                // if we already got all we need then stop the for loop
                if (matchedPlanets.length === PLANETS.length) break;
            }
        }

        // set state with data
        setData(matchedPlanets);
        setIsLoading(false);
    }

    return (
        <div className="planets">
            <Loading
                value={ isLoading }
                text="Getting planets data..." />
            <h3>Planets Chart</h3>
            <Chart data={ data } />
        </div>
    )
}
