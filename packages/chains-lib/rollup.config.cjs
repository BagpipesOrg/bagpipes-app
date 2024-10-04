const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const typescript = require('@rollup/plugin-typescript');
const nodePolyfills = require('rollup-plugin-node-polyfills');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const wasm = require('@rollup/plugin-wasm');
// const inspect = require('@rollup/plugin-inspect');
const dts = require('rollup-plugin-dts').default;   

const pkg = require('./package.json');


const commonPlugins = [
  peerDepsExternal(),
  typescript({
    tsconfig: './tsconfig.json',
    noEmitOnError: false,
    declarationDir: "./dist/types",   

  }),  nodePolyfills(),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }),
  commonjs({
    include: /node_modules/,
  }),
  postcss({
    extract: true,
    minimize: true,
    sourceMap: true,
  }),
  wasm(),
  // inspect({ /* options */ }),
];

module.exports = [
  // CommonJS Build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',      
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: commonPlugins,
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
      /^@polkadot\//, // exclude all @polkadot/* packages
      /^@substrate\//,
      /^smoldot\//,
      /^react-hot-toast$/,
      'src/lite-client/WellKnown.js'

    ],
  },
  // ES Module Build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',      
      format: 'esm',
      sourcemap: true,
    },
    plugins: commonPlugins,
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
      /^@polkadot\//, // exclude all @polkadot/* packages
      /^@substrate\//,
      /^smoldot\//,
      /^react-hot-toast$/,
      'src/lite-client/WellKnown.js'

    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
