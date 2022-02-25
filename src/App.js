import React from 'react';
import VehicleTable from './components/VehicleTable';
import Chart from './components/Planets';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Star Wars</h1>
      <VehicleTable />
      <Chart />
    </div>
  );
}

export default App;
