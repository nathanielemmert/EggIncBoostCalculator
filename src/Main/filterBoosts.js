

function removeInsufficientBoostsForContract(boostCombos, settings){

        let {eggLayingRate:eggs_layed_per_minute} = settings.calculated.getValues()

        let {timeRemaining:contract_minutes,
            tokenInterval:contract_token_interval_minutes,
            eggsRemaining:goal,
            initialTokens:starting_tokens,
            initialEggsLayed:eggs_layed_before_boost,
            initialPopulation: starting_chickens} = settings.contractSettings.getValues();

        console.log(starting_chickens)

        //let contract_minutes = 14*24*60;
        //let contract_token_interval_minutes = 5;
        //let goal = 200n * 10n**15n;

        for( let i = 0; i < boostCombos.length; i++){

            let eggs_layed_after_boost=
                (boostCombos[i].stats.hatched_chickens+starting_chickens)*eggs_layed_per_minute
                *(contract_minutes-boostCombos[i].stats.max_duration-(contract_token_interval_minutes*Math.max(boostCombos[i].stats.token_cost-starting_tokens,0)));//TODO: this is simple calculation, not including chickens hatched after boost

            let total_eggs_layed = eggs_layed_after_boost+eggs_layed_before_boost;//+eggs_layed_during_boost+eggs_layed_before_boost;
            //console.log(boostCombos[i], total_eggs_layed);
            boostCombos[i].stats.eggs_layed += total_eggs_layed//TODO: BAD CODE
            if( boostCombos[i].stats.eggs_layed <goal){
                boostCombos.splice(i, 1);//remove the current boost combo
                i--;
            }
        }

        //Sort the list by ge cost then chickens hatched
        boostCombos.sort((a, b) => {
            if(a.stats.ge_cost === b.stats.ge_cost)
                return a.stats.hatched_chickens > b.stats.hatched_chickens ? 1 : -1
            return a.stats.ge_cost>b.stats.ge_cost ? 1 : -1
        })



        //Remove Objectively bad Boost combos (same ge cost, less chickens hatched)
        for( let i = 0; i < boostCombos.length-1; i++){
            //console.log(i,boostCombos[i]);
            //console.log(boostCombos[i],boostCombos[i+1],boostCombos[i].stats.ge_cost === boostCombos[i+1].stats.ge_cost && boostCombos[i].stats.hatched_chickens < boostCombos[i+1].stats.hatched_chickens )
            if(boostCombos[i].stats.ge_cost === boostCombos[i+1].stats.ge_cost && boostCombos[i].stats.hatched_chickens < boostCombos[i+1].stats.hatched_chickens ) {

                boostCombos.splice(i, 1);//TODO: ge ratio is used in the above line instead of hatched chickens to comply with the "dont count chickens above hab capacity" setting. This is bad code
                i-= (i>=2)?2:1;
            }
        }
}
export default removeInsufficientBoostsForContract;