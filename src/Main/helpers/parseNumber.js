var bigDecimal = require('js-big-decimal');
const pows = {
    3:"K",
    6:"M",
    9:"B",
    12:"T",
    15:"q",
    18:"Q",
    21:"s",
    24:"S",
    27:"o",
    30:"N",
    33:"d",
    36:"U",
    39:"D",
    42:"Td",
    45:"qD",
    48:"Qd",
    51:"sd",
    54:"Sd",
    57:"Od",
    60:"Nd",
    63:"V",
    66:"uV"
}
/*
function parseNumber(str){//TODO: improve performance
    if (typeof str != "string")return str;
    let r = str;
    Object.entries(pows).forEach(([exp, s])=>r=r.replace(s, "E"+exp))
    //console.log(r)
    let splitR = r.split("E").map(n => {
        let f =Number.parseFloat(n)
        // eslint-disable-next-line no-undef
        return (f<=Number.MAX_SAFE_INTEGER) ? f : BigInt(n);
    })
    if(splitR.length>2)return Number.NaN//return NaN for improper formatting
    if(splitR.length===1)return splitR[0]//

    let [num,pow] = splitR;
    while(num!==Math.trunc(num)&&pow>0){
        num*=10;
        pow-=1;
    }
    //if(pow<=0)return num//return num as float if it has any fractional component

    //console.log(num,pow)
    // eslint-disable-next-line no-undef
    return BigInt(num) * 10n**BigInt(pow);
}
*/
function parseNumber(str){//TODO: improve performance
    if (typeof str != "string")return str;
    if(str==='')return str;//TODO: hack for settingsform, to always make new input not equal to blank
    let r = str;
    Object.entries(pows).forEach(([exp, s])=>r=r.replaceAll(s, "E"+exp))
    //console.log(r)
    let splitR = r.split("E").map(n => Number.parseFloat(n))
    if(splitR.length>2)return Number.NaN//return NaN for improper formatting
    if(splitR.length===1)return splitR[0]


    let [num,pow] = splitR;
    while(num!==Math.trunc(num)&&pow>0){
        num*=10;
        pow-=1;
    }
    //if(pow<=0)return num//return num as float if it has any fractional component

    return num * 10**pow;
}

export default parseNumber;