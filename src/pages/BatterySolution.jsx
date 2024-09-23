import * as React from 'react';
import './BatterySolution.css'
import BatterySolutionBlock from '../components/BatterySolutionBlock';

import { FormControl, MenuItem, Select, TextField } from '@mui/material';

function BatterySolution(){
    const [upsModel, setUpsModel] = React.useState('');
    const [backupTime, setBackupTime] = React.useState(5);
    const [temperature, setTemperature] = React.useState(20);
    const [battery, setBattery] = React.useState('');
    const [upsLoad, setUpsLoad] = React.useState(20);

    // TODO: Complete ups model list
    const upsModels = ['DPH G2 200', 'DPH120', 'DPH150', 'DPH200', 'DPH300', 'DPH500','DPH600', 'DPH75', 'DPH80', 'DPS300'];
    const backupTimes = [5, 10, 15, 20, 30, 45, 60]
    const temperatures = [20, 25]
    // TODO: Complete battery model list
    const batteryCategory = ['24-65 Ah', '70-105 Ah', '120-200 Ah', 'Exide','Monbat', 'Leoch', 'Yuasa','CSB Hitachi']

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
      setUpsLoad(event.target.value)
    }

    return (
      <div className='BatterySolution'>
          <div className='BatterySolution-select'>
            <div className='BatterySolution-select-header'>
              <h>Configuration</h>
            </div>
            <div className='BatterySolution-selectItem'>
              <p className='title'>UPS Model:</p>
              <FormControl sx={{ minWidth: 120 }} size='small'>
                <Select
                  value={upsModel}
                  onChange={handleChange_UpsModel}
                >
                  {upsModels.map((model, index) => (
                    <MenuItem value={model}>{model}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              <FormControl sx={{ minWidth: 120 }} size='small'>
                <Select
                  value={battery}
                  onChange={handleChange_batteryType}
                >
                  {batteryCategory.map((type, index) => (
                    <MenuItem value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className='BatterySolution-calc'>
            <div className='BatterySolution-calc-header'>
              <h>Battery Calculation</h>
            </div>
            <div className='BatterySolution-calc-params'>
              <div className='BatterySolution-param'>
                <TextField id="outlined-basic" label='UPS Load (kVA)' variant="outlined" size='small' value={upsLoad} onChange={handleChange_upsLoad}/>
              </div>
              {/* TODO: Add calculatoin formulas */}
              <p className='BatterySolution-calc-param'> DC Efficieny: 93% </p>
              <p className='BatterySolution-calc-param'> Load Percentage: 80% </p>
            </div>
            <div className='BatterySolution-result'>
              <BatterySolutionBlock/>
              <BatterySolutionBlock/>
              <BatterySolutionBlock/>
              <BatterySolutionBlock/>
              <BatterySolutionBlock/>
            </div>
          </div>
      </div>
    )
}

export default BatterySolution;