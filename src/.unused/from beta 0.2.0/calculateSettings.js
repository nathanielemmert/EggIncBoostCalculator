

import parseNumber from "./helpers/parseNumber";
import formatNumber from "./helpers/formatNumber";

function calculateSettings(newState, appSettings, dependencies) {
    if(dependencies==null)return
    for (let d of dependencies) {
        if(newState[d]==null || typeof appSettings[d].updateFunction !=='function')continue
        appSettings[d].updateFunction(newState, appSettings, d)
        calculateSettings(newState, appSettings, appSettings[d].influences)
    }

}

// function roundFloat(f){
//     return parseFloat(f.toFixed(12)).toPrecision()
// }
function roundFloat(f,d){
    return parseFloat(f.toFixed(d)).toPrecision()
}
function displayNumber(f,d){
    return formatNumber(parseNumber(formatNumber(f,d)))
}



function calculateIHR(newState, appSettings){//TODO: Internal Hatchery Calm
    let baseValue = 0;
    let {chalice} = newState.values
    let researches = appSettings.research.map(r => appSettings[r]).filter(r =>r.categories.includes("internal_hatchery_rate")&&r.id!=="int_hatch_calm")//research in order of tiers

    for(let research of researches){
        research.value=newState[research.id]
        if(research.effect_type==='additive'){
            baseValue+=Number(research.value)
        }

        if(research.effect_type==='multiplicative'){
            baseValue*=(100+Number(research.value))/100
        }
    }

    let stones = appSettings.stones.map(s => appSettings[s]).filter(s =>s.categories.includes("internal_hatchery_rate"))
    for(let stone of stones){
        stone.value=newState.values[stone.id]
        if(stone.levels_compound==='multiplicative'){
            baseValue*= ((100+stone.per_level)/100) ** stone.value
        }
    }

    baseValue=baseValue*(100+chalice)/100

    newState.setValue("internalHatcheryRate",displayNumber(baseValue,3),parseFloat(baseValue.toFixed(3)))
}//TODO: Precision of each value is limited to 3 decimal points. this arbitrary limit can be removed when moving to a better number format

function calculateEggLayingRate(newState, appSettings){
    let baseValue = 2;
    let {metronome, tachyonDeflector} = newState.values
    let researches = appSettings.research.map(r => appSettings[r]).filter(r =>r.categories.includes("egg_laying_rate"))

    for(let research of researches){
        research.value=newState[research.id]
        if(research.effect_type==='multiplicative'){
            baseValue*=(100+Number(research.value))/100
        }
    }

    let stones = appSettings.stones.map(s => appSettings[s]).filter(s =>s.categories.includes("egg_laying_rate"))
    for(let stone of stones){
        stone.value=newState.values[stone.id]
        if(stone.levels_compound==='multiplicative'){
            baseValue*= ((100+stone.per_level)/100) ** stone.value
        }
    }

    baseValue = baseValue * (100+metronome)/100 * (100+tachyonDeflector)/100

    newState.setValue("eggLayingRate",displayNumber(baseValue,3),parseFloat(baseValue.toFixed(3)))
}//TODO: Precision of each value is limited to 3 decimal points. this arbitrary limit can be removed when moving to a better number format

/*function calculateHabCapacity(newState, appSettings){
    let baseValue = 600_000_000*4;//TODO: Implement more options for hab capacity
    let {gusset} = newState.values
    let researches = appSettings.research.map(r => appSettings[r]).filter(r =>r.categories.includes("hab_capacity"))

    for(let research of researches){
        research.value=newState[research.id]
        if(research.effect_type==='multiplicative'){
            baseValue*=(100+Number(research.value))/100
        }
    }

    baseValue=baseValue*(100+gusset)/100

    newState.setValue("habCapacity",displayNumber(baseValue,3),parseFloat(baseValue.toFixed(3)))
}//TODO: Precision of each value is limited to 3 decimal points. this arbitrary limit can be removed when moving to a better number format*/
function calculateHabCapacity(newState, appSettings){
    let baseValue = 0;
    let {gusset} = newState.values
    newState.habs.forEach((habName)=> {
        let hab=appSettings[habName]
        let hyper_portalling = !hab.categories.includes("hyperloop")?1:(100+newState.values["hyper_portalling"])/100
        baseValue+= newState[habName] * hab.per_level*hyper_portalling
    })
    let excludedResearch = ["hyper_portalling"]
    let researches = appSettings.research.map(r => appSettings[r]).filter(r =>r.categories.includes("hab_capacity")&& !excludedResearch.includes(r.id))

    for(let research of researches){
        research.value=newState[research.id]
        if(research.effect_type==='multiplicative'){
            baseValue*=(100+Number(research.value))/100
        }
    }


    baseValue=baseValue*(100+gusset)/100
    newState.setValue("habCapacity",displayNumber(baseValue,3),parseFloat(baseValue.toFixed(3)))
}//TODO: Precision of each value is limited to 3 decimal points. this arbitrary limit can be removed when moving to a better number format

