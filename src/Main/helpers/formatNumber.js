
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





function formatNumber(number,decimalDigits){
    //console.log(number)
    const f =  number.toLocaleString("en-US",{notation:"scientific"})
    let [num,pow] = f.split("E").map(n => Number.parseFloat(n))
    for (let i = 0; i < 3 && pow%3!==0; i++) {
        num*=10;
        pow-=1;
    }
    return (Math.floor((num * 10**decimalDigits)) / 10**decimalDigits).toFixed(decimalDigits) +pows[pow]


}
export default formatNumber;