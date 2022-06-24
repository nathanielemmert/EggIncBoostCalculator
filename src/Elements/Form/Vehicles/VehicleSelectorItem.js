import React, {useState} from 'react';

function VehicleSelectorItem({ vehicle, lastVehicle, formState, appSettings, handleChange}) {

    //TODO: if changing the vehicle, set current vehicle quantity to zero, new quantity to new vehicle.
    console.log("VHEICLSAFSD: ",formState.getGroup("vehicles"))


    let {fleetSize,micro_coupling} = formState.values

    let vehicleNameWidth = 0
    appSettings.vehicles.forEach(vehicle =>{
        vehicleNameWidth=Math.max(vehicleNameWidth,appSettings[vehicle].name.length)
    })


    let nameAlreadyUsed = (vehicle==="")?{}:{[appSettings[vehicle].name]:true};
    let numVehiclesUsed=0
    let vehicleOptions = [["",{name:""}],...Object.entries(appSettings.getGroup("vehicles")).reverse()].filter(([vehicleName,{name}]) =>{
        if(vehicleName==="")return true
        else numVehiclesUsed+=formState.values[vehicleName]
        if(vehicleName===vehicle){console.log(vehicleName,vehicle,"v");nameAlreadyUsed[name]=true;return true}
        if(formState[vehicleName]>0){return false}
        if(nameAlreadyUsed[appSettings[vehicleName].name])return false;
        nameAlreadyUsed[name]=true;
        return true
    }).map(([vehicleName,]) =>{
        let vehicle= (vehicleName!=="")?appSettings[vehicleName] : {name:"",id:""}
        return <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
    })

    let vehicleSelector = (
        <select name="vehicle" id="vehicle" style={{alignItems:"left", width:vehicleNameWidth/2+2+"em"}} onChange={handleChange} value={vehicle}>
            {vehicleOptions}
        </select>
    )



    let vehicleQuantityOptions = null
    if(vehicle!=="") {
        vehicleQuantityOptions = [...Array(Math.max(0, fleetSize - numVehiclesUsed+formState.values[vehicle]) + 1).keys()]
        if (!vehicleQuantityOptions.includes(formState.values[vehicle])) vehicleQuantityOptions = [...vehicleQuantityOptions, formState[vehicle]]
        vehicleQuantityOptions = vehicleQuantityOptions.map((number) => <option key={number} value={number}>{number}</option>)
    }

    let vehicleQuantitySelector = (
        (vehicle==="")?null:
            <div style={{display: "inline"}}>
                <label htmlFor={"vehicle_quantity"}>x</label>
                <select name={"vehicle_quantity"} id={"vehicle_quantity"} style={{alignItems:"left", width:"3em"}} onChange={handleChange} value={formState[vehicle]}>
                    {vehicleQuantityOptions}
                </select>
            </div>
    )

    let trainLengthOptions = null
    if(vehicle.includes("hyperloop")){
        trainLengthOptions =[...Array(micro_coupling+5).keys()].map(i=>""+(i+1))
        if(!trainLengthOptions.includes(vehicle.split("_")[2]))trainLengthOptions = [...trainLengthOptions,vehicle.split("_")[2]]
        trainLengthOptions = trainLengthOptions.map((number)=><option key={number} value={number}>{number}</option>)
    }
    let trainLengthSelector = (
        (vehicle===""||!appSettings[vehicle].categories.includes("hyperloop"))?null:
            <div style={{display: "inline"}}>
                <label htmlFor={"train_length"}> Train Length:</label>
                <select name={"train_length"} id={"train_length"} style={{alignItems:"left", width:"3em"}} onChange={handleChange} value={vehicle.split("_")[2]} >
                    {trainLengthOptions}
                </select>
            </div>

        //<input type="number" value={vehicle.split("_")[2]} id={"train_length"}  min="1" max={5+micro_coupling} step={1} style={{width: "4em"}} onChange={handleChange}/>
    )




    //console.log("VEHICLE OPTIONS",vehicleOptions)

    return(
        <form style={{display:"table", borderCollapse:"collapse"}}>
            {vehicleSelector}
            {vehicleQuantitySelector}
            {trainLengthSelector}
        </form>
    );








   /*return  <form style={{display:"table-row", marginTop:"2px", marginBottom:"2px", textAlign:"left"}}>
        <label htmlFor={vehicle} style={{display:"table-cell", textAlign:"right"}}>{label}</label>
        <select name="tier" id="tier" style={{alignItems:"left"}} onChange={handleChangeSelectedArtifact}>
            <option key={""} value={""}>{""}</option>
            {artifacts[vehicle].tiers.map(tier =>
                <option key={tier.name} value={tier.id}>{"T"+tier.id+" ("+tier.name+") "}</option>
            )}
        </select>

        {(artifacts[vehicle].tiers[state.tier-1]==null)?null:
            <select name="rarity" id="rarity" style={{alignItems:"left"}} onChange={handleChangeSelectedArtifact} value={selectedRarity}>
                {artifacts[vehicle].tiers[state.tier-1].rarities.map(rarity =>
                    <option key={rarity.name} value={rarity.id}>{rarity.name}</option>
                )}
            </select>
        }
        <label htmlFor={vehicle} style={{ textAlign:"left"}}>{effectLabel}</label>
    </form>*/
}

export default VehicleSelectorItem;