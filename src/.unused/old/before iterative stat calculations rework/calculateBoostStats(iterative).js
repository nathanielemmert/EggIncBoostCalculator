
function calc_time_range(startChickens, startEggs, timeForTokens, timeStart, timeEnd, settings, usedBoosts) {//TODO: add a check for completing egg laying goal during time range

    let {timeRemaining:CONTRACTEND} = settings.contractSettings.getValues();
    let { eggLayingRate:ELR, shippingCapacity:SHIPPING, habCapacity:HAB} = settings.calculated.getValues();

    const boost_durations = [...new Set(usedBoosts.map(boost => boost.duration))].sort((a, b)=>a-b)

    let stack = []
    stack.push([timeStart,timeEnd])



    while(!stack.length>0){
        let current_time_range = stack.pop();
        let [start,end] = current_time_range;

        //CHECK INVALID TIME RANGE
        if (end <= start){continue;}

        //CHECK CONTRACT ENDS DURING TIME RANGE
        if (CONTRACTEND < end){
            stack.push([start,CONTRACTEND]);
            continue;
        }

        //CHECK BOOST END DURING TIME RANGE
        for(let duration of boost_durations){
            let boostEndTime = timeForTokens + duration;
            if(boostEndTime>=start &&boostEndTime<end){
                //console.log("BOOST ENDS DURING TIME RANGE",start,end,boostEndTime,activeBoosts);
                return split_time_range(startChickens,startEggs, false, false, timeForTokens,start,boostEndTime,end,settings,usedBoosts)
            }

        }




        //

        //IF NOT CONSTANT, PUSH SPLIT TIME RANGE TO STACK, CONTINUE

        //ELSE, TIME RANGE IS CONSTANT, CALC CONSTANT TIME RANGE

        console.log("CONSTANT TIME RANGE")

    }

}





