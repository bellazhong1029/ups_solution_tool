import * as React from 'react';
import './BatterySolutionOptBlock.css';
import { ReportGenerator } from '../reports/reportGenerator';

import DescriptionIcon from '@mui/icons-material/Description';
import { Packer} from 'docx';
import { saveAs } from 'file-saver';

function BatterySolutionOptBlock({
    pn,
    model, 
    brand, 
    price, 
    strings, 
    blocks,
    imageBatteryPath,
    upsLoad, 
    dcEfficiency, 
    selectedUpsData,
    pmData,
    batteryData,
    batteryCabinetData,
    cableKitData,
    fuseData,
    junctionBoxData
}){
    const [itemList, setItemList] =React.useState([]);

    const voltage = blocks * 10;
    const current = voltage === 0 ? 0: ((upsLoad*1000/dcEfficiency/0.01)/voltage).toFixed(2);
    const currentPerString = (current/strings).toFixed(2);
    const imageUPSPath = selectedUpsData? selectedUpsData.image:'';

    React.useEffect(() => {

    }, [])

    const generateItemList = () => {
        setItemList([]);

        if(selectedUpsData && pmData && batteryData && batteryCabinetData){
            // Add UPS
            const ups = {}
            ups.pn = selectedUpsData.PN;
            ups.description = selectedUpsData.description;
            ups.price = selectedUpsData.price;
            ups.qty = 1;
            setItemList((prev) => [...prev,ups]);

            // Add PMs
            if (selectedUpsData.modular === true) {
                const pm = {};
                const selectedPMData = pmData.find((item) => item.PN === selectedUpsData.PM);
                pm.pn = selectedPMData.PN;
                pm.description = selectedPMData.description;
                pm.price = selectedPMData.price;
                pm.qty = Math.ceil(upsLoad/selectedPMData.load)
                setItemList((prev) => [...prev,pm]);
            }            

            // Add batteries
            const battery = {};
            const selectedBatteryData = batteryData.find((item) => item.PN === pn);
            battery.pn = selectedBatteryData.PN;
            battery.description = selectedBatteryData.description;
            battery.price = selectedBatteryData.price;
            battery.qty = strings * blocks;
            setItemList((prev) => [...prev,battery]);
        
            // Add battery frames or cabinets
            const bc = {};
            const selectedBCData = batteryCabinetData.find((item) => 
                item.type === selectedBatteryData.batteryCabinet && item.size === (currentPerString > 400 ? "NH3" : "NH2")
            );
            bc.pn = selectedBCData.PN;
            bc.description = selectedBCData.description;
            bc.price = selectedBCData.price;
            bc.qty = strings;
            setItemList((prev) => [...prev,bc]);

            // Add cable kits
            const ck = {};
            const ckList = cableKitData.filter(item => item.type === selectedBatteryData.batteryCabinet && item.maxAmp > currentPerString);
            const selectedCKData = ckList.reduce((prev, curr) => {
                return (prev.maxAmp < curr.maxAmp) ? prev : curr;
            }, ckList[0]);
            ck.pn = selectedCKData.PN;
            ck.description = selectedCKData.description;
            ck.price = selectedCKData.price;
            ck.qty = strings;
            setItemList((prev) => [...prev,ck]);

            // Add fuses
            const fuse = {};
            const fuseList = fuseData.filter(item => item.size === (currentPerString > 400 ? "NH3" : "NH2") && item.maxAmp > currentPerString);
            const selectedFuseData = fuseList.reduce((prev, curr) => {
                return (prev.maxAmp < curr.maxAmp) ? prev : curr;
            }, fuseList[0]);
            fuse.pn = selectedFuseData.PN;
            fuse.description = selectedFuseData.description;
            fuse.price = selectedFuseData.price;
            fuse.qty = strings * 2;
            setItemList((prev) => [...prev,fuse]);

            // Add junction box and its fuses
            if(strings > 2 && strings < 9) {
                // Add junction box
                const junctionBox = {};
                let selectedJunctionBoxData;
                if (strings === 3 && current <= 250){
                    selectedJunctionBoxData = junctionBoxData.find(item => item.maxStrings === 3);
                }else{
                    const junctionBoxList = junctionBoxData.filter(item => item.maxAmp > current);
                    selectedJunctionBoxData = junctionBoxList.reduce((prev, curr) => {
                        return (prev.maxAmp < curr.maxAmp) ? prev : curr;
                    }, junctionBoxList[0]);
                }
                junctionBox.pn = selectedJunctionBoxData.PN;
                junctionBox.description = selectedJunctionBoxData.description;
                junctionBox.price = selectedJunctionBoxData.price;
                junctionBox.qty = 1;
                setItemList((prev) => [...prev,junctionBox]);

                // Add junction box fuses
                const junctionBoxFuse = {};
                let selectedJunctionBoxFuseData;
                if (current <= 650){
                    const junctionBoxFuseList = fuseData.filter(item => item.maxAmp > current);
                    selectedJunctionBoxFuseData = junctionBoxFuseList.reduce((prev, curr) => {
                        return (prev.maxAmp < curr.maxAmp) ? prev : curr;
                    }, junctionBoxFuseList[0]);
                    junctionBoxFuse.qty = 2;
                }else{
                    const fuse500 = fuseData.find(item => item.model === "NH3_500");
                    const fuse500quotient = Math.floor(current / fuse500.maxAmp);
                    const fuse500remainder = current % fuse500.maxAmp;

                    const fuse630 = fuseData.find(item => item.model === "NH3_630");
                    const fuse630quotient = Math.floor(current / fuse630.maxAmp);
                    const fuse630remainder = current % fuse630.maxAmp;

                    if (fuse500remainder === 0){
                        selectedJunctionBoxFuseData = fuse500;
                        junctionBoxFuse.qty = fuse500quotient * 2;
                    }else if (fuse630remainder === 0){
                        selectedJunctionBoxFuseData = fuse630;
                        junctionBoxFuse.qty = fuse630quotient * 2;
                    }else if (fuse500remainder > fuse630remainder){
                        selectedJunctionBoxFuseData = fuse500;
                        junctionBoxFuse.qty = (fuse500quotient + 1) * 2;
                    }else {
                        selectedJunctionBoxFuseData = fuse630;
                        junctionBoxFuse.qty = (fuse630quotient + 1) * 2;
                    }
                }
                junctionBoxFuse.pn = selectedJunctionBoxFuseData.PN;
                junctionBoxFuse.description = selectedJunctionBoxFuseData.description;
                junctionBoxFuse.price = selectedJunctionBoxFuseData.price;
                setItemList((prev) => [...prev,junctionBoxFuse]);
            }
        };
    }

    const handleDownload = async () => {
        try {
            await generateItemList();

            // Create a Word document with text and the image
            const reportGenerator = new ReportGenerator();
            const report = await reportGenerator.create(
                imageUPSPath,
                imageBatteryPath,
                itemList
            );
    
            // Create the .docx file and save it
            const blob = await Packer.toBlob(report);
            saveAs(blob, 'download.docx');
        } catch (error) {
            console.error('Error generating document:', error);
        }
    };

    if (model){
        return (
            <div className='BatterySolutionOptBlock'>
                <div className='BatterySolutionOptBlock-row'>{model}</div>
                <div className='BatterySolutionOptBlock-row'>{brand}</div>
                <div className='BatterySolutionOptBlock-row'>{price}</div>
                <div className='BatterySolutionOptBlock-row'>{strings}</div>
                <div className='BatterySolutionOptBlock-row'>{blocks}</div>
                <div className='BatterySolutionOptBlock-row'>{blocks * strings}</div>
                <div className='BatterySolutionOptBlock-row'>{voltage}</div>
                <div className='BatterySolutionOptBlock-row'>{current}</div>
                <div className='BatterySolutionOptBlock-row' onClick={handleDownload}><DescriptionIcon/></div>
            </div>
        )
    }else{
        return (
            <div className='BatterySolutionOptBlock-labels'>
                <div className='BatterySolutionOptBlock-row'>Model</div>
                <div className='BatterySolutionOptBlock-row'>Brand</div>
                <div className='BatterySolutionOptBlock-row'>Price (€)</div>
                <div className='BatterySolutionOptBlock-row'>Strings</div>
                <div className='BatterySolutionOptBlock-row'>Blocks</div>
                <div className='BatterySolutionOptBlock-row'>Totoal Blocks</div>
                <div className='BatterySolutionOptBlock-row'>Voltage (V)</div>
                <div className='BatterySolutionOptBlock-row'>Current (A)</div>
                <div className='BatterySolutionOptBlock-row'>Report</div>
            </div>
        )
    }
}

export default BatterySolutionOptBlock;
