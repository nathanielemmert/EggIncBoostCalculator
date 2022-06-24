

function formatMinutesAsDHM(mins){
    if(!isFinite(mins))return ''+mins
    let d = Math.floor(mins/(24*60))
    let dR=mins%(24*60)
    let h = Math.floor(dR/60)
    let hR = dR%60
    let m = Math.round(hR)
    return d+"d\xa0"+h+"h\xa0"+m+"m";

}
export default formatMinutesAsDHM;