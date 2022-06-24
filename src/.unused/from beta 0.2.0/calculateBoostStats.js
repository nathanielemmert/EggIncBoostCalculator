import sum from "./helpers/sum";
import getBoostsArray from "./resources/getBoostsArray";
import parseNumber from "./helpers/parseNumber";
import {logDOM} from "@testing-library/react";


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

//TODO: if the contract ends while boosts are active, insufficient boosts will show estimated time finished as if the boost was permanently active. fix this
function calc_time_finished(ELR, IHR, startChickens, startEggs, CONTRACTGOAL,SHIPPING, shippingLimited){
    if(startEggs===CONTRACTGOAL)return 0
    if(shippingLimited)return (CONTRACTGOAL-startEggs)/SHIPPING
    let a=IHR/2
    let b=startChickens
    let c = (startEggs-CONTRACTGOAL)/ELR

    return 2*c/(-b- Math.sqrt(b**2-4*a*c))
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
    boostCombo.ge_cost = sum(used_boosts.map(boost => boost.ge_cost));//TODO: include boost sale
    boostCombo.token_cost = sum(used_boosts.map(boost => boost.token_cost));
    boostCombo.max_duration = Math.max(...used_boosts.map(boost => boost.duration));
    boostCombo.max_prism_duration = Math.max(...used_boosts.filter(boost => boost.isPrism).map(boost => boost.duration));
    //List of constant time durations
    const time_steps = [...new Set([0,...used_boosts.map(boost => boost.duration)])].sort((a, b)=>a-b);
    const boost_durations = [];
    for(let i = 0;i<time_steps.length-1;i++){
        let active_boosts = used_boosts.filter(boost => (boost.duration)>time_steps[i])
        boost_durations.push({
            start:time_steps[i],
            end:time_steps[i+1],
            IHR_boost:calc_boosted_IHR(active_boosts, time_steps[i])
        })
    }
    boostCombo.boost_durations = boost_durations;
}



function calculateAllBoostStats(boostCombos, appState){
    boostCombos.forEach((combo)=>calculateBoostStats(combo, appState))
}
function calculateBoostStats(boostCombo, appState){//TODO: check contract end, hab full, shipping full, complete contract
    let { eggLayingRate:ELR, shippingCapacity:SHIPPING, habCapacity:HAB, internalHatcheryRate: IHR, boostDuration:DURATION, boostEffectiveness:MONOCLE} = appState.values;//Calculated
    let { timeRemaining:CONTRACTEND,  tokenInterval, eggsRemaining:CONTRACTGOAL, initialPopulation, initialEggsLayed, initialTokens} = appState.values;//Contract settings
    // [ELR, SHIPPING, HAB,  IHR, DURATION, MONOCLE,CONTRACTEND,  tokenInterval, CONTRACTGOAL, initialPopulation, initialEggsLayed, initialTokens].forEach(v =>console.log(v===''?'\'\'':v))
    // return

    boostCombo.max_duration = Math.max(...boostCombo.used_boosts.map(boost => boost.duration))*DURATION;
    boostCombo.max_prism_duration = Math.max(...boostCombo.used_boosts.filter(boost => boost.isPrism).map(boost => boost.duration))*DURATION;

    let {boost_durations, combo_id, ge_cost, max_duration, max_prism_duration, token_cost, used_boosts} = boostCombo

    const timeForTokens = Math.max(0,tokenInterval*(token_cost-initialTokens))

    let chickens_hatched = Math.min(HAB, initialPopulation);
    let eggs_laid = initialEggsLayed;

    let habs_full = initialPopulation>=HAB
    let shipping_full = initialPopulation*ELR>=SHIPPING

    boostCombo.stats={time_finished:NaN}
    console.log("")

    //////////////////////////////////////////////////////////
    ///////////////////////BEFORE BOOST///////////////////////
    //////////////////////////////////////////////////////////

    let boostStartTime = Math.min(CONTRACTEND,timeForTokens)
    eggs_laid+= boostStartTime * Math.min(SHIPPING, ELR*chickens_hatched)
    console.log(boostCombo.combo_id.join(""),boostCombo, 0,boostStartTime )

    //TODO: include eggs laid by initial chickens while waiting for boost.
    // Population growth assumed to be 0 during this time.

    //////////////////////////////////////////////////////////
    ///////////////////////DURING BOOST///////////////////////
    //////////////////////////////////////////////////////////

    let population_before_boost = chickens_hatched;
    {

        let time_ranges = [...boost_durations].reverse()//reverse to allow stack behavior
            .filter(time_range => time_range.end <= max_prism_duration)//"DURING BOOST" time range only includes time with active prisms
            .map(time_range => {return {...time_range, start: timeForTokens + time_range.start*DURATION, end: timeForTokens + time_range.end*DURATION}})
        let [new_chickens, new_eggs, habs_filled, shipping_filled]
            = calculate_time_range(boostCombo, timeForTokens, time_ranges, CONTRACTEND, CONTRACTGOAL, HAB, SHIPPING, IHR, ELR, MONOCLE, chickens_hatched, eggs_laid, habs_full, shipping_full)
        chickens_hatched = new_chickens
        eggs_laid = new_eggs
        habs_full = habs_filled
        shipping_full = shipping_filled
    }
    let chickens_hatched_during_boost= chickens_hatched-population_before_boost


    if(eggs_laid<CONTRACTGOAL)boostCombo.stats.time_finished=NaN
    //TODO: currently, time_finished can be after the current time range ends, to show when you "would have" finished if you had more time.
    // This is a problem when the contract ends during a boost. The time estimate will show a time finished of way too soon.
    // Until this can be fixed, this line gets

    //////////////////////////////////////////////////////////
    ////////////////////////AFTER BOOST///////////////////////
    //////////////////////////////////////////////////////////

    //TODO: if any boost types other than prisms are calculated,
    // the start of this time range should be split based on any remaining beacons that end after all prisms, and then until contract end
    {
        let time_ranges = [{
            start: timeForTokens+max_prism_duration*DURATION,
            end: CONTRACTEND,
            IHR_boost: 1
        }]

        let [new_chickens, new_eggs, habs_filled, shipping_filled]
            = calculate_time_range(boostCombo, timeForTokens, time_ranges, CONTRACTEND, CONTRACTGOAL, HAB, SHIPPING, IHR, ELR, MONOCLE, chickens_hatched, eggs_laid, habs_full, shipping_full)
        chickens_hatched = new_chickens
        eggs_laid = new_eggs
        habs_full = habs_filled
        shipping_full = shipping_filled
    }


    boostCombo.stats = {
        chickens_hatched:chickens_hatched,
        eggs_laid:eggs_laid,
        time_finished:boostCombo.stats.time_finished,
        chickens_hatched_during_boost:chickens_hatched_during_boost
    }
}

