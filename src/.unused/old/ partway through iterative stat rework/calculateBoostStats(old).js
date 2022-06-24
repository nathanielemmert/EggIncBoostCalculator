import sum from "./helpers/sum";
import getBoostsArray from "./resources/getBoostsArray";
import parseNumber from "./helpers/parseNumber";


function numberOfPrisms(boosts){
    return Object.values(boosts).filter(b => b.isPrism).length
}
const allBoosts = getBoostsArray()
const boostLetters = Object.keys(allBoosts)

function list_used_boosts(ID,boosts) {
    let usedBoosts = []
    for (const c of ID)
        usedBoosts.push(allBoosts[c])
    return usedBoosts
}

function calc_boosted_IHR(active_boosts, start){

    if(!active_boosts.some((boost)=> boost.isPrism)){
        return 1
    }
    else {
        let prism_bonus = 0//active_boosts.some((boost) => boost.isPrism) ? 0 : 1
        let beacon_bonus = active_boosts.some((boost) => boost.isBeacon) ? 0 : 1
        for (let boost of active_boosts) {
            if (boost.isPrism) prism_bonus += boost.multiplier
            if (boost.isBeacon) beacon_bonus += boost.multiplier
        }
        return prism_bonus*beacon_bonus
    }
}


function getAllBoostCombos(){
    let allBoostCombos = calculateAllBoostCombos([], 0, [])
    preCalculateAllBoostStats(allBoostCombos)
    return allBoostCombos
}
function calculateAllBoostCombos(combo_id, boost_index, boostCombos){
    const  max_boosts = 5;
    if (combo_id.length===0 && boost_index >= numberOfPrisms(allBoosts)) return boostCombos;//discard the boost combo if it contains no tachyon prisms
    if (combo_id.length >= max_boosts || boost_index >= boostLetters.length) {
        return boostCombos.splice(boostCombos.length, 0, {combo_id:combo_id})//Add the current boostCombo to the array
    }
    calculateAllBoostCombos(combo_id.concat(),boost_index+1, boostCombos)//TODO: combo id doesnt need to be copied (empty concat) if it isnt being changed
    calculateAllBoostCombos(combo_id.concat([boostLetters[boost_index]]),boost_index, boostCombos)
    return boostCombos
}

function preCalculateAllBoostStats(allBoostCombos) {
    allBoostCombos.forEach(boostCombo=>preCalculateBoostStats(boostCombo))
}
function preCalculateBoostStats(boostCombo) {

    const used_boosts = list_used_boosts(boostCombo.combo_id, allBoosts)//TODO: include boost duration events and stones

    boostCombo.used_boosts=used_boosts;

    //Combo id (array, should be computed in getAllBoostCombos)

    //GE cost
    boostCombo.ge_cost = sum(used_boosts.map(boost => boost.ge_cost));//TODO: include boost sale

    //token cost
    boostCombo.token_cost = sum(used_boosts.map(boost => boost.token_cost));

    //Boost duration
    boostCombo.max_duration = Math.max(...used_boosts.map(boost => boost.duration));
    boostCombo.max_prism_duration = Math.max(...used_boosts.filter(boost => boost.isPrism).map(boost => boost.duration));

    //List of constant time durations
    const time_steps = [...new Set([0,...used_boosts.map(boost => boost.duration)])].sort((a, b)=>a-b);


    const boost_durations = [];
    for(let i = 0;i<time_steps.length-1;i++){
        let active_boosts = used_boosts.filter(boost => (boost.duration)>time_steps[i])
        //if(!active_boosts.some(boost =>boost.isPrism))continue;//TODO: uncomment this if calculating boosts other than prisms
        boost_durations.push({
            start:time_steps[i],
            end:time_steps[i+1],
            IHR_boost:calc_boosted_IHR(active_boosts, time_steps[i])
        })
    }
    boostCombo.boost_durations = boost_durations;
}






function calculateAllBoostStats(boostCombos, settings){
    boostCombos.forEach((combo)=>calculateBoostStatsOld(combo, settings))
}

