import * as React from 'react';
import './BatterySolutionBlock.css'

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function BatterySolutionBlock(){
    const [batteryType, setBatteryType] = React.useState('24-65 Ah');
    const BatteryStringNumber = [32,33,34,35,36,38,39]
    const batteryTypes = ['24-65 Ah', '70-105 Ah', '120-200 Ah', 'Exide','Monbat', 'Leoch', 'Yuasa','CSB Hitachi']

    const handleChange_batteryType = (event) => {
        setBatteryType(event.target.value);
    };

    return (
        <div className='BatterySolutionBlock'>
            <div className='BatterySolutionBlock-top'>
                <div className='BatterySolutionBlock-left'>
                    No. of 12V Blocks in one Battery String
                </div>
                <div className='BatterySolutionBlock-right'>
                    <div className='BatterySolutionBlock-row'>
                        <FormControl sx={{ width: 200 }} size='small'>
                            <InputLabel id="demo-simple-select-label">Battery Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Options"
                                value={batteryType}
                                onChange={handleChange_batteryType}
                            >
                                {batteryTypes.map((type, index) => (
                                    <MenuItem value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='BatterySolutionBlock-row'>Brand: <b style={{marginLeft: '3px'}}> Battery brand </b></div>
                    <div className='BatterySolutionBlock-row'>Capacity: <b style={{marginLeft: '3px'}}> 10 Ah </b></div>
                    <div className='BatterySolutionBlock-row'>
                        <div style={{border:'1px solid #eee', padding:'2px 8px', marginRight: '18px'}}>Strings</div>
                        <div style={{border:'1px solid #eee', padding:'2px 8px'}}>Solution Price</div>
                    </div>
                </div>
            </div>

            <div className='BatterySolutionBlock-bottom'>
                <div className='BatterySolutionBlock-left'>
                    {BatteryStringNumber.map((stringNum, index) => (
                        <div style={{backgroundColor: index % 2 === 0?'#dcdcdc':'#f5f5f5'}}>{stringNum}</div>
                    ))}
                </div>
                <div className='BatterySolutionBlock-right'>
                    {/* Number of Strings */}
                    <div style={{width:'100%'}}>
                        {BatteryStringNumber.map((stringNum, index) => (
                            <div style={{backgroundColor: index % 2 === 0?'#dcdcdc':'#f5f5f5'}}>{stringNum}</div>
                        ))}
                    </div>
                    {/* Solution Price */}
                    <div style={{width:'100%'}}>
                        {BatteryStringNumber.map((stringNum, index) => (
                            <div style={{backgroundColor: index % 2 === 0?'#dcdcdc':'#f5f5f5'}}>{stringNum*12} €</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BatterySolutionBlock;