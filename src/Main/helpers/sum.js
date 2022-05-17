function sum(array){
    return array.reduce((partialSum, a) => partialSum + a, 0);
}
export default sum;

