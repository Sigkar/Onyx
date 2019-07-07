const hexToRgb = require("./ColorTranslate").hexToRgb;
const rgbToHex = require("./ColorTranslate").rgbToHex;
const valueTohex = require("./ColorTranslate").valueToHex;

test("Hex to RGB should run", () => {
   console.log(hexToRgb("#F0F8FF"));
   expect(hexToRgb("#FFFFFF")).toBeTruthy()
});

test("Hex should return RGB", () => {
   expect(hexToRgb("#BDB76B")).toStrictEqual({r: 189, g: 183, b: 107});
});

test("RGBtoHex should run", () => {
   expect(rgbToHex([189, 183, 107])).toBeTruthy();
});


test("RGBtoHex should run", () => {
   console.log(rgbToHex([189, 183, 107]));
   expect(rgbToHex([189, 183, 107])).toBeTruthy();
});