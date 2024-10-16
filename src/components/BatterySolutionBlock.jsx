import * as React from 'react';
import './BatterySolutionBlock.css';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function BatterySolutionBlock({
    selectedBatteryId, 
    upsLoad,
    dcEfficiency,
    temperature,
    backupTime,
    batteryData,
    selectedUpsData,
    resultBatterySolutions, 
    setResultBatterySolutions
}){
    const [batteryModel, setBatteryModel] =React.useState('');
    const [selectedBatteryData, setSelectedBatteryData] = React.useState('');
    const [discharge, setDischarge] = React.useState('');

    const [optimalBlocks, setOptimalBlocks] = React.useState(0)
    const [optimalStrings, setOptimalStrings] = React.useState(0)
    const [optimalPrice, setOptimalPrice] = React.useState(0)

    // Initial rendering for battery solution data
    React.useEffect(() => {
        let battery = batteryData.filter(battery => battery.id === selectedBatteryId);

        setSelectedBatteryData(battery[0]);
        setBatteryModel(battery[0].model);
        lookupDischarge(battery);
    }, [selectedBatteryId])

    function lookupDischarge(battery){
        let discharge = 0;
        if(temperature === 20){
            if(backupTime === 5){discharge = battery[0].dischargeAt20[0];}
            if(backupTime === 10){discharge = battery[0].dischargeAt20[1];}
            if(backupTime === 15){discharge = battery[0].dischargeAt20[2];}
            if(backupTime === 20){discharge = battery[0].dischargeAt20[3];}
            if(backupTime === 30){discharge = battery[0].dischargeAt20[4];}
            if(backupTime === 45){discharge = battery[0].dischargeAt20[5];}
            if(backupTime === 60){discharge = battery[0].dischargeAt20[6];}
        }else{
            if(backupTime === 5){discharge = battery[0].dischargeAt25[0];}
            if(backupTime === 10){discharge = battery[0].dischargeAt25[1];}
            if(backupTime === 15){discharge = battery[0].dischargeAt25[2];}
            if(backupTime === 20){discharge = battery[0].dischargeAt25[3];}
            if(backupTime === 30){discharge = battery[0].dischargeAt25[4];}
            if(backupTime === 45){discharge = battery[0].dischargeAt25[5];}
            if(backupTime === 60){discharge = battery[0].dischargeAt25[6];}
        }
        setDischarge(discharge);
    }

    function calculateNumofStrings(blockNum){
        const numofStrings = Math.ceil((parseInt(upsLoad, 10) / dcEfficiency * 1000 * 100)/ (blockNum * discharge));
        return numofStrings;
    }

    function calculatePrice(blockNum){
        const numofStrings = Math.ceil((parseInt(upsLoad, 10) / dcEfficiency * 1000 * 100)/ (blockNum * discharge));
        const price = (numofStrings * blockNum * selectedBatteryData.price + numofStrings * 3000).toFixed(2); 

        // Find the optimal solution of the battery type
        if(optimalPrice === 0){
            setOptimalPrice(price);
            setOptimalStrings(numofStrings);
            setOptimalBlocks(blockNum);
        }else{
            if(price < optimalPrice){
                setOptimalPrice(price);
                setOptimalStrings(numofStrings);
                setOptimalBlocks(blockNum);
            }
        }

        return price;
    }

    const handleChange_batteryModel = (event) => {
        setBatteryModel(event.target.value);
    };

    // Re-rendering when battery model changes 
    React.useEffect(() => {
        if (batteryModel){
            let battery = batteryData.filter(battery => battery.model === batteryModel);
            setSelectedBatteryData(battery[0]);
            lookupDischarge(battery);
        }
    }, [batteryModel])

    // Return the most optimal battery solution 
    React.useEffect(() => {
        if(batteryModel && optimalPrice && optimalBlocks && optimalStrings){
            setResultBatterySolutions((prev) => 
                [...prev,{
                    pn: selectedBatteryData.PN,
                    brand: selectedBatteryData.brand,
                    image: selectedBatteryData.image,
                    model: batteryModel,
                    price: optimalPrice,
                    blocks: optimalBlocks,
                    strings: optimalStrings
                }]
            );
        }
    }, [optimalPrice])
    
    return (
        <div className='BatterySolutionBlock'>
            <div className='BatterySolutionBlock-top'>
                <div className='BatterySolutionBlock-left'>
                    No. of 12V Blocks in one Battery String
                </div>
                <div className='BatterySolutionBlock-right'>
                    <div className='BatterySolutionBlock-row'>
                        <FormControl sx={{ width: 200 }} size='small'>
                            <InputLabel id="demo-simple-select-label">Battery</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Options"
                                value={batteryModel}
                                onChange={handleChange_batteryModel}
                                sx={{ color: 'white'}}
                            >
                                {batteryData.map((battery) => (
                                    <MenuItem key={battery.id} value={battery.model}>{battery.model}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='BatterySolutionBlock-row'>Brand: <b style={{marginLeft: '3px'}}> {selectedBatteryData.brand} </b></div>
                    <div className='BatterySolutionBlock-row'>Capacity: <b style={{marginLeft: '3px'}}> {selectedBatteryData.capacity} </b> Ah</div>
                    <div className='BatterySolutionBlock-row'>
                        <div style={{border:'1px solid #eee', padding:'2px 8px', marginRight: '18px'}}>Strings</div>
                        <div style={{border:'1px solid #eee', padding:'2px 8px'}}>Solution Price</div>
                    </div>
                </div>
            </div>

            <div className='BatterySolutionBlock-bottom'>
                <div className='BatterySolutionBlock-left'>
                    {selectedUpsData.NumofBlocksinOneString.map((blockNum, index) => (
                        <div style={{backgroundColor: index % 2 === 0?'#dcdcdc':'#f5f5f5'}}>{blockNum}</div>
                    ))}
                </div>
                <div className='BatterySolutionBlock-right'>
                    {/* Number of Strings */}
                    <div style={{width:'100%'}}>
                        {selectedUpsData.NumofBlocksinOneString.map((blockNum, index) => (
                            <div style={{backgroundColor: index % 2 === 0?'#dcdcdc':'#f5f5f5'}}>
                                {calculateNumofStrings(blockNum)}
                            </div>
                        ))}
                    </div>
                    {/* Solution Price */}
                    <div style={{width:'100%'}}>
                        {selectedUpsData.NumofBlocksinOneString.map((blockNum, index) => (
                            <div style={{backgroundColor: index % 2 === 0?'#dcdcdc':'#f5f5f5'}}>
                                {calculatePrice(blockNum)} €
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BatterySolutionBlock;