import * as React from 'react';
import './BatterySolution.css'
import BatterySolutionBlock from '../components/BatterySolutionBlock';
import BatterySolutionOptBlock from '../components/BatterySolutionOptBlock';

import { FormControl, MenuItem, Select, TextField, Button, FormHelperText, Modal, Box } from '@mui/material';

function BatterySolution({
  upsData, 
  pmData, 
  batteryData, 
  batterySelectOptions,
  backupTimeSelectOptions,
  temperatureSelectOptions,
  batteryCabinetData,
  cableKitData,
  fuseData,
  junctionBoxData
}){
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
    const [resultBatterySolutions, setResultBatterySolutions] = React.useState([]);
    const [error, setError] = React.useState('');
    const [info, setInfo] = React.useState('');

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const optimizationPanelStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: 850,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };

    // Once a UPS model is selected, set UPS data and set default load 
    React.useEffect(()=>{
      const selectedUpsData = upsData.find((ups) => ups.name === upsModel)
      if (selectedUpsData){
        setSelectedUpsData(selectedUpsData)
        setUpsLoad(selectedUpsData.defaultLoad)
      }

      if(upsModel === 'DPH G2 200'){
        setInfo('* In 30/32/34 battery configuaraton, UPS output power is de-rated to 80%.');
      }else{
        setInfo('');
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
      setResultBattery([]);
    };
    const handleChange_backupTime = (event) => {
      setBackupTime(event.target.value);
      setResultBattery([]);
    };
    const handleChange_temp = (event) => {
      setTemperature(event.target.value);
      setResultBattery([]);

    };
    const handleChange_batteryType = (event) => {
      setBattery(event.target.value);
      setResultBattery([]);
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
        setResultBatterySolutions([]);

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

    const onOptimize = (event) => {
      handleOpen();
    } 

    return (
      <div className='BatterySolution'>
          {/* Battery solutoin parameter selection panel */}
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
                  {backupTimeSelectOptions.map((backupTime, index) => (
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
                  {temperatureSelectOptions.map((temp, index) => (
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

            {/* Battery solutoin buttons: Show Solution & Optimize */}
            <div className='BatterySolution-buttons'>
              <Button className='BatterySolution-button' variant="contained" sx={{ width: 150 }} onClick={onSubmit}>Show Solution</Button>
              {resultBattery.length === 0?
                <Button className='BatterySolution-button' variant="contained" sx={{ width: 90 }} style={{marginLeft:'10px'}} disabled>Optimize</Button>:
                <Button className='BatterySolution-button' variant="contained" sx={{ width: 90 }} style={{marginLeft:'10px'}} onClick={onOptimize}>Optimize</Button>
              }
            </div>
          </div>

          <div className='BatterySolution-calc'>
            <div className='BatterySolution-calc-header'>
              <h>Battery Calculation ({selectedUpsData.name} kVA)</h>
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
            </div>

            {Array.isArray(resultBattery) && resultBattery.length > 0?
            <div className='BatterySolution-result-container'>
                <div className='BatterySolution-info'>{info}</div>
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
                    resultBatterySolutions={resultBatterySolutions}
                    setResultBatterySolutions={setResultBatterySolutions}
                />)}
              </div>
            </div>: 
            <div className='BatterySolution-loading'> 
                Solutions will be shown here. 
            </div>}
          </div>

          {/* Battery solution optimiyational panel */}
          <Modal
            className='BatterySolution-optimizationPanel'
            open={open}
            onClose={handleClose}
          >
            <Box sx={optimizationPanelStyle}>
              <div className='BatterySolution-optimizationPanel-header'>Optimized Battery Solutions</div>
              {/* Panel lables */}
              <BatterySolutionOptBlock />
              {/* Panel content */}
              {resultBatterySolutions.length > 0 ? 
                <div>
                  {resultBatterySolutions
                  .sort((a, b) => a.price - b.price) // Sort solutions by price
                  .map(solution => {
                    return <BatterySolutionOptBlock
                      pn = {solution.pn}
                      model={solution.model}
                      brand={solution.brand}
                      price={solution.price}
                      strings={solution.strings}
                      blocks={solution.blocks}
                      imageBatteryPath={solution.image}
                      upsLoad={upsLoad} 
                      dcEfficiency={dcEfficiency}
                      selectedUpsData={selectedUpsData}
                      pmData={pmData}
                      batteryData={batteryData}
                      batteryCabinetData={batteryCabinetData}
                      cableKitData={cableKitData}
                      fuseData={fuseData}
                      junctionBoxData={junctionBoxData}
                    />
                  })}
                </div>:<div>Loading...</div>
              }
            </Box>
          </Modal>
      </div>
    )
}

export default BatterySolution;