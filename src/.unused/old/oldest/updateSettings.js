

function updateSettings(settings){
    settings.hatcheryRate= 4*(settings["IHC"] ? 3 : 1)*settings["IHR"]
    settings.hatcheryRate*=
    ((100+settings.Chalice+(settings.LStoneMultiplier*settings.LStones))/100)*
    ((100+settings.Monocle)/100)*
    ((100+(settings.DStoneMultiplier*settings.DStones))/100)
}
export default  updateSettings;