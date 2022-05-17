function Boost(name, multiplier, duration, ge_cost, isPrism, img_data, token_cost){
    return {name: name, multiplier: multiplier, duration: duration,ge_cost: ge_cost, isPrism:isPrism, isBeacon: !isPrism, img_data : img_data, token_cost: token_cost}
}


function getBoostsArray(){
    const boosts = {
        "A": Boost(          "Tachyon Prism",  10,  10,    50, true, 0, 1),
        "B": Boost(    "Large Tachyon Prism",  10, 240,   500, true, 1, 3),
        "C": Boost( "Powerful Tachyon Prism", 100,  10,  1000, true, 2, 3),
        //"c": Boost( "Powerful Tachyon Prism", 100,  30,  3000, true, 2),

        "D": Boost(     "Epic Tachyon Prism", 100, 120,  5000, true, 3, 4),
        "E": Boost("Legendary Tachyon Prism",1000,  10, 12000, true, 4, 6),
        "F": Boost(  "Supreme Tachyon Prism",1000,  60, 25000, true, 5, 12),

        "W": Boost("Boost Beacon",            2, 30,  1000, false, 6, 5),
        "X": Boost("Epic Boost Beacon",      10, 10,  8000, false, 7, 8),
        "Y": Boost("Large Boost Beacon",      5, 60, 15000, false, 8, 10),
        "Z": Boost("Legendary Boost Beacon", 50, 10, 50000, false, 9, 15)}
    return boosts

}

export default getBoostsArray;