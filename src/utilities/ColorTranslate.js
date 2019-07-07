/**
 * @author Duncan Pierce
 * @param {string} hex 
 */
export const hexToRgb = (hex) => {
   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   return result ? {
     r: parseInt(result[1], 16),
     g: parseInt(result[2], 16),
     b: parseInt(result[3], 16)
   } : null;
 }
/**
 * @author Duncan Pierce
 * @param {array} rgb 
 */
export const rgbToHex = (rgb) => {
   let results = [];
   rgb.forEach( (value) => {
      results.push(valueToHex(value))
   })
   return results;
}

/**
 * @author Duncan Pierce
 * @param {int} rgbValue 
 */
export const valueToHex = (rgbValue) => {
   const hex = Math.round(rgbValue).toString(16);
   return hex.length == 1 ? "0" + hex : hex;
}
 