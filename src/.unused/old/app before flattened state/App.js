import React, {useEffect, useRef, useState} from 'react';
import BoostTable from "./Elements/Table/BoostTable";
import SettingsForm from "./Elements/Form/SettingsForm";
import parseNumber from "./Main/helpers/parseNumber";
import {
    calculateBoostEffectiveness,
    calculateEggLayingRate, calculateFleetSize,
    calculateHabCapacity,
    calculateIHR, calculateSettings,
    calculateShippingCapacity
} from "./Main/calculateSettings";
import roundFloat from "./Main/helpers/roundFloat";
import formatNumber from "./Main/helpers/formatNumber";
import getAllResearch from "./Main/resources/researches";



function App() {
    //console.log(formatNumber(8_928_000*1617.8085*20160,1))
    //max_hab_capacity: 14175000000,//9723000000,//11340000000,//9500000000,//14175000000,

    // let initialSettings = {
    //     artifacts: {
    //              //puzzleCube:{value:'',defaultValue: 0, influences: [], label:"Puzzle Cube: +", rightLabel:"%"},
    //               //necklace: {value:'',defaultValue: 0, influences: [], label:"Demeters Necklace: +", rightLabel:"%"},
    //            //martianDust: {value:'',defaultValue: 0, influences: [], label:"Vial of Martian Dust: +", rightLabel:"%"},
    //           //tungstenAnkh: {value:'',defaultValue: 0, influences: [], label:"Tungsten Ankh: +", rightLabel:"%"},
    //                   gusset: {value:'',defaultValue: 0, influences: [], label:"Gusset: +", rightLabel:"% Hab space"},
    //                 //compass:{value:'',defaultValue: 0, influences: [], label:"Interstellar Compass: +", rightLabel:"%"},
    //                  chalice: {value:'',defaultValue: 0, influences: ["internalHatcheryRate"], label:"Chalice: +", rightLabel:"% chickens/min"},
    //                metronome: {value:'',defaultValue: 0, influences: ["eggLayingRate"], label:"Quantum Metronome: +", rightLabel:"% eggs/min"},
    //                  monocle: {value:'',defaultValue: 0, influences: [], label:"Dilithium Monocle: +", rightLabel:"%"},
    //            //bookOfBasan: {value:'',defaultValue: 0, influences: [], label:"Book of Basan: +", rightLabel:"%"},
    //            //shipInBottle:{value:'',defaultValue: 0, influences: [], label:"Ship in a Bottle: +", rightLabel:"%"},
    //         tachyonDeflector: {value:'',defaultValue: 0, influences: ["eggLayingRate"], label:"Tachyon Deflector(s): +", rightLabel:"% eggs/min (effect from others)"},
    //     },
    //     stones:{
    //         //shell:{defaultValue: 0, label:"", rightLabel:""},
    //         ////tachyon:{defaultValue: 0, label:"", rightLabel:""},
    //         //terra:{defaultValue: 0, label:"", rightLabel:""},
    //         //soul:{defaultValue: 0, label:"", rightLabel:""},
    //         ////dilithium:{defaultValue: 0, label:"", rightLabel:""},
    //         //quantum:{defaultValue: 0, label:"", rightLabel:""},
    //         ////life:{defaultValue: 0, label:"", rightLabel:""},
    //         //prophecy:{defaultValue: 0, label:"", rightLabel:""},
    //     },
    //     research:{
    //                 epicComfyNests: {value: 0, step: 5, max:100, influences: ["eggLayingRate"], label:"Epic Comfy Nests:"},
    //                     comfyNests: {value: 0, step:10, max:500, influences: ["eggLayingRate"], label:"Comfortable Nests"},
    //                     henHouseAC: {value: 0, step: 5, max:250, influences: ["eggLayingRate"], label:"Hen House A/C"},
    //               improvedGenetics: {value: 0, step:15, max:450, influences: ["eggLayingRate"], label:"Improved Genetics"},
    //                timeCompression: {value: 0, step:10, max:200, influences: ["eggLayingRate"], label:"Time Compression"},
    //              timelineDiversion: {value: 0, step: 2, max:100, influences: ["eggLayingRate"], label:"Timeline Diversion"},
    //         relativityOptimization: {value: 0, step:10, max:100, influences: ["eggLayingRate"], label:"Relativity Optimization"}
    //     },
    //     contractSettings:{
    //             timeRemaining: {value:''+(24*60*14), defaultValue: 0, label:"Time Remaining: \u00A0", rightLabel:"min"},
    //             tokenInterval: {value:'5',           defaultValue: 0, label:"Boost Token Interval: \u00A0", rightLabel:"min"},
    //             eggsRemaining: {value:'200q',        defaultValue: 0, label:"Contract Egg Goal: \u00A0", rightLabel:""},
    //         initialPopulation: {value:'',            defaultValue: 0, label:"Starting Population: \u00A0", rightLabel:" Chickens"},
    //          initialEggsLayed: {value:'',            defaultValue: 0, label:"Starting eggs layed: \u00A0", rightLabel:" "},
    //             initialTokens: {value:'',            defaultValue: 0, label:"Starting tokens: \u00A0", rightLabel:" tokens"},
    //
    //     },
    //     calculated:{
    //                eggLayingRate: {value:''+stringELR, defaultValue: 0, updateFunction: calculateEggLayingRate, label:"Egg Laying Rate: \u00A0", rightLabel:" Eggs/Min/Chicken"},
    //         internalHatcheryRate: {value:'7440',       defaultValue: 0, updateFunction: calculateIHR, label:"Internal Hatchery Rate: \u00A0", rightLabel:"Chickens/Min/Hab"},
    //             shippingCapacity: {value:'',           defaultValue: 0, updateFunction: ()=>0, label:"Shipping Capacity: \u00A0", rightLabel:""},
    //                  habCapacity: {value:'',           defaultValue: 0, updateFunction: ()=>0, label:"Max Hab Capacity: \u00A0", rightLabel:""},
    //     }
    // }
    let initialSettings = {
        artifacts: {
                      gusset: {value:'',defaultValue: 0, influences: ["habCapacity"], label:"Gusset: \xA0", rightLabel:"% Hab space"},
                     compass: {value:'',defaultValue: 0, influences: ["shippingCapacity"], label:"Interstellar Compass: \xA0", rightLabel:"% eggs/min"},
                     chalice: {value:'',defaultValue: 0, influences: ["internalHatcheryRate"], label:"Chalice: \xA0", rightLabel:"% chickens/min"},
                   metronome: {value:'',defaultValue: 0, influences: ["eggLayingRate"], label:"Quantum Metronome: \xA0", rightLabel:"% eggs/min"},
                     monocle: {value:'',defaultValue: 0, influences: ["boostEffectiveness"], label:"Dilithium Monocle: \xA0", rightLabel:"%"},
            tachyonDeflector: {value:'',defaultValue: 0, influences: ["eggLayingRate"], label:"Tachyon Deflector(s): +", rightLabel:"% Eggs/min (effect from others)"},
        },
        stones:{
        },
        research:{
            //         epicComfyNests: {value: 10000/*0*/, step: 5, max:100, influences: ["eggLayingRate"], label:"Epic Comfy Nests:"},
            //             comfyNests: {value: 500/*0*/, step:10, max:500, influences: ["eggLayingRate"], label:"Comfortable Nests"},
            //             henHouseAC: {value: 250/*0*/, step: 5, max:250, influences: ["eggLayingRate"], label:"Hen House A/C"},
            //       improvedGenetics: {value: 450/*0*/, step:15, max:450, influences: ["eggLayingRate"], label:"Improved Genetics"},
            //        timeCompression: {value: 200/*0*/, step:10, max:200, influences: ["eggLayingRate"], label:"Time Compression"},
            //      timelineDiversion: {value: 100/*0*/, step: 2, max:100, influences: ["eggLayingRate"], label:"Timeline Diversion"},
            // relativityOptimization: {value: 0, step:10, max:100, influences: ["eggLayingRate"], label:"Relativity Optimization"}
        },
        contractSettings:{
            timeRemaining: {value:''+(24*60*14), defaultValue: 0, label:"Time Remaining: \xA0", rightLabel:"min"},
            tokenInterval: {value:'5',           defaultValue: 0, label:"Boost Token Interval: \xA0", rightLabel:"min"},
            eggsRemaining: {value:'200q',        defaultValue: 0, label:"Contract Egg Goal: \xA0", rightLabel:""},
            initialPopulation: {value:'',        defaultValue: 0, label:"Starting Population: \xA0", rightLabel:" Chickens"},
            initialEggsLayed: {value:'',         defaultValue: 0, label:"Starting Eggs Layed: \xA0", rightLabel:""},
            initialTokens: {value:'',            defaultValue: 0, label:"Starting Tokens: \xA0", rightLabel:" Tokens"},

        },
        calculated:{
                   eggLayingRate: {value:''/*''+stringELR*/,   defaultValue: 0, updateFunction: calculateEggLayingRate,                                      label:"Egg Laying Rate: \xA0",        rightLabel:"Eggs/min/Chicken"},
            internalHatcheryRate: {value:''/*'7440'*/,         defaultValue: 0, updateFunction: calculateIHR,                                                label:"Internal Hatchery Rate: \xA0", rightLabel:"Chickens/min/Hab"},
                shippingCapacity: {value:'99Q'/*'9.5T'*/,      defaultValue: 0, updateFunction: calculateShippingCapacity,                                   label:"Shipping Capacity: \xA0",      rightLabel:"Eggs/min"},
                     habCapacity: {value:'250',                defaultValue: 0, updateFunction: calculateHabCapacity,                                        label:"Max Hab Capacity: \xA0",       rightLabel:"Chickens"},
                       fleetSize: {value:'4',                  defaultValue: 0, updateFunction: calculateFleetSize,         influences: ["shippingCapacity"],label:"Max Fleet Size: \xA0",       rightLabel:"Vehicles",},
              boostEffectiveness: {value:'1',                  defaultValue: 1, updateFunction: calculateBoostEffectiveness,                                 label:"Boost Boost: \xA0",            rightLabel:"%", hidden:true},
                   boostDuration: {value:'1',                  defaultValue: 1, updateFunction: ()=>0,                                                       label:"Boost Duration: \xA0",         rightLabel:"%", hidden:true},
        }
    }

    initialSettings.research = Object.fromEntries(getAllResearch().map((research)=>{
        return [research.id, {...research,value:0}]
    }));

    Object.keys(initialSettings).forEach(key =>{initialSettings[key].getValues =  function(){
        return Object.fromEntries(Object.entries(this).filter(([k,v])=>k!=='getValues').map(([k,v])=>{
            let o = this[k];
            let default_val = (typeof o.defaultValue === 'undefined') ? 0 : o.defaultValue
            return [k,(o.value==='') ? default_val : parseNumber(o.value)];
        }));
    }});


    let initialCalculatedSettings = ["egg_laying_rate", "internal_hatchery_rate", "hab_capacity","shipping_capacity", "fleet_size"].map(function underscoreToCamelCase(a){
        let capitalize = (a) => a.charAt(0).toUpperCase() + a.substring(1)
        return a.split("_").map((b,i)=>(i>0)?capitalize(b):b).join("")
    })
    calculateSettings(initialSettings, initialCalculatedSettings)//TODO: if manually setting any initial calculated settings, set them after this.


    const [settings, setSettings] = useState(initialSettings);
    //console.log(settings.calculated.eggLayingRate)

    let table=useRef(null)

    function createTable(newSettings){
        table.current=<BoostTable settings={newSettings}/>
        setSettings(newSettings)
    }


    return(
        <>
            <h1 style={{fontSize:"2.5em", marginLeft:"20px"}}> Egg Inc. Boost Calculator for contracts</h1>
            <div >{/*style = {{position:"sticky", top:"0", backgroundColor:"white", width:"100vw", zIndex:"9999"}}>*/}
                <SettingsForm settings={settings} setSettings = {createTable}/>
            </div>
            <div > {/*style={{display: "block", height: "80vh",overflow: "scroll", width: "auto"}}>*/}
                {table.current}
            </div>

        </>

    );
}

export default App;
