console.log('hi! chabeom chul');
console.log('hi! chabeom chul33');

function setName(obj) {
    obj.name = 'chabeomchul';
    obj = new Object();
    obj.name = 'change name';
}

var person = new Object();
setName(person);
console.log(person.name);


// array test

var arrTest = ['asdf','xdfd','ewes','dxws','xxxw','ffff'];
arrTest.forEach((x, i) => console.log(i + "." + x));

console.log('add source');
console.log('git_test chagned!!');
console.log('git_test chagned2222222222!!');
console.log('js_test chagned!!');