/*Given a time range that is already split based on boost duration, calculate stats for the time range*/
function calculate_time_range(boostCombo, timeForTokens, time_ranges, CONTRACTEND, CONTRACTGOAL, HAB,  SHIPPING, IHR, ELR, MONOCLE, chickens_hatched, eggs_laid,  habs_full, shipping_full ){

    while(time_ranges.length>0){
        const time_range = time_ranges.pop()

        habs_full = habs_full || time_range.habs_filled//habs filled at end of previous time range
        shipping_full=shipping_full||time_range.shipping_filled//shipping filled at end of previous time range
        //TODO: for performance optimization, if habs or shipping are full, immediately return the rest of the time range

        let {start, end, IHR_boost} = time_range
        end = Math.min(CONTRACTEND, end)//CONTRACT ENDS DURING TIME RANGE
        if(end<=start)break;//INVALID TIME RANGE

        let boosted_IHR = IHR_boost*IHR*4*3
        if(start<timeForTokens+boostCombo.max_prism_duration)boosted_IHR*=MONOCLE

        if(habs_full) {
            boosted_IHR = 0//CHECK HABS FULL
            chickens_hatched=HAB
        }

        let habFillTime = start + (HAB - chickens_hatched) / boosted_IHR
        let shippingFillTime = start + (SHIPPING / ELR - chickens_hatched) / boosted_IHR
        if(habFillTime>start && habFillTime<end){//SPLIT HAB FILL
            time_ranges.push({start:habFillTime, end:end, IHR_boost:IHR_boost,habs_filled:true})
            time_ranges.push({start:start, end:habFillTime, IHR_boost:IHR_boost})
            continue;
        }
        if(shippingFillTime>start && shippingFillTime<end){//SPLIT SHIPPING FILL
            time_ranges.push({start:shippingFillTime, end:end, IHR_boost:IHR_boost,shipping_filled:true})
            time_ranges.push({start:start, end:shippingFillTime, IHR_boost:IHR_boost})
            continue;
        }
        if(time_range.shipping_filled)console.log("SPLIT SHIPPING")
        if(time_range.habs_filled)console.log("SPLIT HABS FULL")


        let estimatedFinish = start+calc_time_finished(ELR, boosted_IHR, chickens_hatched, eggs_laid, CONTRACTGOAL,SHIPPING, shipping_full);
        if(estimatedFinish>start)boostCombo.stats.time_finished=estimatedFinish
        console.log(boostCombo.combo_id.join(""),boostCombo,  start, end, estimatedFinish)
        let [new_chickens,new_eggs] = calc_constant_time_range(end-start, boosted_IHR, SHIPPING,ELR,  chickens_hatched, shipping_full)

        chickens_hatched=new_chickens
        eggs_laid+=new_eggs
    }
    return [chickens_hatched, eggs_laid,  habs_full, shipping_full]
}

/*Calculate a time range, assuming IHR and Shipping rate are constant, and the contract doesnt end*/
function calc_constant_time_range(duration, boosted_IHR, SHIPPING,ELR,  chickens_hatched, shipping_full){

    let new_chickens = boosted_IHR*duration

    let egg_shipping_rate = Math.min(SHIPPING, ELR*(chickens_hatched + new_chickens/2))
    if(shipping_full) egg_shipping_rate = SHIPPING

    let new_eggs = duration * egg_shipping_rate

    return [chickens_hatched+new_chickens, new_eggs]
}


export {calculateAllBoostStats, getAllBoostCombos};
