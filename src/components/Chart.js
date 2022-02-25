import React, { useEffect, useState } from 'react';
import Bar from './Bar';

export default function Chart({ data }) {
    const [chartItems, setChartItems] = useState([]);

    useEffect(() => {
        initChartForAnimation();
    }, [data])

    // helper function - should be outside component when project is larger
    const getHighestValue = () => {
        let best = 0;
        for (const row of data) best = Math.max(best, row.value);

        return best;
    }

    const calcualteChartItems = () => {
        /* at the beggining i wrote this inside the planets iteration in parent component which is better for performance,
        but as this chart component needs to be more generic and be used with other components, logic should stay here */
        const highestValue = getHighestValue();

        // calcualte each bar height by highest value found in data
        const chartFixedData = data.map(item => {
            return Object.assign(item, { height: (item.value / highestValue * 100) + 5 });
        });

        // set state with new data
        setChartItems(chartFixedData);
    }

    const initChartForAnimation = () => {
        // this is not mandatory at all, i added this just for the animation to start when loading. another solution is to set initial state of pre defined items
        setChartItems(data.map(item => Object.assign(item, { height: 0 })));
        setTimeout(calcualteChartItems, 0);
    }

    return (
        <div className="chart">
            { chartItems.map((item, i) => {
                return <Bar
                    key={ `bar-${i}` }
                    value={ item.value }
                    height={ item.height }
                    label={ item.name }/>
            })}
        </div>
    )
}
