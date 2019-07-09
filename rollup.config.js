import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";
import json from "rollup-plugin-json";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/index.js",
    output: {
      name: "onyx",
      file: pkg.browser,
      compact: true,
      format: "umd"
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      terser(),
      json({
        preferConst: true,
        indent: "  ",
        compact: true,
        namedExports: false
      })
    ]
  },
  {
    input: "src/index.js",
    output: {
      name: "onyx",
      file: pkg.dev,
      compact: true,
      format: "umd"
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      json({
        preferConst: true,
        indent: "  ",
        compact: true,
        namedExports: false
      })
    ]
  },
  {
    input: "src/index.js",
    external: ["ms"],
    output: [
      { file: pkg.cjs, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      json({
        preferConst: true,
        indent: "  ",
        compact: true,
        namedExports: true
      })
    ]
  }
];
