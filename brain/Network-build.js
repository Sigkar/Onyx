"use strict";

var _brain = _interopRequireWildcard(require("brain.js"));

var _fs = _interopRequireDefault(require("fs"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Onyx = new _brain.default.recurrent.GRU();

const hexSeed = _fs.default.readFileSync("src/seedData/hexcolors/hex.json");

const jsonHexSeed = JSON.parse(hexSeed);

const PO = (Onyx, stringToRun) => {
  console.log(`Running onyx under ${stringToRun}`);
  console.log(Onyx.run(stringToRun));
  console.log("\n");
};

let SaveState, StringifyState;
const CurrentDate = new Date();
const start = Date.now();
let suiteTotal = 1;
let startTrain;
const fileName = `savedNetwork_${Date.now()}.json`;
console.log(`\n\n\n\n\n\n\n\n\n\n\n\nStarting onyx at ${CurrentDate.toString()}`);
let trainingContent = [];
console.log("==Training Onyx");

for (let [key, val] of Object.entries(jsonHexSeed.data)) {
  console.log("Prep training for new color suite:");

  inner: for (let [innerKey, innerVal] of Object.entries(val)) {
    if ((0, _util.isNullOrUndefined)(innerVal)) {
      continue inner;
    }

    if ((0, _util.isNullOrUndefined)(innerVal.terms)) {
      continue inner;
    }

    for (let i = 0; i < innerVal.terms.length; i++) {
      //console.log(`\n\n>>>Training suite #${suiteTotal}`);
      startTrain = Date.now(); //console.log(`${innerVal.terms[i]} => ${innerVal.hexValue}`);

      trainingContent.push({
        input: innerVal.terms[i].toString().toUpperCase(),
        output: innerVal.hexValue.toString().toUpperCase()
      });
      suiteTotal++;
    }
  }
}

console.log(trainingContent);
Onyx.train(trainingContent, {
  logPeriod: 10
});
console.log(`Training complete\n\n${Date.now() - start}ms to run ${suiteTotal} training suites`);
SaveState = Onyx;
SaveState.toJSON();
StringifyState = JSON.stringify(Onyx);

_fs.default.writeFile(`brain/${fileName}`, JSON.stringify({
  data: {
    SaveState
  }
}), err => {
  if (err) {
    console.log("Error writing out file");
    throw err;
  }
});

_fs.default.writeFile(`brain/stringify_${fileName}`, JSON.stringify({
  data: {
    StringifyState
  }
}), err => {
  if (err) {
    console.log("Error writing out file");
    throw err;
  }
});

PO(Onyx, "blue");
PO(Onyx, "green");
PO(Onyx, "red");
PO(Onyx, "yellow");
PO(Onyx, "corn");
PO(Onyx, "violet");
PO(Onyx, "flower");
PO(Onyx, "indigo");
PO(Onyx, "table");
PO(Onyx, "iron");
PO(Onyx, "cold");
PO(Onyx, "warm");
PO(Onyx, "winter");
PO(Onyx, "green");
PO(Onyx, "orange");