/*function calculateShippingCapacity(newState, appSettings){
    let baseValue = 50_000_000;//TODO: hover research only affects hover vehicles, hyperloop research only affects hyperloop values
    let {fleetSize, micro_coupling, compass} = newState.values
    let researches = appSettings.research.map(r => appSettings[r]).filter(r =>r.categories.includes("shipping_capacity"))

    for(let research of researches){
        research.value=newState[research.id]
        if(research.effect_type==='multiplicative'){
            baseValue*=(100+Number(research.value))/100
        }
    }

    baseValue*=fleetSize//Fleet size
    baseValue*=(micro_coupling+5)//Hyperloop train length

    baseValue=baseValue*(100+compass)/100

    newState.setValue("shippingCapacity",displayNumber(baseValue,3),parseFloat(baseValue.toFixed(3)))
}//TODO: Precision of each value is limited to 3 decimal points. this arbitrary limit can be removed when moving to a better number format*/
function calculateShippingCapacity(newState, appSettings){
    let baseValue = 0;
    let {compass} = newState.values
    newState.vehicles.forEach((vehicleName)=> {
        let vehicle=appSettings[vehicleName]
        let level = (vehicle.level==null)?1:vehicle.level
        let hover_upgrades   = !vehicle.categories.includes("hover")    ?1:(100+newState.values["hover_upgrades"]  )/100
        let hyper_portalling = !vehicle.categories.includes("hyperloop")?1:(100+newState.values["hyper_portalling"])/100
        baseValue+= newState[vehicleName] * level*vehicle.per_level*hover_upgrades*hyper_portalling
    })
    let excludedResearch = ["hover_upgrades","hyper_portalling"]
    let researches = appSettings.research.map(r => appSettings[r]).filter(r =>r.categories.includes("shipping_capacity")&& !excludedResearch.includes(r.id))

    for(let research of researches){
        console.log("RESEARCH: ",research)
        research.value=newState[research.id]
        if(research.effect_type==='multiplicative'){
            baseValue*=(100+Number(research.value))/100
        }
    }

    let stones = appSettings.stones.map(s => appSettings[s]).filter(s =>s.categories.includes("shipping_capacity"))
    for(let stone of stones){
        stone.value=newState.values[stone.id]
        if(stone.levels_compound==='multiplicative'){
            baseValue*= ((100+stone.per_level)/100) ** stone.value
        }
    }

    baseValue=baseValue*(100+compass)/100

    newState.setValue("shippingCapacity",displayNumber(baseValue,3),parseFloat(baseValue.toFixed(3)))
}//TODO: Precision of each value is limited to 3 decimal points. this arbitrary limit can be removed when moving to a better number format

function calculateBoostEffectiveness(newState, appSettings){
    let baseValue = 1;
    let {monocle} = newState.values

    baseValue=baseValue*(100+monocle)/100

    newState.setValue("boostEffectiveness",displayNumber( baseValue,3),parseFloat(baseValue.toFixed(3)))
}//TODO: Precision of each value is limited to 3 decimal points. this arbitrary limit can be removed when moving to a better number format

function calculateBoostDuration(newState, appSettings){
    let baseValue=1

    let stones = appSettings.stones.map(s => appSettings[s]).filter(s =>s.categories.includes("boost_duration"))
    for(let stone of stones){
        stone.value=newState.values[stone.id]
        if(stone.levels_compound==='multiplicative'){
            baseValue*= ((100+stone.per_level)/100) ** stone.value
        }
    }

    let dailyEvents = appSettings.dailyEvents.map(s => appSettings[s]).filter(s =>s.categories.includes("boost_duration"))
    for(let dailyEvent of dailyEvents){
        dailyEvent.value=newState.values[dailyEvent.id]
        if(dailyEvent.effect_type==='multiplicative'){
            baseValue*= ((100+dailyEvent.value*dailyEvent.per_level)/100)
        }
    }



    newState.setValue("boostDuration",displayNumber( baseValue,3),parseFloat(baseValue.toFixed(3)))
}

function calculateFleetSize(newState, appSettings){
    let baseValue = 4;
    let researches = appSettings.research.map(r => appSettings[r]).filter(r =>r.categories.includes("fleet_size")&&r.id!=="micro_coupling")

    for(let research of researches){
        research.value=newState[research.id]

        if(research.effect_type==='additive'){
            baseValue+=Number(research.value)
        }

        if(research.effect_type==='multiplicative'){
            baseValue*=(100+Number(research.value))/100
        }
    }

    newState.setValue("fleetSize",displayNumber(baseValue,3),parseFloat(baseValue.toFixed(3)))
}//TODO: Precision of each value is limited to 3 decimal points. this arbitrary limit can be removed when moving to a better number format





export {calculateSettings, calculateIHR, calculateEggLayingRate, calculateHabCapacity, calculateShippingCapacity, calculateBoostEffectiveness,calculateBoostDuration, calculateFleetSize};