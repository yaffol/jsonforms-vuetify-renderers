import vue from "rollup-plugin-vue";
import alias from "@rollup/plugin-alias";
import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript2";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

import packageJson from "./package.json";

const buildFormats = [
  {
    input: "src/index.ts",
    output: {
      file: packageJson.main,
      format: "commonjs",
      exports: "named",
      sourcemap: true,
    },
    external: [
      "vue",
      "@vue/composition-api",
      "@jsonforms/core",
      "@jsonforms/vue2",
      "@mdi/font",
      "vuetify",
      "lodash/maxBy",
      "lodash/merge",
      "lodash/mergeWith",
      "lodash/cloneDeep",
    ],
    plugins: [
      peerDepsExternal({
        packageJsonPath: "./package.json",
      }),
      typescript({
        check: false, // types are incompatible with Vue3
        module: "commonjs",
        tsconfig: "tsconfig.json",
        tsconfigOverride: {
          include: null,
          exclude: ["node_modules", "tests", "dev"],
        },
      }),
      alias({
        resolve: [".js", ".jsx", ".ts", ".tsx", ".vue"],
      }),
      vue({
        css: false,
        template: {
          isProduction: true,
        },
      }),
      babel({
        exclude: "node_modules/**",
        extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
      }),
    ],
  },
];

export default buildFormats;
