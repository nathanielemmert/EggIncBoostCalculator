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
    boostCombos.forEach((combo)=>calculateBoostStats(combo, settings))
}

function calculateBoostStats(boostCombo, settings){
    //console.log(boostCombo)
    boostCombo.stats = {};
    calculateStatsBeforeBoost(boostCombo, settings);
    calculateStatsDuringBoost(boostCombo, settings);
    calculateStatsAfterBoost (boostCombo, settings);
    boostCombo.stats = {...boostCombo.stats,
        hatched_chickens:boostCombo.stats.chickens_hatched_during,
        //eggs_layed:boostCombo.stats.eggs_laid_after//TODO: REMOVE, this is only here to emulate previous (inaccurate) behaviour
    }
}
function calculateStatsBeforeBoost(boostCombo, settings) {
    //let { timeRemaining, tokenInterval, eggsRemaining, initialPopulation, initialEggsLayed, initialTokens,}
    let {initialPopulation, initialEggsLayed} = settings.contractSettings.getValues();

    boostCombo.stats = {...boostCombo.stats,
        chickens_hatched_before: initialPopulation,
               eggs_laid_before: initialEggsLayed,
    }
}


function calculateStatsDuringBoost(boostCombo, settings) {
    let { tokenInterval, eggsRemaining, initialPopulation, initialEggsLayed, initialTokens}
        = settings.contractSettings.getValues();

    let { boostDuration} = settings.calculated.getValues();
    console.log("initialTokens",initialTokens)
    //TODO: if initial eggs is greater than the contract goal, finish immediately
    const used_boosts = list_used_boosts(boostCombo.combo_id, allBoosts).map(boost =>  Object.assign({}, boost, {duration: boost.duration*boostDuration}))//TODO: TEST THIS
    const ge_cost = sum(used_boosts.map(boost => boost.ge_cost))
    const token_cost = sum(used_boosts.map(boost => boost.token_cost))
    const timeForTokens = Math.max(0,tokenInterval*(token_cost-initialTokens))
    const max_duration = Math.max(...used_boosts.filter(boost => boost.isPrism).map(boost => boost.duration))

    //settings cant change during this time range (eg unlocking new research)
    let [eggsAfterBoost, chickensAfterBoost]= calc_time_range(initialPopulation,initialEggsLayed,timeForTokens,timeForTokens,timeForTokens+max_duration, timeForTokens+max_duration, settings, used_boosts)
    //console.log(Math.max(0,chickensAfterBoost-initialPopulation), chickensAfterBoost,initialPopulation)
    boostCombo.stats = {...boostCombo.stats,
        used_boosts: used_boosts,
        ge_cost : ge_cost,
        token_cost : token_cost,
        max_duration : max_duration,
        chickens_hatched_during:Math.max(0,chickensAfterBoost-initialPopulation),
        eggs_laid_during:eggsAfterBoost-initialEggsLayed,
        eggs_layed:eggsAfterBoost,
        hatched_chickens: chickensAfterBoost
    }
}


function calculateStatsAfterBoost(boostCombo, settings) {
    let { timeRemaining, tokenInterval, eggsRemaining, initialPopulation, initialEggsLayed, initialTokens}
        = settings.contractSettings.getValues();

    let { boostDuration} = settings.calculated.getValues();

    let {max_duration,eggs_layed,eggs_laid_during, eggs_laid_before,hatched_chickens, token_cost} = boostCombo.stats

    const timeForTokens = Math.max(0,tokenInterval*(token_cost-initialTokens))


    let [eggsAfterBoost, chickensAfterBoost]= calc_time_range(hatched_chickens,eggs_layed,timeForTokens,timeForTokens+max_duration,timeRemaining, timeRemaining, settings, [])

    boostCombo.stats = {...boostCombo.stats,

        chickens_hatched_after:chickensAfterBoost-hatched_chickens,
        eggs_laid_after:eggsAfterBoost - eggs_laid_during - eggs_laid_before,
        eggs_layed:eggsAfterBoost,
        hatched_chickens: chickensAfterBoost
    }
}

