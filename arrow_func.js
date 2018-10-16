// Arrow functions

var materials = [
  'Hydrogen',
  '12345556',
  '2222',
  '222'
];

const mat1 = materials.map(function(materials) {
  return materials.length;
});

const mat2 = materials.map((materials) => {
  return materials.length + 1;
});

const mat3 = materials.map((materials) => materials.length + 3);

const mat4 = materials.map(({length}) => length);

console.log("mat1 : " + mat1);
console.log("mat2 : " + mat2);
console.log("mat3 : " + mat3);
console.log("mat4 : " + typeof mat4);


setTimeout( () => {
  console.log('First timeout!!');
  setTimeout( () => {
    console.log('Second timeout!!!');
  }, 1000);
}, 1000);