function calculateBoostStatsOld(boostCombo, settings){//TODO: check contract end, hab full, shipping full, complete contract
    let { eggLayingRate:ELR, shippingCapacity:SHIPPING, habCapacity:HAB, internalHatcheryRate: IHR, boostDuration, boostEffectiveness:MONOCLE} = settings.calculated.getValues();
    let { timeRemaining:CONTRACTEND,  tokenInterval, eggsRemaining, initialPopulation, initialEggsLayed, initialTokens} = settings.contractSettings.getValues();

    const timeForTokens = Math.max(0,tokenInterval*(boostCombo.token_cost-initialTokens))

    let chickens_hatched = Math.min(HAB, initialPopulation);
    let eggs_laid = initialEggsLayed;

    let habs_full = initialPopulation>=HAB
    let shipping_full = initialPopulation*ELR>=SHIPPING

    console.log("")

    //////////////////////////////////////////////////////////
    ///////////////////////BEFORE BOOST///////////////////////
    //////////////////////////////////////////////////////////

    let boostStartTime = Math.min(CONTRACTEND,timeForTokens)

    eggs_laid+= boostStartTime * Math.min(SHIPPING, ELR*chickens_hatched)

    //TODO: include eggs laid by initial chickens while waiting for boost.
    // Population growth assumed to be 0 during this time.

    //////////////////////////////////////////////////////////
    ///////////////////////DURING BOOST///////////////////////
    //////////////////////////////////////////////////////////

    let population_before_boost = chickens_hatched;


    let time_ranges = [...boostCombo.boost_durations].reverse()
    while(time_ranges.length>0){
        const time_range = time_ranges.pop()
        console.log("DURING BOOST",boostCombo,  time_range, )

        let start = timeForTokens+time_range.start
        let end = Math.min(CONTRACTEND, timeForTokens+time_range.end)
        if(end<=start)break;//TODO: DONT ACTUALLY RETURN, SET BOOST STATS FIRST
        const {IHR_boost} = time_range
        let boosted_IHR = (IHR_boost*MONOCLE)*IHR*4*3
        if(habs_full) {
            boosted_IHR = 0//CHECK HABS FULL
            chickens_hatched=HAB
        }

        let habFillTime = start + (HAB - chickens_hatched) / boosted_IHR
        let shippingFillTime = start + (SHIPPING / ELR - chickens_hatched) / boosted_IHR
        if(habFillTime>start && habFillTime<end){
            time_ranges.push({start:habFillTime, end:end, IHR_boost:IHR_boost})
            habs_full=true
            end = habFillTime
        }

        if(shippingFillTime>start && shippingFillTime<end){
            time_ranges.push({start:shippingFillTime, end:end, IHR_boost:IHR_boost})
            shipping_full=true
            end = shippingFillTime
        }

        //CONSTANT TIME RANGE

        let duration = end-start
        let new_chickens = boosted_IHR*duration

        let egg_shipping_rate = Math.min(SHIPPING, ELR*(chickens_hatched + new_chickens/2))
        if(shipping_full) egg_shipping_rate = SHIPPING

        let new_eggs = duration * egg_shipping_rate

        chickens_hatched+=new_chickens
        eggs_laid+=new_eggs

        if(end===boostCombo.max_prism_duration)break;
    }
    let chickens_hatched_during_boost= chickens_hatched-population_before_boost

    //////////////////////////////////////////////////////////
    ////////////////////////AFTER BOOST///////////////////////
    //////////////////////////////////////////////////////////

    time_ranges.unshift({
        start:boostCombo.max_duration,
        end:CONTRACTEND,
        IHR_boost:1
    })

    while(time_ranges.length>0){
        const time_range = time_ranges.pop()
        console.log("AFTER  BOOST",boostCombo,  time_range, )
        let IHR_boost = time_range.IHR_boost

        let start = time_range.start
        let end = time_range.end

        //let start = timeForTokens+time_range.start
        //let end = Math.min(CONTRACTEND, timeForTokens+time_range.end)
        //if(end<=start)return//TODO: DONT ACTUALLY RETURN, SET BOOST STATS FIRST

        const duration = end-start
        let boosted_IHR = IHR*IHR_boost*4*3

        let new_chickens = boosted_IHR*duration

        let new_eggs = duration * ELR*(chickens_hatched + new_chickens/2)

        chickens_hatched+=new_chickens
        eggs_laid+=new_eggs
    }




    boostCombo.stats = {
        chickens_hatched:chickens_hatched,
        eggs_laid:eggs_laid,
        time_finished:0,
        chickens_hatched_during_boost:chickens_hatched_during_boost
    }



}




// function calc_time_range(startChickens, startEggs, timeForTokens, timeStart, timeEnd, settings, usedBoosts) {//TODO: add a check for completing egg laying goal during time range
//
//
//     const boost_durations = [...new Set(usedBoosts.map(boost => boost.duration))].sort((a, b)=>a-b)
//
//     let stack = []
//     stack.push([timeStart,timeEnd])
//
//     while(!stack.length>0){
//         let current_time_range = stack.pop();
//         let [start,end] = current_time_range;
//
//         //CHECK INVALID TIME RANGE
//         if (end <= start){continue;}
//
//         //CHECK CONTRACT ENDS DURING TIME RANGE
//         if (CONTRACTEND < end){
//             stack.push([start,CONTRACTEND]);
//             continue;
//         }
//
//         //CHECK BOOST END DURING TIME RANGE
//         for(let duration of boost_durations){
//             let boostEndTime = timeForTokens + duration;
//             if(boostEndTime>=start &&boostEndTime<end){
//                 //console.log("BOOST ENDS DURING TIME RANGE",start,end,boostEndTime,activeBoosts);
//                 //return split_time_range(startChickens,startEggs, false, false, timeForTokens,start,boostEndTime,end,settings,usedBoosts)
//             }
//
//         }
//
//         //
//
//         //IF NOT CONSTANT, PUSH SPLIT TIME RANGE TO STACK, CONTINUE
//
//         //ELSE, TIME RANGE IS CONSTANT, CALC CONSTANT TIME RANGE
//
//         console.log("CONSTANT TIME RANGE")
//
//     }
//
// }





export {calculateAllBoostStats, getAllBoostCombos};
