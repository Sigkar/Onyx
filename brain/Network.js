import brain, { recurrent } from "brain.js";
import fs from "fs";
import { isNullOrUndefined } from "util";

const Onyx = new brain.recurrent.GRU();

const hexSeed = fs.readFileSync("src/seedData/hexcolors/hex.json");
const jsonHexSeed = JSON.parse(hexSeed);

const PO = (Onyx, stringToRun) => {
   console.log(`Running onyx under ${stringToRun}`);
   console.log(Onyx.run(stringToRun))
   console.log("\n")
}


let SaveState, StringifyState;
const CurrentDate = new Date();
const start = Date.now();
let suiteTotal = 1;
let startTrain;
const fileName = `savedNetwork_${Date.now()}.json`

console.log(`\n\n\n\n\n\n\n\n\n\n\n\nStarting onyx at ${CurrentDate.toString()}`)
let trainingContent = [];
console.log("==Training Onyx")
for (let [key, val] of Object.entries(jsonHexSeed.data)) {
   console.log("Prep training for new color suite:");
   inner: for (let [innerKey, innerVal] of Object.entries(val)) {
      if (isNullOrUndefined(innerVal)) {
         continue inner;
      }
      if (isNullOrUndefined(innerVal.terms)) {
         continue inner;
      }
      for (let i = 0; i < innerVal.terms.length; i++) {

         //console.log(`\n\n>>>Training suite #${suiteTotal}`);
         startTrain = Date.now();
         //console.log(`${innerVal.terms[i]} => ${innerVal.hexValue}`);
         trainingContent.push({ input: innerVal.terms[i].toString().toUpperCase(), output: innerVal.hexValue.toString().toUpperCase() })
         suiteTotal++;

      }
   }
}
console.log(trainingContent);
Onyx.train(trainingContent, {logPeriod:10})
console.log(`Training complete\n\n${Date.now() - start}ms to run ${suiteTotal} training suites`)
SaveState = Onyx;
SaveState.toJSON()
StringifyState = JSON.stringify(Onyx);
fs.writeFile(
   `brain/${fileName}`,
   JSON.stringify({ data: { SaveState } }),
   err => {
      if (err) {
         console.log("Error writing out file");
         throw err;
      }
   }
);
fs.writeFile(
   `brain/stringify_${fileName}`,
   JSON.stringify({ data: { StringifyState } }),
   err => {
      if (err) {
         console.log("Error writing out file");
         throw err;
      }
   }
);

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

