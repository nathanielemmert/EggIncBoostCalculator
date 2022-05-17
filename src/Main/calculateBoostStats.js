import sum from "./helpers/sum";
import getBoostsArray from "./resources/getBoostsArray";


function numberOfPrisms(boosts){
    return Object.values(boosts).filter(b => b.isPrism).length
}
const allBoosts = getBoostsArray()
const boostLetters = Object.keys(allBoosts)

function list_used_boosts(ID,boosts) {
    let usedBoosts = []
    for (const c of ID.split(" "))
        usedBoosts.push(allBoosts[c])
    return usedBoosts
}


function getAllBoostCombos(){
    return calculateAllBoostCombos([], 0, [])
}
function calculateAllBoostCombos(combo_id, boost_index, boostCombos){
    const  max_boosts = 5;
    if (combo_id.length===0 && boost_index >= numberOfPrisms(allBoosts)) return boostCombos;//discard the boost combo if it contains no tachyon prisms
    if (combo_id.length >= max_boosts || boost_index >= boostLetters.length) {
        return boostCombos.splice(boostCombos.length, 0, {combo_id:combo_id.join(" ")})//Add the current boostCombo to the array
    }
    calculateAllBoostCombos(combo_id.concat(),boost_index+1, boostCombos)
    calculateAllBoostCombos(combo_id.concat([boostLetters[boost_index]]),boost_index, boostCombos)
    return boostCombos
}

function calculateAllBoostStats(boostCombos, settings){
    boostCombos.forEach((combo)=>calcBoostStats(combo, settings))
}

function calcBoostStats(boostCombo, settings){

    const used_boosts = list_used_boosts(boostCombo.combo_id, allBoosts)
    //console.log(used_boosts)
    const durations = [...new Set(used_boosts.map(boost => boost.duration))].sort((a, b)=>a-b)

    let {initialPopulation, initialEggsLayed} = settings.contractSettings.getValues();
    let {monocle} = settings.artifacts.getValues();

    const startingChickens = initialPopulation;

    let eggs_laid_during_boost=0;
    let previous_boost_duration = 0
    for(const duration of durations){

        let [laidEggs, newChickens] = calculateTimeRange(initialPopulation, previous_boost_duration, duration, used_boosts, settings )//chickens_hatched_in_time_range(previous_boost_duration, duration, used_boosts)
        //if(boostCombo.combo_id==="F")console.log(laidEggs)
        eggs_laid_during_boost+=laidEggs;
        initialPopulation=newChickens;
        previous_boost_duration=duration;
        //if(boostCombo.combo_id==="F")console.log(initialEggsLayed)
    }

     const ge_cost = sum(used_boosts.map(boost => boost.ge_cost))
     const token_cost = sum(used_boosts.map(boost => boost.token_cost))
     const max_duration = Math.max(...used_boosts.filter(boost => boost.isPrism).map(boost => boost.duration))//TODO: max duration should include duration of beacons

    //if(boostCombo.combo_id==="F")console.log(initialEggsLayed)
    boostCombo.stats = {
            used_boosts: used_boosts,
            hatched_chickens: (initialPopulation-startingChickens)*((100+monocle)/100),
            ge_cost : ge_cost,
            token_cost : token_cost,
            max_duration : max_duration,
            eggs_layed : 0//TODO: consider updating eggs layed here instead of in filterBoosts
    }


}

function calculateTimeRange(startChickens, from, to, used_boosts, settings){//return eggs layed during time span, total population at end of time span

    // eslint-disable-next-line no-unused-vars
    let {internalHatcheryRate:baseIHR} = settings.calculated.getValues()

    let active_boosts = used_boosts.filter(boost => boost.duration>=to)
    let lengthOfTime = to-from
    let hatchedChickens = 0;
    let boost_mult = active_boosts.reduce((p,boost)=>p || boost.isBeacon ,false) ? 0 : 1
    for(const boost of active_boosts){
        if(boost.isPrism)
            hatchedChickens+=boost.multiplier*lengthOfTime
        if(boost.isBeacon)
            boost_mult+=boost.multiplier
    }
    //if(used_boosts.length===1)console.log("baseIHR", baseIHR)
    let actualIHR = baseIHR*boost_mult*4*3;//TODO: remove hardcoded IHC *3, 4 habs
    let {eggLayingRate} =settings.calculated.getValues();
    let eggsLayed = actualIHR * eggLayingRate  * (lengthOfTime**2)/2
                    +startChickens*eggLayingRate
    return [eggsLayed, startChickens + hatchedChickens*actualIHR];
}

export {calculateAllBoostStats, getAllBoostCombos};
