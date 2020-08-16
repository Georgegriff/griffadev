import merge from "deepmerge";
import { createBasicConfig } from "@open-wc/building-rollup";
import outputManifest from "rollup-plugin-output-manifest";

const entrypoints = {
  critical: "src/components/critical.js",
  other: "src/components/b.js",
};

const baseConfig = createBasicConfig({
  outputDir: "dist"
});

export default merge(baseConfig, {
  input: entrypoints,
  plugins: [outputManifest({
      // ../ to go outside of dist and into include
      fileName: '../src/_includes/manifest.json'
  })]
});
