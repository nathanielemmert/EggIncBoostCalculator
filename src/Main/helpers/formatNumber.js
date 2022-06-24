import roundFloat from "./roundFloat";

const pows = {
    0:" ",
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





function formatNumber(number,decimalDigits,precision){//TODO: should allow display of
    if(typeof number ==="string")number = Number(number)
    //console.log(number.toExponential())
    if(!isFinite(number))return number
    const f =  number.toExponential()
    let [num,pow] = f.split("e").map(n => Number.parseFloat(n))
    num/=10**Math.max(0, -pow);pow-=Math.min(0, pow)
    for (let i = 0; i < 3 && pow%3!==0 && pow>0; i++) {//TODO: if numbers base is greater than uV, display in terms of uV like saladfork does for Td
        num*=10;
        pow-=1;
    }
    if(pow===3){num*=1000;pow-=3}
    if(precision!=null)return parseFloat(num.toPrecision(precision)).toLocaleString('en-US', {
        minimumFractionDigits: precision-num.toFixed().length,
        maximumFractionDigits: precision
    })+pows[pow];
    if(decimalDigits===undefined)return roundFloat(num)+pows[pow]
    return (Math.round((num * 10**decimalDigits)) / 10**decimalDigits).toFixed(decimalDigits) +pows[pow]//TODO: originally round was floor


}
export default formatNumber;