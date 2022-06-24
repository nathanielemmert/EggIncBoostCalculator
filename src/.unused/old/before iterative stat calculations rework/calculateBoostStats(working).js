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
        return boostCombos.splice(boostCombos.length, 0, {combo_id:combo_id.join(" ")})//Add the current boostCombo to the array//TODO: combo_id should be an array, not a string
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
    let {initialEggsLayed, eggsRemaining} = settings.contractSettings.getValues();
    if(eggsRemaining<initialEggsLayed)boostCombo.stats.timeFinished=0
    calculateStatsBeforeBoost(boostCombo, settings);
    calculateStatsDuringBoost(boostCombo, settings);
    calculateStatsAfterBoost (boostCombo, settings);
}
function calculateStatsBeforeBoost(boostCombo, settings) {
    //let { timeRemaining, tokenInterval, eggsRemaining, initialPopulation, initialEggsLayed, initialTokens,}
    let { eggLayingRate:ELR, shippingCapacity:SHIPPING, habCapacity:HAB, boostDuration} = settings.calculated.getValues();
    let { timeRemaining,  tokenInterval, eggsRemaining, initialPopulation, initialEggsLayed, initialTokens}
        = settings.contractSettings.getValues();

    //Assume that initial chickens are laying eggs before the boost, but there is no population growth until the boost.
    const used_boosts = list_used_boosts(boostCombo.combo_id, allBoosts).map(boost =>  Object.assign({}, boost, {duration: boost.duration*boostDuration}))//TODO: TEST THIS
    const token_cost = sum(used_boosts.map(boost => boost.token_cost))
    const timeForTokens = Math.max(0,tokenInterval*(token_cost-initialTokens))

    let endTime = Math.min(timeForTokens,timeRemaining)

    //TODO: IHR is assumed to be 0 while you are saving up tokens to boost. This is not accurate If the user puts in initial chickens, but forgets to put in initial tokens
    let [eggsRightBeforeBoost, ,timeFinished] =calc_constant_time_range(initialPopulation, initialEggsLayed, 0, timeForTokens, 0, endTime, settings, used_boosts)
    //let eggsLaidBefore = Math.min(SHIPPING, initialPopulation*ELR)*timeForTokens

    if(timeFinished!==undefined)boostCombo.stats.timeFinished=timeFinished
    boostCombo.stats = {...boostCombo.stats,
               eggs_laid_before: eggsRightBeforeBoost-initialEggsLayed,
        chickens_hatched_before:0,
                eggs_layed:eggsRightBeforeBoost,
        hatched_chickens: initialPopulation
    }
}


