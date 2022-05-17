function filterNonOptimalBoostCombos(boostCombos,filterType){
    //filterByOptimalGeRatio(boostCombos);
    //filterByOptimalTokens(boostCombos);
    filterOutInsufficentCombosForContract(boostCombos);
    //filterByOptimalGeRatio(boostCombos);
}

function filterOutInsufficentCombosForContract(boostCombos){
    const num_chickens = 1;//37270259;
    let eggs_layed_per_minute =
         2      //Base egg laying rate
        *6      //Comfy Nests
        *3.5    //Henhouse AC
        *5.5    //Improved Genetics
        *3      //Time Compression
        *1.16   //Timeline Diversion
        *1.75   //Epic Comfy Nests
        //*1.67   //Deflector
        *1.15   //Metronome
        *num_chickens;

    let contract_minutes = 14*24*60;
    let contract_token_interval_minutes = 5;
    // eslint-disable-next-line no-undef
    let goal = 200n * 10n**15n;

    for( let i = 0; i < boostCombos.length; i++){

        // eslint-disable-next-line no-unused-vars
        //let eggs_layed_before_boost=(contract_token_interval_minutes*boostCombos[i].token_cost);//probably close to 0, but users may want to input custom value

        // eslint-disable-next-line no-unused-vars
        //let eggs_layed_during_boost=boostCombos[i].max_duration;//times integral of egg laying rate for that time

        let eggs_layed_after_boost=
            boostCombos[i].hatched_chickens*eggs_layed_per_minute
            *(contract_minutes-boostCombos[i].max_duration-(contract_token_interval_minutes*boostCombos[i].token_cost));

        let total_eggs_layed = eggs_layed_after_boost;//+eggs_layed_during_boost+eggs_layed_before_boost;
        //console.log(boostCombos[i], total_eggs_layed);
        boostCombos[i].eggs_layed = total_eggs_layed//TODO: BAD CODE
        if(total_eggs_layed<goal){
            boostCombos.splice(i, 1);//remove the current boost combo
            i--;
        }
    }

    //Sort the list by ge cost then chickens hatched
    boostCombos.sort((a, b) => {
        if(a.ge_cost === b.ge_cost)
            return a.hatched_chickens > b.hatched_chickens ? 1 : -1
        return a.ge_cost>b.ge_cost ? 1 : -1
    })



    //Remove Objectively bad Boost combos (same ge cost, less chickens hatched)
    for( let i = 0; i < boostCombos.length-1; i++){
        //console.log(i,boostCombos[i]);
        if(boostCombos[i].ge_cost === boostCombos[i+1].ge_cost && boostCombos[i].ge_ratio < boostCombos[i+1].ge_ratio ) {
            boostCombos.splice(i, 1);//TODO: ge ratio is used in the above line instead of hatched chickens to comply with the "dont count chickens above hab capacity" setting. This is bad code
            i-=1;
        }
    }


}

function filterByOptimalTokens(boostCombos){
    //Sort the list by token cost then chickens hatched
    boostCombos.sort((a, b) => {
        if(a.token_cost === b.token_cost)
            return a.hatched_chickens > b.hatched_chickens ? 1 : -1
        return a.token_cost>b.token_cost ? 1 : -1
    })

    // //Remove Objectively bad Boost combos (same token cost, less chickens hatched)
    // for( let i = 0; i < boostCombos.length-1; i++){
    //     //console.log(boostCombos[i].ge_ratio +" "+ boostCombos[i+1].ge_ratio)
    //     if(boostCombos[i].token_cost === boostCombos[i+1].token_cost && boostCombos[i].hatched_chickens < boostCombos[i+1].hatched_chickens ) {
    //         boostCombos.splice(i, 1);
    //         i-=2
    //     }
    // }

    // //Remove Objectively bad Boost combos (same ge cost, less chickens hatched)
    // let best_ge_ratio = 0
    // for( let i = 0; i < boostCombos.length; i++){
    //     //console.log(i)
    //     if ( boostCombos[i].ge_ratio< best_ge_ratio) {
    //         boostCombos.splice(i, 1);
    //         i--;
    //     }
    //     else{
    //         best_ge_ratio = boostCombos[i].ge_ratio
    //     }
    // }

    //Remove all boost combos not having the maximum possible token ratio
    // let best_token_ratio = 0
    // for( let i = 0; i < boostCombos.length; i++){
    //     let token_ratio = boostCombos[i].hatched_chickens/boostCombos[i].token_cost
    //     if ( token_ratio< best_token_ratio) {
    //         boostCombos.splice(i, 1);
    //         i--;
    //     }
    //     else{
    //         best_token_ratio = token_ratio
    //     }
    // }

}
function filterByOptimalGeRatio(boostCombos){

    //Sort the list by ge cost then chickens hatched
    boostCombos.sort((a, b) => {
        if(a.ge_cost === b.ge_cost)
            return a.hatched_chickens > b.hatched_chickens ? 1 : -1
        return a.ge_cost>b.ge_cost ? 1 : -1
    })

    //Remove Objectively bad Boost combos (same ge cost, less chickens hatched)
    for( let i = 0; i < boostCombos.length-1; i++){
        //console.log(boostCombos[i].ge_ratio +" "+ boostCombos[i+1].ge_ratio)
        if(boostCombos[i].ge_cost === boostCombos[i+1].ge_cost && boostCombos[i].ge_ratio < boostCombos[i+1].ge_ratio ) {
            boostCombos.splice(i, 1);
            i-=2
        }

    }

    //Remove all boost combos not having the maximum possible GE ratio
    let best_ge_ratio = 0
    for( let i = 0; i < boostCombos.length; i++){
        //console.log(i)
        if ( boostCombos[i].ge_ratio< best_ge_ratio) {
            boostCombos.splice(i, 1);
            i--;
        }
        else{
            best_ge_ratio = boostCombos[i].ge_ratio
        }
    }
}
export default filterNonOptimalBoostCombos;