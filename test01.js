const arr = [10, 12, 15, 21, 1,2,3,4,5,55,5,55,5,55,5,5,5,55,5,5,];
for (let i = 0; i < arr.length; i++) {
  // ES6 의 let 은 함수가 호출 될 때 마다 인덱스 i 값이 바인딩 되는 새로운 바인딩 기법을 사용합니다.
  // 더 자세한 내용은 다음 링크에서 확인하세요.
  // http://exploringjs.com/es6/ch_variables.html#sec_let-const-loop-heads
  setTimeout(function() {
    console.log('The index of this number is: ' + i);
  }, 3000);
}


let strEscape = "key1=val1;name=차범철,no=7373 737";
let strUnEscape = "";

console.log("strEscape:" + escape(strEscape));
console.log("strUnEscape:" + unescape(strEscape));


const constStr = "9";
let strSwitch = ""
switch (constStr) {
//  default:
      //strSwitch += ":default";
      //break;
  case "1":
      strSwitch += "switch:1";
      break;
  case "2":
  case "3":
      strSwitch += "switch:3";
      break;
  case "4":
  case "5":
      strSwitch += "switch:5";
      break;
  case "6":
  case "7":
      strSwitch += "switch:7";
      break;

}

console.log("##switch ==> " + strSwitch);
console.log("+++++++++++++++++++++++++++++++++");
const a = [1,2,3,4,5];
const b = [];
a.forEach(number => b.push(number * 2));
console.log("a : " + a);
console.log("b : " + b);
const c = [1,2,3,4,5];
const d = a.map(number => number * 2);
console.log("d : " + d);
