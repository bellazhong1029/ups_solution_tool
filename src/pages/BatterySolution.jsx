import * as React from 'react';
import './BatterySolution.css'
import BatterySolutionBlock from '../components/BatterySolutionBlock';
import BatterySolutionOptBlock from '../components/BatterySolutionOptBlock';

import { FormControl, MenuItem, Select, TextField, Button, FormHelperText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

    const [optimizationPanelOpen, setOptimizationPanelOpen] = React.useState(false);
    const handleClose = () => setOptimizationPanelOpen(false);

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
      setResultBatterySolutions([]);
      handleClose();
    };
    const handleChange_backupTime = (event) => {
      setBackupTime(event.target.value);
      setResultBattery([]);
      setResultBatterySolutions([]);
      handleClose();
    };
    const handleChange_temp = (event) => {
      setTemperature(event.target.value);
      setResultBattery([]);
      setResultBatterySolutions([]);
      handleClose();
    };
    const handleChange_batteryType = (event) => {
      setBattery(event.target.value);
      setResultBattery([]);
      setResultBatterySolutions([]);
      handleClose();
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
      setOptimizationPanelOpen(!optimizationPanelOpen);
    } 

    return (
      <div 
        className='BatterySolution' 
        style={{
          "display":"grid",
          "gridTemplateColumns": optimizationPanelOpen? "300px minmax(400px, calc(100% - 800px)) 500px": "300px minmax(400px, calc(100% - 300px)) 0px",
          "transition": "grid-template-columns 0.6s ease"
        }}
      >
          {/* Battery solution parameter selection panel */}
          <div className='BatterySolution-select'>
            <div className='BatterySolution-select-header'>
              Configuration
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

            {/* Button: Show Solutions */}   
            {resultBatterySolutions.length === 0?
              <Button className='BatterySolution-button' variant="contained" sx={{ width: 250 }} onClick={onSubmit}>Show Solutions</Button>:
              <Button className='BatterySolution-button' variant="contained" sx={{ width: 250 }} disabled>Show Solutions</Button>
            }

            {/* Button: View Top Solutions */}   
            {resultBatterySolutions.length === 0?
              <Button className='BatterySolution-button' variant="contained" sx={{ width: 250 }} style={{marginTop:'20px'}} disabled>View Top Solutions</Button>:
              <Button className='BatterySolution-button' variant="contained" sx={{ width: 250 }} style={{marginTop:'20px'}} onClick={onOptimize}>
                {optimizationPanelOpen? "Hide Top Solutions":"View Top Solutions"}
              </Button>
            }        
          </div>

          {/* Battery solutions */}
          <div className='BatterySolution-calc'>
            <div className='BatterySolution-calc-header'>
              Battery Calculation {selectedUpsData.name? '(' + selectedUpsData.name + 'kVA )':''}
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
                  {resultBattery.map(batteryId =>
                  <BatterySolutionBlock
                    selectedBatteryId={batteryId}
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

          {/* Top battery solutions */}
          <div 
            className={`BatterySolution-optimizationPanel ${optimizationPanelOpen ? "visible" : ""}`}
          >
            <div className='BatterySolution-optimizationPanel-row'>
              <div/>
              <div className='BatterySolution-optimizationPanel-header'>Top Battery Solutions</div>
              <div onClick={handleClose}>
                <CloseIcon 
                  sx={{'&:hover': {backgroundColor: '#dcdcdc', borderRadius: '3px'}}}
                />
              </div>
            </div>
            <div className='BatterySolution-optimizationPanel-notes'>
              Please note: <br />
                1. Battery solutions with more than 8 strings are excluded. <br />
                2. Solutions are sorted by price, from lowest to highest.
            </div>

            {/* Panel lables */}
            <BatterySolutionOptBlock />
            {/* Panel content */}
            {resultBatterySolutions.length > 0 ? 
              <div>
                {resultBatterySolutions
                .filter(solution => solution.strings <= 8) // Filter out battery solutions using more than 8 strings
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
              </div>:<div style={{textAlign:"center"}}> Loading...</div>
            }
          </div>
      </div>
    )
}

export default BatterySolution;