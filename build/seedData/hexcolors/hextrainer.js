"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetColors = void 0;

var _OnyxScrape = _interopRequireDefault(require("../../scraping/OnyxScrape"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GetColors = async () => {
  const OnyxScraper = new _OnyxScrape.default("https://www.w3schools.com/tags/ref_colornames.asp", "td", "/colors/color_tryit");
  const data = await OnyxScraper.sendRequest().catch(error => {
    console.error(error);
  });
  let hexValues = {};
  let currentIndex = 0;
  data.forEach(async (content, index) => {
    if (!hexValues[currentIndex.toString()]) {
      hexValues[currentIndex.toString()] = {};
    }

    if (content.substring(0, 1) === "#") {
      hexValues[currentIndex.toString()]["hexValue"] = content;
      hexValues[currentIndex.toString()]["rgb"] = Onyx.hexToRgb(content.toString());
    } else {
      hexValues[currentIndex.toString()]["colorString"] = content.replace("ShadesMix", "");
      hexValues[currentIndex.toString()]["terms"] = content.split(/([A-Z][a-z]+|[0-9]+)/g).filter(innerContent => {
        if (innerContent !== "" && typeof innerContent !== "undefined" && innerContent !== "Shades" && innerContent !== "Mix") {
          return innerContent;
        }
      });
    }

    if ((index + 1) % 2 === 0) {
      currentIndex++;
    }
  });
  fs.writeFile("./src/seedData/hexcolors/hex.json", JSON.stringify({
    data: {
      hexValues
    }
  }), err => {
    if (err) {
      console.log("Error writing out file");
      throw err;
    }
  });
};

exports.GetColors = GetColors;