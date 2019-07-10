import brain, {recurrent} from "brain.js";
import fs from "fs";
import { isNullOrUndefined } from "util";

const savedNetwork = fs.readFileSync("brain/savedNetwork.json");

const _parseNetwork = JSON.parse(_parseNetwork);
console.log(_parseNetwork);