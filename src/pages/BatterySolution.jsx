import * as React from 'react';
import './BatterySolution.css'
import BatterySolutionBlock from '../components/BatterySolutionBlock';

import { FormControl, MenuItem, Select, TextField, Button, FormHelperText } from '@mui/material';

function BatterySolution({upsData, batteryData, batterySelectOptions}){
    const [selectedUpsData, setSelectedUpsData] = React.useState('');
    const [upsModel, setUpsModel] = React.useState('');
    const [backupTime, setBackupTime] = React.useState(5);
    const [temperature, setTemperature] = React.useState(20);
    const [battery, setBattery] = React.useState('');
    const [upsLoad, setUpsLoad] = React.useState('');
    const [loadPercentage, setLoadPercentage] = React.useState('N/A');
    const [dcEfficiency, setDcEfficiency] = React.useState('N/A');
    
    const [resultUPS, setResultUPS] = React.useState('');
    const [resultBattery, setResultBattery] = React.useState([]);
    const [error, setError] = React.useState('');

    const backupTimes = [5, 10, 15, 20, 30, 45, 60]
    const temperatures = [20, 25]

    // Once a UPS model is selected, set UPS data and set default load 
    React.useEffect(()=>{
      let selectedUpsData = upsData.find((ups) => ups.name === upsModel)
      if (selectedUpsData){
        setSelectedUpsData(selectedUpsData)
        setUpsLoad(selectedUpsData.defaultLoad)
      }
    }, [upsModel])


    // When UPS load changes, update load percentage and DC efficiency accordingly
    React.useEffect(()=>{
      if(upsLoad && selectedUpsData) {
        if (upsLoad > selectedUpsData.maxLoad || upsLoad < 0) {
          setError('The UPS Load is out of accepted range: 0 - maximum load')
          setLoadPercentage('N/A')
          setDcEfficiency('N/A')
        }else{
          setError('')

          let upsLoadPercentage = (upsLoad/selectedUpsData.maxLoad*100).toFixed(2);
          let upsLoadLevel = Math.floor(upsLoadPercentage/10)
          setLoadPercentage(upsLoadPercentage)
          setDcEfficiency(selectedUpsData.dcEfficiency[upsLoadLevel])
        }
      }
    }, [upsLoad] )

    const handleChange_UpsModel = (event) => {
        setUpsModel(event.target.value);
    };
    const handleChange_backupTime = (event) => {
      setBackupTime(event.target.value);
    };
    const handleChange_temp = (event) => {
      setTemperature(event.target.value);
    };
    const handleChange_batteryType = (event) => {
      setBattery(event.target.value);
    };
    const handleChange_upsLoad = (event) => {
      setUpsLoad(event.target.value.trim());
    }

    const onSubmit = (event) => {
      event.preventDefault();
      
      if (upsModel === ''){
        setError('Please select a UPS model.');
      }else if (battery === ''){
        setError('Please select a battery type.');
      }else if (upsLoad === ''){
        setError('Please enter a valid value for UPS load.');
      }else {
        setError('');
        setResultBattery([]);

        // Get UPS data matching selected UPS model
        let ups = upsData.filter(u => u.name === upsModel);
        setResultUPS(ups[0]);

        // Get all battery types matching the criteria
        let batteries = [];
        if (battery === '24-65 Ah'){
          batteries = batteryData.filter(battery => battery.capacity >= 24 && battery.capacity <= 65);
        }else if( battery === '70-105 Ah'){
          batteries = batteryData.filter(battery => battery.capacity >= 70 && battery.capacity <= 105);
        }else if( battery === '120-200 Ah'){
          batteries = batteryData.filter(battery => battery.capacity >= 120 && battery.capacity <= 200);
        }else{
          batteries = batteryData.filter(b => b.brand === battery);
        }

        batteries.map((battery) => {
          setResultBattery((prev) => [...prev, battery.id]);
        });
    }}

    return (
      <div className='BatterySolution'>
          <div className='BatterySolution-select'>
            <div className='BatterySolution-select-header'>
              <h>Configuration</h>
            </div>
            <div className='BatterySolution-selectItem'>
              <p className='title'>UPS Model:</p>
              {error !== '' && error.includes('model')? 
              <FormControl sx={{ width: 132 }} size='small' error>
                <Select
                  value={upsModel}
                  onChange={handleChange_UpsModel}
                >
                  {upsData.map((ups) => (
                    <MenuItem key={ups.id} value={ups.name}>{ups.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{error}</FormHelperText>
              </FormControl>:
              <FormControl sx={{width: 132 }} size='small'>
                <Select
                  value={upsModel}
                  onChange={handleChange_UpsModel}
                >
                  {upsData.map((ups) => (
                    <MenuItem key={ups.id} value={ups.name}>{ups.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>}
              <p className='unit'>kVA</p>
            </div> 
            <div className='BatterySolution-selectItem'>
              <p className='title'>Backup Time:</p>
              <FormControl sx={{ minWidth: 120 }} size='small'>
                <Select
                  value={backupTime}
                  onChange={handleChange_backupTime}
                >
                  {backupTimes.map((backupTime, index) => (
                    <MenuItem value={backupTime}>{backupTime}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <p className='unit'>mins</p>
            </div>
            <div className='BatterySolution-selectItem'>
              <p className='title'>Temperature:</p>
              <FormControl sx={{ minWidth: 120 }} size='small'>
                <Select
                  value={temperature}
                  onChange={handleChange_temp}
                >
                  {temperatures.map((temp, index) => (
                    <MenuItem value={temp}>{temp}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <p className='unit'>°C</p>
            </div>
            <div className='BatterySolution-selectItem'>
              <p className='title'>Battery:</p>
              {error !== '' && error.includes('battery')? 
              <FormControl sx={{ width: 160 }} size='small' error>
                <Select
                  value={battery}
                  onChange={handleChange_batteryType}
                >
                  {batterySelectOptions.map((type, index) => (
                    <MenuItem value={type}>{type}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{error}</FormHelperText>
              </FormControl>: 
              <FormControl sx={{ width: 160 }} size='small'>
                <Select
                  value={battery}
                  onChange={handleChange_batteryType}
                >
                  {batterySelectOptions.map((type, index) => (
                    <MenuItem value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              }
            </div>
          </div>

          <div className='BatterySolution-calc'>
            <div className='BatterySolution-calc-header'>
              <h>Battery Calculation</h>
            </div>
            <div className='BatterySolution-calc-params'>
              <div>
                {error !== '' && error.includes('load')? 
                <TextField id="outlined-basic" label='UPS Load (kVA)' variant="outlined" size='small' value={upsLoad} onChange={handleChange_upsLoad} sx={{ width: 205 }} helperText={error} error/> :
                <TextField id="outlined-basic" label='UPS Load (kVA)' variant="outlined" size='small' value={upsLoad} onChange={handleChange_upsLoad} sx={{ width: 205 }}/>
                }
              </div>
              <p className='BatterySolution-calc-param'> DC Efficieny: {dcEfficiency} % </p>
              <p className='BatterySolution-calc-param'> Load Percentage: {loadPercentage} % </p>
              <div>
                <Button variant="contained" onClick={onSubmit} sx={{ width: 205 }}>Show Solution</Button>
              </div>
            </div>
            {Array.isArray(resultBattery) && resultBattery.length > 0? 
            <div className='BatterySolution-result'>
              {resultBattery.map(battery =>
                <BatterySolutionBlock
                  selectedBatteryId={battery}
                  upsLoad={upsLoad} 
                  dcEfficiency={dcEfficiency}
                  temperature={temperature}
                  backupTime={backupTime}
                  batteryData={batteryData}
                  selectedUpsData={resultUPS} 
              />)}
            </div>: 
            <div className='BatterySolution-loading'> 
                Solutions will be shown here. 
            </div>}
          </div>
      </div>
    )
}

export default BatterySolution;