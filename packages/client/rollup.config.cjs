const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const typescript = require('@rollup/plugin-typescript');
const nodePolyfills = require('rollup-plugin-node-polyfills');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const wasm = require('@rollup/plugin-wasm');
const dts = require('rollup-plugin-dts').default;

const pkg = require('./package.json');

const commonPlugins = [
  peerDepsExternal(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: false,
    noEmitOnError: false,
  }),
  nodePolyfills(),
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
];

module.exports = [
  // CommonJS Build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: commonPlugins,
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
      /^@polkadot\//,
      /^@substrate\//,
      /^smoldot\//,
      /^react-hot-toast$/,
    ],
  },
  // ES Module Build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: commonPlugins,
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
      /^@polkadot\//,
      /^@substrate\//,
      /^smoldot\//,
      /^react-hot-toast$/,
    ],
  },
  // Type Declarations Build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
