const array = [1,2,3,4];
const sameArray = array;
sameArray.push(5);

console.log(array !== sameArray); //false
console.log('array:' + array);   // 1,2,3,4,5
console.log('sameArray:' + sameArray); // 1,2,3,4,5


const diffArray = [...array, 6];  // or = array.concat(6)
console.log(array === diffArray); //true
console.log('diffArray:' + diffArray); //
console.log('addline!!');