import React, {useState} from 'react';

import SettingsItem from "../Settings/SettingsItem";
import VehicleSelectorItem from "./VehicleSelectorItem";

const vehicles = {
          trike:{
        "serial_id": 0,
        "id": "trike",
        "name": "Trike",
        "categories": "",
        "levels": 1,
        "per_level": 5_000,
        "levels_compound": "additive",
        "prices": []
    },
    transit_van:{
        "serial_id": 1,
        "id": "transit_van",
        "name": "Transit Van",
        "categories": "",
        "levels": 1,
        "per_level": 15_000,
        "levels_compound": "additive",
        "prices": []
    },
         pickup:{
        "serial_id": 2,
        "id": "pickup",
        "name": "Pickup",
        "categories": "",
        "levels": 1,
        "per_level": 50_000,
        "levels_compound": "additive",
        "prices": []
    },
      "10_foot":{
        "serial_id": 3,
        "id": "10_foot",
        "name": "10 Foot",
        "categories": "",
        "levels": 1,
        "per_level": 100_000,
        "levels_compound": "additive",
        "prices": []
    },
      "24_foot":{
        "serial_id": 4,
        "id": "24_foot",
        "name": "24 Foot",
        "categories": "",
        "levels": 1,
        "per_level": 250_000,
        "levels_compound": "additive",
        "prices": []
    },
           semi:{
        "serial_id": 5,
        "id": "semi",
        "name": "Semi",
        "categories": "",
        "levels": 1,
        "per_level": 500_000,
        "levels_compound": "additive",
        "prices": []
    },
    double_semi:{
        "serial_id": 6,
        "id": "double_semi",
        "name": "Double Semi",
        "categories": "",
        "levels": 1,
        "per_level": 1_000_000,
        "levels_compound": "additive",
        "prices": []
    },
    future_semi:{
        "serial_id": 7,
        "id": "future_semi",
        "name": "Future Semi",
        "categories": "",
        "levels": 1,
        "per_level": 5_000_000,
        "levels_compound": "additive",
        "prices": []
    },
      mega_semi:{
        "serial_id": 8,
        "id": "mega_semi",
        "name": "Mega Semi",
        "categories": "",
        "levels": 1,
        "per_level": 15_000_000,
        "levels_compound": "additive",
        "prices": []
    },
     hover_semi:{
        "serial_id": 9,
        "id": "hover_semi",
        "name": "Hover Semi",
        "categories": "hover",
        "levels": 1,
        "per_level": 30_000_000,
        "levels_compound": "additive",
        "prices": []
    },
    quantum_transporter:{
        "serial_id": 10,
        "id": "quantum_transporter",
        "name": "Quantum Transporter",
        "categories": "hover",
        "levels": 1,
        "per_level": 50_000_000,
        "levels_compound": "additive",
        "prices": []
    },
    hyperloop_train:{
        "serial_id": 11,
        "id": "hyperloop_train",
        "name": "Hyperloop Train",
        "categories": "hover,hyperloop",
        "levels": 10,
        "per_level": 50_000_000,
        "levels_compound": "additive",
        "prices": []
    },
}






function VehicleSelector({ formState, appSettings, updateForm, updateMultipleForm, borderStyle}) {
    function underscoreToCamelCase(a){
        let capitalize = (a) => a.charAt(0).toUpperCase() + a.substring(1)
        return a.split("_").map((b,i)=>(i>0)?capitalize(b):b).join("")
    }
    function influences(v){
        v = appSettings[v]
        //return v.categories.split(",").map(underscoreToCamelCase)
        return ["shippingCapacity","fleetSize"]
    }

    function handleChangeSelectedVehicle(vehicle,e){
        console.log("CHANGE SELECTED",vehicle,e)
        let id = e.target.id

        let newVehicle=vehicle
        if(id==='vehicle') newVehicle=e.target.value
        if(id==='train_length')newVehicle="hyperloop_train_"+e.target.value//if changing train amount, change vehicle
        if(id==='vehicle_quantity') {updateForm(1000, "vehicles", vehicle, influences(vehicle), e.target.value);return}//if changing quantity, directly change quantity

        if(vehicle===""){updateMultipleForm(1000,[{group:"vehicles", attr:newVehicle, influences:influences(newVehicle), newValue:1}]);return}
        if(newVehicle===""){updateMultipleForm(1000,[{group:"vehicles", attr:vehicle, influences:influences(vehicle), newValue:0}]);return}


        //if changing the vehicle, set the current vehicle to 0, set new vehicle to values
        let newValues = [
            {group:"vehicles", attr:newVehicle, influences:influences(newVehicle), newValue:formState[vehicle]},
            {group:"vehicles", attr:vehicle, influences:influences(vehicle), newValue:0}

        ]

        updateMultipleForm(1000, newValues)


    }

    function maxAllVehicles(){
        let {micro_coupling,fleetSize}=formState.values

        let newValues = appSettings.vehicles.map((v)=>{
            v = appSettings[v]
            return {
                group:"vehicles",
                attr:v.id,
                influences:["shippingCapacity"],
                newValue:(v.id==="hyperloop_train_"+(5+micro_coupling))?fleetSize:0
            }
        })
        updateMultipleForm(500, newValues)
    }

    let {fleetSize} = formState.values

    let numVehiclesUsed=0
    let vehicleList = formState.vehicles.filter((vehicleName)=>{
        numVehiclesUsed+=formState.values[vehicleName]
        return (formState[vehicleName] > 0)
    })
    if(vehicleList.length<formState.vehicles.length)vehicleList.push("")
    vehicleList=vehicleList.map(vehicleName =>{
        let vehicleID= (vehicleName==="")?"":appSettings[vehicleName].id
        return <VehicleSelectorItem key={vehicleName}
                                    vehicle={vehicleID}
                                    lastVehicle={false}
                                    formState={formState}
                                    handleChange={handleChangeSelectedVehicle.bind(this,vehicleName)}
                                    appSettings={appSettings} />

    })





    return(
        <div style={borderStyle}>{/*TODO: make sure last vehicle cant be removed*/}
            <b style={{display:"inline"}}>Select Vehicles:</b> <button onClick={maxAllVehicles} style={{padding:"5px"}}>Max Vehicles</button>
            {!(numVehiclesUsed===fleetSize)?null:<div>MAX VEHICLES</div>}
            {(numVehiclesUsed<=fleetSize)?null:<div style={{color:"red"}}>TOO MANY VEHICLES SELECTED</div>}
            {vehicleList}
        </div>
    )


}

export default VehicleSelector;