import SettingsArtifactItem from "../Artifacts/SettingsArtifactItem";
import React from "react";
import HabSelectorItem from "../Habs/HabSelectorItem";
import StoneSelectorItem from "../Stones/StoneSelectorItem";

const stones = {
      tachyon_stone: {
        "id": "tachyon_stone",
        "name": "Tachyon Stone",
        "categories": "egg_laying_rate",
        "description": "Increases egg laying rate when set",
        "effect_type": "multiplicative",
        "levels_compound": "multiplicative",
        tiers: [
            {
                id: 2,
                name: "Regular",
                per_level: 2
            },
            {
                id: 3,
                name: "Eggsquisite",
                per_level: 4
            },
            {
                id: 4,
                name: "Brilliant",
                per_level: 5
            }
        ]
    },
    dilithium_stone: {
        "id": "dilithium_stone",
        "name": "Dilithium Stone",
        "categories": "boost_duration",
        "description": "Increases boost duration when set",
        "effect_type": "multiplicative",
        "levels_compound": "multiplicative",
        tiers: [
            {
                id: 2,
                name: "Regular",
                per_level: 3
            },
            {
                id: 3,
                name: "Eggsquisite",
                per_level: 6
            },
            {
                id: 4,
                name: "Brilliant",
                per_level: 8
            }
        ]
    },
      quantum_stone: {
        "id": "quantum_stone",
        "name": "Quantum Stone",
        "categories": "shipping_rate",
        "description": "Increases shipping capacity when set",
        "effect_type": "multiplicative",
        "levels_compound": "multiplicative",
        tiers: [
            {
                id: 2,
                name: "Regular",
                per_level: 2
            },
            {
                id: 3,
                name: "Phased",
                per_level: 4
            },
            {
                id: 4,
                name: "Meggnificent",
                per_level: 5
            }
        ]
    },
         life_stone: {
        "id": "life_stone",
        "name": "Life Stone",
        "categories": "internal_hatchery_rate",
        "description": "Improves internal hatcheries when set",
        "effect_type": "multiplicative",
        "levels_compound": "multiplicative",
        tiers: [
            {
                id: 2,
                name: "Regular",
                per_level: 2
            },
            {
                id: 3,
                name: "Good",
                per_level: 3
            },
            {
                id: 4,
                name: "Eggceptional",
                per_level: 4
            }
        ]
    },
}

function StoneSelector({ formState, appSettings, updateForm, updateMultipleForm, borderStyle}){
    function underscoreToCamelCase(a){
        let capitalize = (a) => a.charAt(0).toUpperCase() + a.substring(1)
        return a.split("_").map((b,i)=>(i>0)?capitalize(b):b).join("")
    }
    function influences(v){
        v = appSettings[v]
        return v.categories.split(",").map(underscoreToCamelCase)
    }

    function handleChangeSelectedStone(stone,e){
        let repr=JSON.stringify
        console.log("CHANGE SELECTED",repr(stone),repr(e.target.value))
        let id = e.target.id

        let newStone=stone
        if(id==='stone') {newStone=(stone==="" || e.target.value==="")?e.target.value:e.target.value.slice(0,-1)+stone.slice(-1)}
        if(id==='tier_num')newStone=stone.slice(0,-1)+e.target.value//if changing train amount, change stone
        if(id==='stone_quantity') {updateForm(1000, "stones", stone, influences(stone), e.target.value);return}//if changing quantity, directly change quantity

        if(stone===""){updateMultipleForm(1000,[{group:"stones", attr:newStone, influences:influences(newStone), newValue:1}]);return}
        if(newStone===""){updateMultipleForm(1000,[{group:"stones", attr:stone, influences:influences(stone), newValue:0}]);return}

        console.log("CHANGE SELECTED",repr(stone),repr(newStone))
        //if changing the stone, set the current stone to 0, set new stone to values
        let newValues = [
            {group:"stones", attr:newStone, influences:influences(newStone), newValue:formState[stone]},
            {group:"stones", attr:stone, influences:influences(stone), newValue:0}
        ]

        updateMultipleForm(1000, newValues)


    }

    let maxStones = 12

    let numStonesUsed=0
    let stoneList = formState.stones.filter((stoneName)=>{
        numStonesUsed+=formState.values[stoneName]
        return (formState[stoneName] > 0)
    })
    if(stoneList.length<formState.stones.length)stoneList.push("")
    stoneList=stoneList.map(stoneName =>{
        let stoneID= (stoneName==="")?"":appSettings[stoneName].id
        return <StoneSelectorItem key={stoneName}
                                    stone={stoneID}
                                    formState={formState}
                                    handleChange={handleChangeSelectedStone.bind(this,stoneName)}
                                    appSettings={appSettings} />

    })





    return(
        <div style={borderStyle}>{/*TODO: make sure last stone cant be removed*/}
            <b style={{display:"inline"}}>Select Stones:</b>
            {!(numStonesUsed===maxStones)?null:<div>MAX STONES</div>}
            {(numStonesUsed<=maxStones)?null:<div style={{color:"red"}}>TOO MANY STONES SELECTED</div>}
            {stoneList}
        </div>
    )


}
export default StoneSelector;