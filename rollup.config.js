import merge from 'deepmerge';
import { createMpaConfig } from '@open-wc/building-rollup';
import outputManifest from 'rollup-plugin-output-manifest';

// use createBasicConfig to do regular JS to JS bundling
// import { createBasicConfig } from '@open-wc/building-rollup';

const entrypoints = {
  critical: 'out-tsc/src/critical.js',
  foo: 'out-tsc/src/foo.js'
};

const baseConfig = createMpaConfig({
  // use the outputdir option to modify where files are output
  outputDir: 'dist',
  html: {
    name: "index.ignorethiseleventy"
  },
  // development mode creates a non-minified build for debugging or development
  // eslint-disable-next-line no-undef
  developmentMode: process.env.ROLLUP_WATCH === 'true',

  // set to true to inject the service worker registration into your index.html
  injectServiceWorker: false,
});

export default merge(baseConfig, {
  // if you use createSpaConfig, you can use your index.html as entrypoint,
  // any <script type="module"> inside will be bundled by rollup
  input: entrypoints,
  plugins: [
    outputManifest()
  ],

  // alternatively, you can use your JS as entrypoint for rollup and
  // optionally set a HTML template manually
  // input: './app.js',
});
