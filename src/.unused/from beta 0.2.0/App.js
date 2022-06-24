import React, {useEffect, useRef, useState} from 'react';
import BoostTable from "./Elements/Table/BoostTable";
import SettingsForm from "./Elements/Form/SettingsForm";
import parseNumber from "./Main/helpers/parseNumber";
import {
    calculateBoostDuration,
    calculateBoostEffectiveness,
    calculateEggLayingRate, calculateFleetSize,
    calculateHabCapacity,
    calculateIHR, calculateSettings,
    calculateShippingCapacity
} from "./Main/calculateSettings";
import roundFloat from "./Main/helpers/roundFloat";
import formatNumber from "./Main/helpers/formatNumber";
import getAllResearch from "./Main/resources/researches";
import getAllVehicles from "./Main/resources/vehicles";
import getAllHabs from "./Main/resources/habs";
import getAllStones from "./Main/resources/stones";
import getAllDailyEvents from "./Main/resources/dailyEvents";



function App() {
    console.log(formatNumber(1048974609375,3))
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
    //     }
    //     }

    let allResearch = getAllResearch()
    let allVehicles = getAllVehicles()
    let allHabs     = getAllHabs()
    let allStones   = getAllStones()
    let allDailyEvents = getAllDailyEvents()

    let initialDailyEventEntries = Object.values(allDailyEvents).map((event)=>{
        return [event.id, {...event,value:0}]
    })


    let initialStoneEntries = [];
    Object.values(allStones).forEach((stone)=>{
        [...stone.tiers].reverse().forEach(tier =>initialStoneEntries.push([stone.id+"_"+tier.id, {...stone,id:stone.id+"_"+tier.id,per_level:tier.per_level,value:0}]))
    })


    let initialHabEntries = Object.values(allHabs).map((hab)=>{
        if(hab.id==="coop")return [hab.id, {...hab,value:1}]
        return [hab.id, {...hab,value:0}]
    })




    let initialVehiclesEntries = Object.values(allVehicles).map((vehicle)=>{
        if(vehicle.id==="trike")return [vehicle.id, {...vehicle,value:1}]
        return [vehicle.id, {...vehicle,value:0}]
    })
    initialVehiclesEntries.pop()//remove non numbered hyperloop
    initialVehiclesEntries.push(...(()=> {
        let hyperloops = allVehicles.hyperloop_train.levels
        let hyperloopEntries = Array(hyperloops).fill(0).map((_, i) => ["hyperloop_train_"+(i+1),{...allVehicles.hyperloop_train,id:"hyperloop_train_"+(i+1),value:0,level:(i+1)}]);
        return hyperloopEntries
    })())



    let initialAppSettings = {
        artifacts: {
                      gusset: {value:'',defaultValue: 0, influences: ["habCapacity"], label:"Gusset: \xA0", rightLabel:"% Hab space"},
                     compass: {value:'',defaultValue: 0, influences: ["shippingCapacity"], label:"Interstellar Compass: \xA0", rightLabel:"% eggs/min"},
                     chalice: {value:'',defaultValue: 0, influences: ["internalHatcheryRate"], label:"Chalice: \xA0", rightLabel:"% chickens/min"},
                   metronome: {value:'',defaultValue: 0, influences: ["eggLayingRate"], label:"Quantum Metronome: \xA0", rightLabel:"% eggs/min"},
                     monocle: {value:'',defaultValue: 0, influences: ["boostEffectiveness"], label:"Dilithium Monocle: \xA0", rightLabel:"%"},
            tachyonDeflector: {value:'',defaultValue: 0, influences: ["eggLayingRate"], label:"Tachyon Deflector(s): +", rightLabel:"% Eggs/min (effect from others)"},
        },
        research:
            Object.fromEntries(allResearch.map((research)=>{
                return [research.id, {...research,value:0}]
            })),

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
                   boostDuration: {value:'1',                  defaultValue: 1, updateFunction: calculateBoostDuration,                                      label:"Boost Duration: \xA0",         rightLabel:"x", hidden:false},
        },
        vehicles:
            Object.fromEntries(initialVehiclesEntries.reverse()),
        habs:
            Object.fromEntries(initialHabEntries.reverse()),
        stones:
            Object.fromEntries(initialStoneEntries.reverse()),
        dailyEvents:
            Object.fromEntries(initialDailyEventEntries)


    }


    let flattenedStateEntries = []
    Object.entries(initialAppSettings).forEach(([groupName,groupEntries])=>{
        flattenedStateEntries.push([groupName,Object.keys(groupEntries)])
        flattenedStateEntries.push(...(Object.entries(groupEntries)))
    })
    let appSettings = Object.fromEntries(flattenedStateEntries)
    appSettings.research = allResearch.map(r =>r.id)

    let initialFlattenedState=Object.fromEntries(Object.entries(appSettings).map(([k,v]) =>{
        if(Array.isArray(v)) return [k,v]
        let stateValue = v.value//(v.value===''?v.defaultValue:v.value)
        return  [k,stateValue]
    }))

       initialFlattenedState.values=Object.fromEntries(Object.entries(appSettings).map(([k,v]) =>{
        if(Array.isArray(v)) return [k,v]
        let stateValue = (v.value===''?v.defaultValue:parseNumber(v.value))
        return  [k,stateValue]
    }))



    function setValue(attr,textVal,value){
        this[attr]=textVal
        let val;
        if(value==null)
            val=(textVal===''?appSettings[attr].defaultValue:parseNumber(textVal))
        else
            val=value

        this.values[attr]=val
    }
    initialFlattenedState.setValue=setValue



    console.log("APP SETTINGS",JSON.parse(JSON.stringify(appSettings)))
    console.log("FLATTENED STATE",JSON.parse(JSON.stringify(initialFlattenedState)))

    let initialDependencies = ["egg_laying_rate", "internal_hatchery_rate", "hab_capacity","shipping_capacity", "fleet_size"].map(function underscoreToCamelCase(a){
        let capitalize = (a) => a.charAt(0).toUpperCase() + a.substring(1)
        return a.split("_").map((b,i)=>(i>0)?capitalize(b):b).join("")
    })
    calculateSettings(initialFlattenedState, appSettings, initialDependencies)//TODO: if manually setting any initial calculated settings, set them after this.


    function getGroup(groupName){
        return Object.fromEntries(this[groupName].map(attrName =>[attrName,this[attrName]]))
    }
    initialFlattenedState.getGroup = getGroup
    appSettings.getGroup = getGroup


    const [appState, setAppState] = useState(initialFlattenedState);

    let table=useRef(null)

    function createTable(newState){
        let newAppState = Object.fromEntries(Object.entries(newState).map(([k,v]) =>{
            if(Array.isArray(v)) return [k,v]
            let stateValue = (v===''?appSettings[k].defaultValue:v)
            return  [k,parseNumber(stateValue)]
        }))
        table.current=<BoostTable appState={newAppState}/>
        setAppState(newAppState)
    }


    return(
        <>
            <h1 style={{fontSize:"2.5em", marginLeft:"20px"}}> Egg Inc. Boost Calculator for contracts</h1>
            <div >{/*style = {{position:"sticky", top:"0", backgroundColor:"white", width:"100vw", zIndex:"9999"}}>*/}
                <SettingsForm appState={appState} appSettings={appSettings} setAppState= {createTable}/>
            </div>
            <div > {/*style={{display: "block", height: "80vh",overflow: "scroll", width: "auto"}}>*/}
                {table.current}
            </div>

        </>

    );
}

export default App;
