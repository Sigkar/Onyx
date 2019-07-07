const hexToRgb = require("./ColorTranslate").hexToRgb;
const rgbToHex = require("./ColorTranslate").rgbToHex;
const valueTohex = require("./ColorTranslate").valueToHex;

test("Hex to RGB should run", () => {
   expect(hexToRgb("#FFFFFF")).toBeTruthy()
});

test("Hex should return RGB", () => {
   expect(hexToRgb("#BDB76B")).toStrictEqual({r: 189, g: 183, b: 107});
})