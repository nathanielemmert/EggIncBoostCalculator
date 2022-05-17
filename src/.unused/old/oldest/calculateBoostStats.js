import sum from "./helpers/sum";
import getBoostsArray from "./resources/getBoostsArray";

function numberOfPrisms(boosts){
    return Object.values(boosts).filter(b => b.isPrism).length
}

function list_used_boosts(ID,boosts) {
    let usedBoosts = []
    for (const c of ID)
        usedBoosts.push(boosts[c])
    return usedBoosts
}

function chickens_hatched_in_time_range(from, to, used_boosts){
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
    return hatchedChickens*boost_mult;
}

function calculateBoostStats(ID, boosts) {
    if(ID==='')return

    const used_boosts = list_used_boosts(ID, boosts)
    const durations = [...new Set(used_boosts.map(boost => boost.duration))].sort((a, b)=>a-b)
    let hatched_chickens = 0
    let previous_boost_duration = 0

    for(const duration of durations){
        hatched_chickens+=chickens_hatched_in_time_range(previous_boost_duration, duration, used_boosts)
        previous_boost_duration=duration
    }
    const ge_cost = sum(used_boosts.map(boost => boost.ge_cost))
    const token_cost = sum(used_boosts.map(boost => boost.token_cost))
    const max_duration = Math.max(...used_boosts.filter(boost => boost.isPrism).map(boost => boost.duration))//TODO: max duration should include duration of beacons


    return [ID, used_boosts, hatched_chickens, token_cost, ge_cost, max_duration]
    // chickens*=7440*4 //*3
}

const allBoosts = getBoostsArray()
const boostLetters = Object.keys(allBoosts)

function calculate_all_boost_combos(combo_id, boost_index, boostCombos, settings) {

    const {max_ge_cost, max_boosts, count_chickens_over_max_hab_capacity, max_hab_capacity, hatcheryRate} = settings;
    if (combo_id === '' && boost_index >= numberOfPrisms(allBoosts)) return //discard the boost combo if it contains no tachyon prisms

    if (combo_id.length >= max_boosts || boost_index >= boostLetters.length) {
        const [c_id, used_boosts, chicken_multiplier, token_cost, ge_cost, max_duration] = calculateBoostStats(combo_id, allBoosts)



        // if(true){//experimental multiboost calculator
        //     let new_cid=''
        //     let new_usedboosts = used_boosts.map(boost => {return {...boost}})
        //     let new_ge_cost = ge_cost
        //     for(const [index, boost] of new_usedboosts){
        //         if(boost.duration < max_duration){
        //             let new_boost = {...boost}
        //             const num_boost_repetitions = max_duration / boost.duration
        //             new_cid+=combo_id[index]+num_boost_repetitions
        //             new_ge_cost
        //
        //             new_usedboosts[boost_id]=new_boost
        //         }
        //         else{
        //             new_usedboosts = {...new_usedboosts}
        //             new_usedboosts[boost_id]=boost
        //         }
        //     }
        // }




        if(ge_cost>max_ge_cost)
            return
        const hatched_chickens = hatcheryRate * chicken_multiplier
        const ge_ratio = (!count_chickens_over_max_hab_capacity && hatched_chickens > max_hab_capacity) ? (max_hab_capacity/ge_cost) : (hatched_chickens/ge_cost)
        boostCombos.push({combo_id:c_id,used_boosts:[...used_boosts], hatched_chickens:hatched_chickens, token_cost:token_cost, ge_cost:ge_cost, ge_ratio:ge_ratio, max_duration:max_duration})
        return
    }
    calculate_all_boost_combos(combo_id,boost_index+1, boostCombos, settings)
    calculate_all_boost_combos(combo_id+boostLetters[boost_index],boost_index, boostCombos, settings)
}

export default calculate_all_boost_combos;