function calc_boosted_IHR(usedBoosts, timeForTokens, start, settings){
    let {internalHatcheryRate: IHR, boostEffectiveness:MONOCLE} = settings.calculated.getValues();

    let activeBoosts = usedBoosts.filter(boost => (timeForTokens + boost.duration) >start  )
    let prismBonus  = activeBoosts.reduce((p,boost)=>p || boost.isPrism  , false) ? 0 : 1
    let beaconBonus = activeBoosts.reduce((p,boost)=>p || boost.isBeacon , false) ? 0 : 1
    for(let boost of activeBoosts){
        if(boost.isPrism)   prismBonus+=boost.multiplier
        if(boost.isBeacon) beaconBonus+=boost.multiplier
    }
    return IHR * (prismBonus*MONOCLE) * beaconBonus * 4 * 3 //TODO: remove hardcoded Internal Hatchery Calm, and 4 habs that always have equal chickens


}


function split_time_range(startChickens, startEggs, habsFill, shippingFills, IHR,  timeForTokens, start, split, end, absoluteEnd, settings, usedBoosts){
    //TODO:If Hab Or Shipping Limited, Set the Values to their Exact Capacities Here, And not the calculated value (float rounding problem)

    let {eggLayingRate:ELR, shippingCapacity:SHIPPING, habCapacity:HAB} = settings.calculated.getValues();

    let [E1, C1, H1, S1] = calc_time_range(startChickens, startEggs,  timeForTokens, start, split, absoluteEnd, settings,usedBoosts)


    if(H1!==habsFill     )console.warn("FLOATING POINT ROUNDING ERROR IN HAB      CAPACITY",C1,HAB,C1!==HAB)
    if(S1!==shippingFills)console.warn("FLOATING POINT ROUNDING ERROR IN SHIPPING CAPACITY",C1*ELR,SHIPPING,C1*ELR>=SHIPPING)

    if(habsFill){//HABS FILL, trivially calculate and return FULL remaining time range
        let [E2, C2, H2, S2] = calc_constant_time_range(HAB, E1, true, true, IHR, timeForTokens, split, end, absoluteEnd, settings,usedBoosts)//C1, split,   end,0, settings)
        //if(C1!==HAB)console.log(C1, HAB, C1===HAB)
        return [E2, C2, true, true]
    }

    if(shippingFills){//SHIPPING FILLS, Immediately return Eggs for rest of time range, continue calculating chickens
        let [E2, , , ] = calc_constant_time_range(C1, E1, false, true, IHR, timeForTokens, split, end, absoluteEnd, settings,usedBoosts)//C1, split,   end,0, settings)
        let [E0, C2, H2, S2] = calc_time_range( C1, E1, timeForTokens, split, end, absoluteEnd, settings,usedBoosts)

        //let [E2, C2, H2, S2] = calc_time_range( C1, E1, timeForTokens, split, end, absoluteEnd, settings,usedBoosts)//C1, split,   end,0, settings)
        return [E2, C2, H2, true ]
    }

    //NOT LIMITED BY SHIPPING OR HABS
    let [E2, C2, H2, S2] = calc_time_range( C1, E1, timeForTokens, split, end, absoluteEnd, settings,usedBoosts)//C1, split,   end,0, settings)
    return [E2, C2, H2, S2]
}

function calc_constant_time_range(startChickens, startEggs, habsFull, shippingFull, IHR, timeForTokens, start, end, absoluteEnd, settings, usedBoosts){
    console.log("TIME FOR TOKENS",timeForTokens)
    console.log(Number(start.toFixed(1)),Number(end.toFixed(1)),usedBoosts.length===0?"AFTER BOOST":"DURING BOOST",IHR,habsFull,shippingFull)

    let {timeRemaining:CONTRACTEND} = settings.contractSettings.getValues();
    let {eggLayingRate:ELR, shippingCapacity:SHIPPING, habCapacity:HAB} = settings.calculated.getValues();
    //TODO: check what time the egg laying goal will be met, return that calculated time if it is in the current time range.

    if(habsFull) {//IF HAB LIMITED
        let duration = absoluteEnd-start
        let eggsLayed = duration*Math.min(SHIPPING,HAB*ELR)
        console.log(absoluteEnd, SHIPPING>HAB*ELR,HAB*ELR,eggsLayed)
        return [startEggs+eggsLayed,HAB, true, true]//TODO: last two return values should be if habs filled, if shipping filled
    }

    if(shippingFull){//IF SHIPPING LIMITED BUT NOT HAB LIMITED
        let eggDuration = absoluteEnd-start
        let habDuration = end-start

        let hatchedChickens = IHR*habDuration
        let eggsLayed = eggDuration*Math.min(SHIPPING,HAB*ELR)//min function should be replaced by SHIPPING, but isnt to keep consistency with habsFull behaviour

        return [startEggs+eggsLayed,startChickens+hatchedChickens, false, true]//TODO: last two return values should be if habs filled, if shipping filled
    }

    // NOT LIMITED BY HAB OR SHIPPING


    //Calculate hatched chickens
    let duration = end-start;
    let hatchedChickens = IHR*duration

    //Calculate egg laying rate
    let eggsLayed = duration * ELR*(startChickens + hatchedChickens/2)

    return [startEggs+eggsLayed, startChickens+hatchedChickens, (startChickens+hatchedChickens)>=HAB, (startChickens+hatchedChickens)*ELR>=SHIPPING]
}

