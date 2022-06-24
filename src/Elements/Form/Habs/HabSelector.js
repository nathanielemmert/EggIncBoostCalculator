import HabSelectorItem from "../Habs/HabSelectorItem";
import React from "react";


const habs = {
                coop: {
        "serial_id": 0,
        "id": "coop",
        "name": "Coop",
        "categories": "",
        "levels": 1,
        "per_level": 250,
        "levels_compound": "additive",
        "prices": []
    },
               shack: {
        "serial_id": 1,
        "id": "shack",
        "name": "Shack",
        "categories": "",
        "levels": 1,
        "per_level": 500,
        "levels_compound": "additive",
        "prices": []
    },
         super_shack: {
        "serial_id": 2,
        "id": "super_shack",
        "name": "Super Shack",
        "categories": "",
        "levels": 1,
        "per_level": 1_000,
        "levels_compound": "additive",
        "prices": []
    },
         short_house: {
        "serial_id": 3,
        "id": "short_house",
        "name": "Short House",
        "categories": "",
        "levels": 1,
        "per_level": 2_000,
        "levels_compound": "additive",
        "prices": []
    },
        the_standard: {
        "serial_id": 4,
        "id": "the_standard",
        "name": "The Standard",
        "categories": "",
        "levels": 1,
        "per_level": 5_000,
        "levels_compound": "additive",
        "prices": []
    },
          long_house: {
        "serial_id": 5,
        "id": "long_house",
        "name": "Long House",
        "categories": "",
        "levels": 1,
        "per_level": 10_000,
        "levels_compound": "additive",
        "prices": []
    },
       double_decker: {
        "serial_id": 6,
        "id": "double_decker",
        "name": "Double Decker",
        "categories": "",
        "levels": 1,
        "per_level": 20_000,
        "levels_compound": "additive",
        "prices": []
    },
           warehouse: {
        "serial_id": 7,
        "id": "warehouse",
        "name": "Warehouse",
        "categories": "",
        "levels": 1,
        "per_level": 50_000,
        "levels_compound": "additive",
        "prices": []
    },
              center: {
        "serial_id": 8,
        "id": "center",
        "name": "Center",
        "categories": "",
        "levels": 1,
        "per_level": 100_000,
        "levels_compound": "additive",
        "prices": []
    },
              bunker: {
        "serial_id": 9,
        "id": "bunker",
        "name": "Bunker",
        "categories": "",
        "levels": 1,
        "per_level": 200_000,
        "levels_compound": "additive",
        "prices": []
    },
              eggkea: {
        "serial_id": 10,
        "id": "eggkea",
        "name": "Eggkea",
        "categories": "",
        "levels": 1,
        "per_level": 500_000,
        "levels_compound": "additive",
        "prices": []
    },
            hab_1000: {
        "serial_id": 11,
        "id": "hab_1000",
        "name": "Hab 1000",
        "categories": "",
        "levels": 1,
        "per_level": 1_000_000,
        "levels_compound": "additive",
        "prices": []
    },
              hangar: {
        "serial_id": 12,
        "id": "hangar",
        "name": "Hangar",
        "categories": "",
        "levels": 1,
        "per_level": 2_000_000,
        "levels_compound": "additive",
        "prices": []
    },
               tower: {
        "serial_id": 13,
        "id": "tower",
        "name": "Tower",
        "categories": "",
        "levels": 1,
        "per_level": 5_000_000,
        "levels_compound": "additive",
        "prices": []
    },
           hab_10000: {
        "serial_id": 14,
        "id": "hab_10000",
        "name": "Hab 10,000",
        "categories": "",
        "levels": 1,
        "per_level": 10_000_000,
        "levels_compound": "additive",
        "prices": []
    },
            eggtopia: {
        "serial_id": 15,
        "id": "eggtopia",
        "name": "Eggtopia",
        "categories": "",
        "levels": 1,
        "per_level": 25_000_000,
        "levels_compound": "additive",
        "prices": []
    },
            monolith: {
        "serial_id": 16,
        "id": "monolith",
        "name": "Monolith",
        "categories": "",
        "levels": 1,
        "per_level": 50_000_000,
        "levels_compound": "additive",
        "prices": []
    },
       planet_portal: {
        "serial_id": 17,
        "id": "planet_portal",
        "name": "Planet Portal",
        "categories": "portal",
        "levels": 1,
        "per_level": 100_000_000,
        "levels_compound": "additive",
        "prices": []
    },
    chicken_universe: {
        "serial_id": 18,
        "id": "chicken_universe",
        "name": "Chicken Universe",
        "categories": "portal",
        "levels": 1,
        "per_level": 600_000_000,
        "levels_compound": "additive",
        "prices": []
    },
}

function HabSelector({ formState, appSettings, updateForm, updateMultipleForm, borderStyle}) {
    function underscoreToCamelCase(a){
        let capitalize = (a) => a.charAt(0).toUpperCase() + a.substring(1)
        return a.split("_").map((b,i)=>(i>0)?capitalize(b):b).join("")
    }
    function influences(v){
        //v = appSettings[v]
        //return v.categories.split(",").map(underscoreToCamelCase)
        return ["habCapacity"]
    }

    function handleChangeSelectedHab(hab,e){
        console.log("CHANGE SELECTED",hab,e)
        let id = e.target.id

        let newHab=hab
        if(id==='hab') newHab=e.target.value
        if(id==='hab_quantity') {updateForm(1000, "habs", hab, influences(hab), e.target.value);return}//if changing quantity, directly change quantity

        if(hab===""){updateMultipleForm(1000,[{group:"habs", attr:newHab, influences:influences(newHab), newValue:1}]);return}
        if(newHab===""){updateMultipleForm(1000,[{group:"habs", attr:hab, influences:influences(hab), newValue:0}]);return}

        //if changing the hab, set the current hab to 0, set new hab to values
        let newValues = [
            {group:"habs", attr:newHab, influences:influences(newHab), newValue:formState[hab]},
            {group:"habs", attr:hab, influences:influences(hab), newValue:0}
        ]
        updateMultipleForm(1000, newValues)
    }

    function maxAllHabs(){
        console.log("max habs")
        let {micro_coupling}=formState.values

        let newValues = appSettings.habs.map((v)=>{
             v = appSettings[v]
            return {
                group:"habs",
                attr:v.id,
                influences:["habCapacity"],
                newValue:(v.id==="chicken_universe")?4:0
            }
        })
        updateMultipleForm(500, newValues)
    }

    let maxHabs = 4

    let numHabsUsed=0
    let habList = formState.habs.filter((habName)=>{
        numHabsUsed+=formState.values[habName]
        return (formState[habName] > 0)
    })
    if(numHabsUsed<maxHabs)habList.push("")
    habList=habList.map(habName =>{
        let habID= (habName==="")?"":appSettings[habName].id
        return <HabSelectorItem key={habName}
                                    hab={habID}
                                    formState={formState}
                                    handleChange={handleChangeSelectedHab.bind(this,habName)}
                                    appSettings={appSettings} />

    })



    return(
        <div style={borderStyle}>{/*TODO: make sure last hab cant be removed*/}
            <b style={{display:"inline"}}>Select Habs:</b> <button onClick={maxAllHabs} style={{padding:"5px"}}>Max Habs</button>
            {!(numHabsUsed===maxHabs)?null:<div>MAX HABS</div>}
            {(numHabsUsed<=maxHabs)?null:<div style={{color:"red"}}>TOO MANY HABS SELECTED</div>}
            {habList}
        </div>
    )


}

export default HabSelector;