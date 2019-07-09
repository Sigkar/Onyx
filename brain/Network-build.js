"use strict";

var _brain = _interopRequireWildcard(require("brain.js"));

var _fs = _interopRequireDefault(require("fs"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Onyx = new _brain.default.recurrent.GRU();

const hexSeed = _fs.default.readFileSync("src/seedData/hexcolors/hex.json");

const jsonHexSeed = JSON.parse(hexSeed);
console.log("==Training Onyx");
let j = 0;

outer: for (let [key, val] of Object.entries(jsonHexSeed.data)) {
  console.log("Prep training for new color suite:");

  inner: for (let [innerKey, innerVal] of Object.entries(val)) {
    if ((0, _util.isNullOrUndefined)(innerVal)) {
      continue inner;
    }

    if ((0, _util.isNullOrUndefined)(innerVal.terms)) {
      continue inner;
    }

    for (let i = 0; i < innerVal.terms.length; i++) {
      console.log("Train suite:");
      console.log(`${innerVal.terms[i]} => ${innerVal.hexValue}`); // console.log(`${innerVal.terms[i]} => ${innerVal.rgb.r} | ${innerVal.rgb.g} | ${innerVal.rgb.b}`);

      Onyx.train([{
        input: innerVal.terms[i].toString(),
        output: innerVal.hexValue.toString()
      }]);
    }

    break inner;
  }

  break outer;
}

console.log(Onyx.run("blue"));