function calc_time_range(startChickens, startEggs, timeForTokens, start, end, absoluteEnd, settings, usedBoosts) {//TODO: add a check for completing egg laying goal during time range
    //console.log(startChickens, startEggs, timeForTokens, start, end)
    let {timeRemaining:CONTRACTEND} = settings.contractSettings.getValues();
    let { eggLayingRate:ELR, shippingCapacity:SHIPPING, habCapacity:HAB} = settings.calculated.getValues();

    //If the Time Range is invalid (ends before it starts): return 0 eggs layed, 0 chickens hatched
    if (end <= start){console.log("INVALID TIME RANGE",start,end);return [startEggs, startChickens, false, false]}//TODO: last two return values should be if habs filled, if shipping filled

    //If Contract ends during Time Range: only count eggs laid before contract end
    if (CONTRACTEND < end) {console.log("CONTRACT ENDS DURING TIME RANGE",start,end);return calc_time_range(startChickens, startEggs,  timeForTokens, start, CONTRACTEND, CONTRACTEND, settings, usedBoosts)}


    let activeBoosts = usedBoosts.filter(boost => (timeForTokens + boost.duration) >= end )
    let IHR = calc_boosted_IHR(activeBoosts, timeForTokens, start, settings);

    let habFillTime = start + (HAB - startChickens) / IHR
    let habsFull = habFillTime<=start



    //If habs are already full, safe to perform constant calculation, not needed to calculate based on time range
    if(habsFull) {console.log("habs full at start of time range");return calc_constant_time_range(startChickens, startEggs, true, true, IHR, timeForTokens, start, end, absoluteEnd, settings, usedBoosts)}

    //If any boost ends during Time Range: split the time range
    for(let boost of activeBoosts){
        let boostEndTime = timeForTokens + boost.duration ;
        if(boostEndTime>=start &&boostEndTime<end){
            console.log("BOOST ENDS DURING TIME RANGE",start,end);
            return split_time_range(startChickens,startEggs, false, false, IHR,timeForTokens,start,boostEndTime,end,absoluteEnd,settings,usedBoosts)
        }
    }


    //If Habs fill during Time Range: split into two Time Ranges. one before habs fill, one after habs fill

    if (habFillTime > start &&
        habFillTime < end){     console.log("HABS FILL DURING TIME RANGE",start,end);return split_time_range(startChickens, startEggs, true, true, IHR, timeForTokens, start, habFillTime, end, absoluteEnd, settings,usedBoosts)}

    //If Shipping fills during Time Range: split into two Time Ranges. one before Shipping fills, one after Shipping fills
    let shippingFillTime = start + (SHIPPING / ELR - startChickens) / IHR
    let shippingFull = shippingFillTime<=start
    if (shippingFillTime > start &&
        shippingFillTime < end){console.log("SHIPPING FILLS DURING TIME RANGE",start,end);return split_time_range(startChickens, startEggs, false, true, IHR, timeForTokens, start, shippingFillTime, end, absoluteEnd, settings,usedBoosts)}


    //the Time Range can now be calculated assuming constant boosts, IHR, per-chicken ELR
    return calc_constant_time_range(startChickens,startEggs, habsFull, shippingFull, IHR, timeForTokens, start,end, absoluteEnd, settings,usedBoosts)
}





export {calculateAllBoostStats, getAllBoostCombos};
