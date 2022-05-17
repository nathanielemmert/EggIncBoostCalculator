import React, {useEffect, useRef, useState} from 'react';
import BoostTable from "./BoostTable";
import calculate_all_boost_combos from "./calculateBoostStats";
import filterNonOptimalBoostCombos from "./filterNonOptimalBoostCombos";
import updateSettings from "./updateSettings";



function App() {
    let defaultSettings = {
        max_ge_cost: Number.MAX_SAFE_INTEGER,
        max_boosts: 5,
        count_chickens_over_max_hab_capacity: true,
        max_hab_capacity: 14175000000,//9723000000,//11340000000,//9500000000,//14175000000,
        hatcheryRate: 7440*4*3,
        IHR: 7440,
        IHC:true,
        Chalice : 0,
        Monocle : 0,
        DStoneMultiplier : 0,
        DStones : 1,
        LStoneMultiplier : 0,
        LStones : 1
    }
    const [settings, setSettings] = useState(defaultSettings)
    const refs = {
        "IHR" : useRef(),
        //IHC: useRef(),
        "max_hab_capacity" : useRef(),
        "Chalice" : useRef(),
        "Monocle" : useRef(),
        "DStoneMultiplier" : useRef(),
        "DStones" : useRef(),
        "LStoneMultiplier" : useRef(),
        "LStones" : useRef()
    }


    let boostCombos = []
    //let [boostCombos, setBoostCombos] = useState([])



    calculate_all_boost_combos('', 0, boostCombos, settings)
    filterNonOptimalBoostCombos(boostCombos)
    //boostCombos.sort((a, b) => a.ge_ratio>b.ge_ratio ? -1 : 1);



    function toggleSetting(e){
        //console.log(settings)
        setSettings(prevSettings=>{
            let newSettings = {...prevSettings}
            newSettings[e.target.id] = !newSettings[e.target.id]
            updateSettings(newSettings)
            return newSettings
        })
        //console.log(settings)
        calculate_all_boost_combos('', 0, boostCombos, settings)
        filterNonOptimalBoostCombos(boostCombos)
    }
    function changeSetting(e){
        //console.log(settings)
        setSettings(prevSettings=>{
            let newSettings = {...prevSettings}
            newSettings[e.target.id] = Number(refs[e.target.id].current.value) || 0
            updateSettings(newSettings)
            return newSettings
        })
        //console.log(settings)
        calculate_all_boost_combos('', 0, boostCombos, settings)
        filterNonOptimalBoostCombos(boostCombos)


    }


    // function toggleIHC(e){
    //     console.log(e.target.value)
    //     setSettings(prevSettings=>{
    //         return {...prevSettings, IHC: !settings.IHC, hatcheryRate: 7440*4*(settings.IHC ? 3 : 1)}
    //     })
    //     calculate_all_boost_combos('', 0, boostCombos, settings)
    //     filterNonOptimalBoostCombos(boostCombos)
    // }



    return(
        <>
            <div style = {{position:"sticky", top:"0", backgroundColor:"white", width:"100vh", zIndex:"9999"}}>
                Max Hab Capacity:  <input type="text"     id = "max_hab_capacity" value = {settings.max_hab_capacity} ref = {refs["max_hab_capacity"]}  size={15} onChange={changeSetting} /> Chickens<br/>
                Chalice: +<input type="text"     id = "Chalice" value = {settings.Chalice} ref = {refs["Chalice"]}  size={2} onChange={changeSetting} /> %<br/>
                Monocle: +<input type="text"     id = "Monocle" value = {settings.Monocle} ref = {refs["Monocle"]}  size={2} onChange={changeSetting} /> %<br/>
                Dilithium Stones: +<input type="text" id = "DStoneMultiplier" value = {settings.DStoneMultiplier} ref = {refs["DStoneMultiplier"]} size={2} onChange={changeSetting} />{"%   x"}
                <input type="text" id = "DStones" value = {settings.DStones} ref = {refs["DStones"]} size={1} onChange={changeSetting} /><br/>

                Life Stones: +<input type="text" id = "LStoneMultiplier" value = {settings.LStoneMultiplier} ref = {refs["LStoneMultiplier"]} size={2} onChange={changeSetting} />{"%   x"}
                <input type="text" id = "LStones" value = {settings.LStones} ref = {refs["LStones"]} size={1} onChange={changeSetting} /><br/>


                Internal Hatchery Rate: <input type="text"     id = "IHR" value = {settings.IHR} ref = {refs["IHR"]}  size={4} onChange={changeSetting} /> Chickens/min/hab<br/>
                <input type="checkbox" id = "IHC" checked = {settings.IHC}  onChange={toggleSetting}/>Internal Hatchery Calm (+200% Hatchery Rate while away)<br/>
                <input type="checkbox" id = "count_chickens_over_max_hab_capacity" checked = {!settings.count_chickens_over_max_hab_capacity}  onChange={toggleSetting}/> Dont count chickens hatched after all habs are full
            </div>
            <div > {/*style={{display: "block", height: "80vh",overflow: "scroll", width: "auto"}}>*/}
            <BoostTable boostCombos={boostCombos}/>
            </div>

        </>

    );
}

export default App;
