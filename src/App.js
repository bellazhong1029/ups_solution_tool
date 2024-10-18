import './App.css';
import * as React from 'react';
import Header from './components/Header'
import BatterySolution from './pages/BatterySolution';

function App() {
  const [upsData, setUpsData] = React.useState([]);
  const [pmData, setPmData] = React.useState([]);
  const [batteryData, setBatteryData] = React.useState([]);
  const [batteryCabinetData, setBattryCabinetData] = React.useState([]);
  const [cableKitData, setCableKitData] = React.useState([]);
  const [fuseData, setFuseData] = React.useState([]);
  const [junctionBoxData, setJunctionBoxData] = React.useState([]);


  const batterySelectOptions = ['24-65 Ah', '70-105 Ah', '120-200 Ah', 'Exide','Monbat', 'Leoch', 'Yuasa','CSB Hitachi']
  const backupTimeSelectOptions = [5, 10, 15, 20, 30, 45, 60]
  const temperatureSelectOptions = [20, 25]

  // Read UPS data
  React.useEffect(() => {
    fetch('/database/ups.json')
      .then((response) => response.json())
      .then((jsonData) => setUpsData(jsonData))
      .catch((error) => console.error('Error fetching UPS data:', error));
  }, []);

  // Read power modules data
  React.useEffect(() => {
    fetch('/database/pm.json')
      .then((response) => response.json())
      .then((jsonData) => setPmData(jsonData))
      .catch((error) => console.error('Error fetching power module data:', error));
  }, []);

  // Read battery data
  React.useEffect(() => {
    fetch('/database/battery.json')
      .then((response) => response.json())
      .then((jsonData) => setBatteryData(jsonData))
      .catch((error) => console.error('Error fetching battery data:', error));
  }, []);

  // Read battery cabinet data
  React.useEffect(() => {
    fetch('/database/batteryCabinet.json')
      .then((response) => response.json())
      .then((jsonData) => setBattryCabinetData(jsonData))
      .catch((error) => console.error('Error fetching battery cabinet data:', error));
  }, []);

  // Read cable kit data
  React.useEffect(() => {
    fetch('/database/cableKit.json')
      .then((response) => response.json())
      .then((jsonData) => setCableKitData(jsonData))
      .catch((error) => console.error('Error fetching cable kit data:', error));
  }, []);

  // Read fuse data
  React.useEffect(() => {
    fetch('/database/fuse.json')
      .then((response) => response.json())
      .then((jsonData) => setFuseData(jsonData))
      .catch((error) => console.error('Error fetching fuse data:', error));
  }, []);

    // Read junction box data
    React.useEffect(() => {
      fetch('/database/junctionBox.json')
        .then((response) => response.json())
        .then((jsonData) => setJunctionBoxData(jsonData))
        .catch((error) => console.error('Error fetching fuse data:', error));
    }, []);

  return (
    <div className="App">
      <Header />
      <BatterySolution 
        upsData={upsData}
        pmData={pmData}
        batteryData={batteryData} 
        batterySelectOptions={batterySelectOptions}
        backupTimeSelectOptions={backupTimeSelectOptions}
        temperatureSelectOptions={temperatureSelectOptions}
        batteryCabinetData={batteryCabinetData}
        cableKitData={cableKitData}
        fuseData={fuseData}
        junctionBoxData={junctionBoxData}
      />
    </div>
  );
}

export default App;
