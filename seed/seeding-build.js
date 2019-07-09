"use strict";

var _index = _interopRequireDefault(require("../build/index"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GetColors = async () => {
  const OnyxScraper = new _index.default.OnyxScrape("https://www.w3schools.com/tags/ref_colornames.asp", "td", "/colors/color_tryit");
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
      hexValues[currentIndex.toString()]["rgb"] = _index.default.hexToRgb(content.toString());
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

  _fs.default.writeFile("./src/seedData/hexcolors/hex.json", JSON.stringify({
    data: {
      hexValues
    }
  }), err => {
    if (err) {
      console.log("Error writing out file");
      throw err;
    }
  });
}; // Run Suites


GetColors();