function calculateStatsDuringBoost(boostCombo, settings) {
    let { tokenInterval, eggsRemaining,   initialTokens}
        = settings.contractSettings.getValues();

    let { boostDuration} = settings.calculated.getValues();
    let { eggs_layed:startEggs, hatched_chickens:startChickens} = boostCombo.stats
    //TODO: time habs fill, time shipping fills should be boost stats
    //TODO: if initial eggs is greater than the contract goal, finish immediately
    const used_boosts = list_used_boosts(boostCombo.combo_id, allBoosts).map(boost =>  Object.assign({}, boost, {duration: boost.duration*boostDuration}))//TODO: TEST THIS
    const ge_cost = sum(used_boosts.map(boost => boost.ge_cost))
    const token_cost = sum(used_boosts.map(boost => boost.token_cost))
    const timeForTokens = Math.max(0,tokenInterval*(token_cost-initialTokens))
    const max_duration = Math.max(...used_boosts.filter(boost => boost.isPrism).map(boost => boost.duration))

    let [eggsAfterBoost, chickensAfterBoost, timeFinished]= calc_time_range(startChickens,startEggs,timeForTokens,timeForTokens,timeForTokens+max_duration, settings, used_boosts)

    if(timeFinished!==undefined)boostCombo.stats.timeFinished=timeFinished
    boostCombo.stats = {...boostCombo.stats,
        used_boosts: used_boosts,
        ge_cost : ge_cost,
        token_cost : token_cost,
        max_duration : max_duration,
        chickens_hatched_during:chickensAfterBoost-startChickens,
        eggs_laid_during:eggsAfterBoost-startEggs,
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
    let [eggsAfterBoost, chickensAfterBoost, timeFinished]= calc_time_range(hatched_chickens,eggs_layed,timeForTokens,timeForTokens+max_duration,timeRemaining, settings, [])

    if(timeFinished!==undefined)boostCombo.stats.timeFinished=timeFinished
    boostCombo.stats = {...boostCombo.stats,

        chickens_hatched_after:chickensAfterBoost-hatched_chickens,
        eggs_laid_after:eggsAfterBoost - eggs_laid_during - eggs_laid_before,
        eggs_layed:eggsAfterBoost,
        hatched_chickens: chickensAfterBoost
    }
}

/*returns minutes remaining until contract goal is met*/
function calc_time_finished(ELR, IHR, startChickens, startEggs, contractGoal){//TODO: include shipping capacity in this estimate
    let a=ELR*IHR/2
    let b=startChickens*ELR
    let c = startEggs-contractGoal

    return (-b+ Math.sqrt(b**2-4*a*c))/(2*a)
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


function split_time_range(startChickens, startEggs, habsFill, shippingFills, timeForTokens, start, split, end, settings, usedBoosts){
    //TODO:If Hab Or Shipping Limited, Set the Values to their Exact Capacities Here, And not the calculated value (float rounding problem)
    let { eggLayingRate:ELR, shippingCapacity:SHIPPING, habCapacity:HAB} = settings.calculated.getValues();
    let [E1, C1, T1] = calc_time_range(startChickens, startEggs, timeForTokens, start, split,settings,usedBoosts)

    if(habsFill)C1=HAB//prevent floating point rounding errors

    let [E2, C2, T2] = calc_time_range( C1, E1, timeForTokens, split, end,settings,usedBoosts)//C1, split,   end,0, settings)
    return [E2, C2,(T1!==undefined)?T1:T2]
}

function calc_constant_time_range(startChickens, startEggs, IHR, timeForTokens, start, end, settings, usedBoosts){
    //console.log(Number(start.toFixed(1)),Number(end.toFixed(1)))
    console.log(start,end)

    let {timeRemaining:CONTRACTEND, eggsRemaining:contractGoal} = settings.contractSettings.getValues();
    let {eggLayingRate:ELR, shippingCapacity:SHIPPING, habCapacity:HAB} = settings.calculated.getValues();
    //TODO: check what time the egg laying goal will be met, return that calculated time if it is in the current time range.
    let estimatedFinish = start+calc_time_finished(ELR, IHR, startChickens, startEggs, contractGoal);

    //console.log(start, end, "FINISH TIME:",estimatedFinish)

    let finishTime;
    if(start<estimatedFinish && estimatedFinish<=end){

        finishTime=estimatedFinish
    }


    //if(startChickens!==Math.round(startChickens))console.warn(startChickens,HAB,"POSSIBLE FLOATING POINT ERROR IN HAB",start, end)
    if(startChickens>=HAB)IHR=0//IF HAB LIMITED


    //Calculate hatched chickens
    let duration = end-start;
    let hatchedChickens = IHR*duration



    //Calculate egg laying rate
    let eggsLayed = duration * ELR*(startChickens + hatchedChickens/2)
    if(startChickens*ELR>=SHIPPING){eggsLayed=SHIPPING*duration}//IF SHIPPING LIMITED
    if(startChickens*ELR!==Math.round(startChickens*ELR))console.warn(startChickens*ELR,SHIPPING,"POSSIBLE FLOATING POINT ERROR IN SHIPPING",start, end)

    //Calculate egg laying rate
    //let eggsLayed =  Math.min(ELR*(startChickens + hatchedChickens/2), SHIPPING)* duration


    return [startEggs+eggsLayed, startChickens+hatchedChickens,finishTime]
}

function calc_time_range(startChickens, startEggs, timeForTokens, start, end, settings, usedBoosts) {//TODO: add a check for completing egg laying goal during time range

    //console.log(startChickens, startEggs, timeForTokens, start, end)
    let {timeRemaining:CONTRACTEND} = settings.contractSettings.getValues();
    let { eggLayingRate:ELR, shippingCapacity:SHIPPING, habCapacity:HAB} = settings.calculated.getValues();

    //If the Time Range is invalid (ends before it starts): return 0 eggs layed, 0 chickens hatched
    if (end <= start){console.log("INVALID TIME RANGE",start,end);return [startEggs, startChickens]}

    //If Contract ends during Time Range: only count eggs laid before contract end
    if (CONTRACTEND < end) {console.log("CONTRACT ENDS DURING TIME RANGE",start,end);return calc_time_range(startChickens, startEggs, timeForTokens, start, CONTRACTEND, settings, usedBoosts)}

    //If any boost ends during Time Range: split the time range
    let activeBoosts = usedBoosts.filter(boost => (timeForTokens + boost.duration) > start )
    //console.log(activeBoosts,usedBoosts)
    for(let boost of activeBoosts){
        let boostEndTime = timeForTokens + boost.duration ;
        if(boostEndTime>=start &&boostEndTime<end){
            console.log("BOOST ENDS DURING TIME RANGE",start,end,boostEndTime,activeBoosts);
            return split_time_range(startChickens,startEggs, false, false, timeForTokens,start,boostEndTime,end,settings,usedBoosts)
        }
    }

    let IHR = calc_boosted_IHR(activeBoosts, timeForTokens, start, settings);

    //If Habs fill during Time Range: split into two Time Ranges. one before habs fill, one after habs fill
    let habFillTime = start + (HAB - startChickens) / IHR
    if (habFillTime > start &&
        habFillTime < end){     console.log("HABS FILL DURING TIME RANGE",start,end);return split_time_range(startChickens, startEggs, true, false, timeForTokens, start, habFillTime, end, settings,usedBoosts)}

    //If Shipping fills during Time Range: split into two Time Ranges. one before Shipping fills, one after Shipping fills
    let shippingFillTime = start + (SHIPPING / ELR - startChickens) / IHR
    if (shippingFillTime > start &&
        shippingFillTime < end){console.log("SHIPPING FILLS DURING TIME RANGE",start,end);return split_time_range(startChickens, startEggs, false, false, timeForTokens, start, shippingFillTime, end, settings,usedBoosts)}


    //the Time Range can now be calculated assuming constant boosts, IHR, per-chicken ELR
    return calc_constant_time_range(startChickens,startEggs, IHR, timeForTokens, start,end,settings,usedBoosts)//TODO: must pass in active_boosts, not usedBoosts
}





export {calculateAllBoostStats, getAllBoostCombos};
