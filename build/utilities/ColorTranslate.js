"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.valueToHex = exports.rgbToHex = exports.hexToRgb = void 0;

/**
 * @author Duncan Pierce
 * @param {string} hex
 */
const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};
/**
 * @author Duncan Pierce
 * @param {array} rgb
 */


exports.hexToRgb = hexToRgb;

const rgbToHex = rgb => {
  if (rgb.length !== 3) {
    return false;
  }

  let results = [];
  rgb.forEach(value => {
    if (value > 255 || value < 0) {
      return false;
    }

    results.push(valueToHex(value));
  });
  results = results.join("").toUpperCase();
  return results;
};
/**
 * @author Duncan Pierce
 * @param {int} rgbValue
 */


exports.rgbToHex = rgbToHex;

const valueToHex = rgbValue => {
  const hex = Math.round(rgbValue).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

exports.valueToHex = valueToHex;