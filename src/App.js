import './App.css';
import * as React from 'react';
import Header from './components/Header'
import BatterySolution from './pages/BatterySolution';

function App() {
  const [upsData, setUpsData] = React.useState([]);
  const [batteryData, setBatteryData] = React.useState([]);
  // const batterySelectOptions = ['24-65 Ah', '70-105 Ah', '120-200 Ah', 'Exide','Monbat', 'Leoch', 'Yuasa','CSB Hitachi']
  const batterySelectOptions = ['24-65 Ah', '70-105 Ah', '120-200 Ah', 'Exide', 'Yuasa','CSB Hitachi']


  // Read UPS data
  React.useEffect(() => {
    fetch('/database/ups.json')
      .then((response) => response.json())
      .then((jsonData) => setUpsData(jsonData))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

    // Read battery data
    React.useEffect(() => {
      fetch('/database/battery.json')
        .then((response) => response.json())
        .then((jsonData) => setBatteryData(jsonData))
        .catch((error) => console.error('Error fetching data:', error));
    }, []);

  return (
    <div className="App">
      <Header />
      <BatterySolution upsData={upsData} batteryData={batteryData} batterySelectOptions={batterySelectOptions}/>
    </div>
  );
}

export default App;
