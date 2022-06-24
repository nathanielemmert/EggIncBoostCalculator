import React from "react";

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

function StoneSelectorItem({ stone, lastStone, formState, appSettings, handleChange}) {

    //TODO: if changing the stone, set current stone quantity to zero, new quantity to new stone.
    console.log("VHEICLSAFSD: ",formState.getGroup("stones"))


    let maxStones = 12

    let stoneNameWidth = 0
    appSettings.stones.forEach(stone =>{
        stoneNameWidth=Math.max(stoneNameWidth,appSettings[stone].name.length)
    })


    let nameAlreadyUsed = (stone==="")?{}:{[appSettings[stone].name]:true};
    let numStonesUsed=0
    let stoneOptions = [["",{name:""}],...Object.entries(appSettings.getGroup("stones"))].filter(([stoneName,{name}]) =>{
        if(stoneName==="")return true
        else numStonesUsed+=formState.values[stoneName]
        if(stoneName===stone){console.log(stoneName,stone,"v");nameAlreadyUsed[name]=true;return true}
        if(formState[stoneName]>0){return false}
        if(nameAlreadyUsed[appSettings[stoneName].name])return false;
        nameAlreadyUsed[name]=true;
        return true
    }).map(([stoneName,]) =>{
        let stone= (stoneName!=="")?appSettings[stoneName] : {name:"",id:""}
        return <option key={stone.id} value={stone.id}>{stone.name}</option>
    })

    let stoneSelector = (
        <select name="stone" id="stone" style={{alignItems:"left", width:stoneNameWidth/2+2+"em"}} onChange={handleChange} value={stone}>
            {stoneOptions}
        </select>
    )



    let stoneQuantityOptions = null
    if(stone!=="") {
        stoneQuantityOptions = [...Array(Math.max(0, maxStones - numStonesUsed+formState.values[stone]) + 1).keys()]
        if (!stoneQuantityOptions.includes(formState.values[stone])) stoneQuantityOptions = [...stoneQuantityOptions, formState[stone]]
        stoneQuantityOptions = stoneQuantityOptions.map((number) => <option key={number} value={number}>{number}</option>)
    }
    let stoneQuantitySelector = (
        (stone==="")?null:
            <div style={{display:"inline"}}>
                <label htmlFor={"stone_quantity"}>x</label>
                <select name={"stone_quantity"} id={"stone_quantity"} style={{alignItems:"left", width:"3em"}} onChange={handleChange} value={formState[stone]}>
                    {stoneQuantityOptions}
                </select>
            </div>
        // <input type="number" value={formState[stone]} id={"stone_quantity"}  min={lastStone?1:0} max={fleetSize} step={1} style={{width: "4em"}} onChange={handleChange}/>
    )


    let tierOptions = null
    if(stone!==""){
        tierOptions =[...Array(3).keys()].map(i=>""+(i+2))
        tierOptions = tierOptions.map((number)=><option key={number} value={number}>{"T"+number +" ("+stones[stone.slice(0,-2)].tiers[number-2].name+")"}</option>)
    }
    let tierSelector = (
        (stone==="")?null:
            <select name={"tier_num"} id={"tier_num"} style={{alignItems:"left", width:"3em"}} onChange={handleChange} value={stone.split("_")[2]} >
                {tierOptions}
            </select>
        //<input type="number" value={stone.split("_")[2]} id={"train_length"}  min="1" max={5+micro_coupling} step={1} style={{width: "4em"}} onChange={handleChange}/>
    )

    return(
        <form style={{display:"table", borderCollapse:"collapse"}}>
            {stoneSelector}
            {tierSelector}
            {stoneQuantitySelector}

        </form>
    );

}
export default StoneSelectorItem;