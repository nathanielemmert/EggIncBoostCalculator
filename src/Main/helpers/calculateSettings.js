

// function calculateSettings(settings){
//     settings.hatcheryRate= 4*(settings["IHC"] ? 3 : 1)*settings["IHR"]
//     settings.hatcheryRate*=
//     ((100+settings.Chalice+(settings.LStoneMultiplier*settings.LStones))/100)*
//     ((100+settings.Monocle)/100)*
//     ((100+(settings.DStoneMultiplier*settings.DStones))/100)
// }

function calculateSettings(newSettings, dependencies, formState) {
    //console.log(newSettings)
    if(dependencies==null)return
    for (let d of dependencies) {
        newSettings.calculated={...formState.calculated}; newSettings.calculated[d]={...formState.calculated[d]};
        newSettings.calculated[d].updateFunction(newSettings)
    }

}

function roundFloat(f){
    return parseFloat(f.toFixed(12)).toPrecision()
}

function calculateIHR(newSettings){//TODO: Internal Hatchery Calm
    let {chalice} = newSettings.artifacts.getValues();
    let {internalHatcheryRate} = newSettings.calculated.getValues();
    newSettings.calculated.internalHatcheryRate.value=roundFloat(internalHatcheryRate*(100+chalice)/100)
}

function calculateEggLayingRate(newSettings){
    let {metronome, tachyonDeflector} = newSettings.artifacts.getValues();
    let {epicComfyNests, comfyNests, henHouseAC, improvedGenetics, timeCompression, timelineDiversion, relativityOptimization} = newSettings.research.getValues();
    newSettings.calculated.eggLayingRate.value = roundFloat(
        2
        *(metronome+100)/100
        *(tachyonDeflector+100)/100
        *(epicComfyNests+100)/100
        *(comfyNests+100)/100
        *(henHouseAC+100)/100
        *(improvedGenetics+100)/100
        *(timeCompression+100)/100
        *(timelineDiversion+100)/100
        *(relativityOptimization+100)/100)
    //console.log(newSettings.calculated.eggLayingRate)

}





export {calculateSettings, calculateIHR, calculateEggLayingRate};