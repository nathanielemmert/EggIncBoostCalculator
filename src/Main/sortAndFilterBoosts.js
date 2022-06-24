

function sortAndFilterBoosts(boostCombos, settings, showAll){

        //Sort the list by ge cost then time finished
        boostCombos.sort((a, b) => {
            if(a.ge_cost === b.ge_cost)
                return a.stats.time_finished > b.stats.time_finished ? 1 : -1
            return a.ge_cost>b.ge_cost ? 1 : -1
        })

        if(showAll)return




        //Remove Objectively bad Boost combos (more ge cost, longer time to finish)
        for( let i = 0; i < boostCombos.length-1; i++){
            let {ge_cost:GE1}=boostCombos[i]; let { time_finished:T1, eggs_layed:E1} = boostCombos[i].stats;
            let {ge_cost:GE2}=boostCombos[i+1]; let { time_finished:T2, eggs_layed:E2} = boostCombos[i+1].stats;

            if( (GE1<GE2 && T1<=T2)||
                (GE1===GE2 && T1<T2)  ){
                boostCombos.splice(i+1, 1);//TODO: making a copy of the array each time may be decreasing performance
                i-= (i>=2)?2:1;
            }
        }


        // //Remove combos with an unoptimal (time finished early) per GE spent ratio
        // let CONTRACTEND = settings.contractSettings.timeRemaining.value
        // let max_ratio = 0;
        // for( let i = 0; i < boostCombos.length; i++){
        //     let {ge_cost:GE1}=boostCombos[i]; let { time_finished:T1} = boostCombos[i].stats;
        //
        //     let time_ratio1 = (CONTRACTEND-T1)/GE1
        //
        //     if( time_ratio1 <= max_ratio  ){
        //         boostCombos.splice(i, 1);//TODO: making a copy of the array each time may be decreasing performance
        //         i--
        //     }
        //     else{
        //         max_ratio=time_ratio1
        //     }
        // }




        /*//Sort by time finished per ge spent
        boostCombos.sort((a, b) => {
            console.warn((a.stats.time_finished), (b.stats.time_finished))
            console.warn((a.stats.time_finished)/a.ge_cost , (b.stats.time_finished)/b.ge_cost)
            console.warn((a.stats.time_finished)/a.ge_cost > (b.stats.time_finished)/b.ge_cost)
            return (CONTRACTEND-a.stats.time_finished)/a.ge_cost > (CONTRACTEND-b.stats.time_finished)/b.ge_cost ? 1 : -1
        })*/
}
export default sortAndFilterBoosts;