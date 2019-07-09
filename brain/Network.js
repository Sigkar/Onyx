import brain, {recurrent} from "brain.js";
import fs from "fs";
import { isNullOrUndefined } from "util";

const Onyx = new brain.recurrent.GRU();

const hexSeed = fs.readFileSync("src/seedData/hexcolors/hex.json");
const jsonHexSeed = JSON.parse(hexSeed);

console.log("==Training Onyx")

let j = 0;
outer: for(let [key, val] of Object.entries(jsonHexSeed.data)){
   console.log("Prep training for new color suite:");
   inner: for(let [innerKey, innerVal] of Object.entries(val)){
      if(isNullOrUndefined(innerVal)){
         continue inner;
      }
      if(isNullOrUndefined(innerVal.terms)){
         continue inner;
      }
      for(let i = 0; i<innerVal.terms.length; i++){
         console.log("Train suite:");
         console.log(`${innerVal.terms[i]} => ${innerVal.hexValue}`);
         // console.log(`${innerVal.terms[i]} => ${innerVal.rgb.r} | ${innerVal.rgb.g} | ${innerVal.rgb.b}`);
         Onyx.train([
            {input:innerVal.terms[i].toString(), output: innerVal.hexValue.toString()},
         ])
      }
   }
}


console.log(Onyx.run("blue"));