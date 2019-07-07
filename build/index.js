"use strict";

var _OnyxScrape = require("./scraping/OnyxScrape");

var _ColorTranslate = require("./utilities/ColorTranslate");

module.exports = {
  OnyxScrape: _OnyxScrape.OnyxScrape,
  rgbToHex: _ColorTranslate.rgbToHex,
  hexToRgb: _ColorTranslate.hexToRgb,
  valueToHex: _ColorTranslate.valueToHex
};