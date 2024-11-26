const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const typescript = require('@rollup/plugin-typescript');
const babel = require('@rollup/plugin-babel').babel; 
const nodePolyfills = require('rollup-plugin-node-polyfills');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const sass = require('sass');
const wasm = require('@rollup/plugin-wasm');
const dts = require('rollup-plugin-dts').default;
const image = require('@rollup/plugin-image');
const json = require('@rollup/plugin-json');
const { terser } = require('rollup-plugin-terser');
const ignore = require('rollup-plugin-ignore');
const tailwindcss = require('tailwindcss');
const pkg = require('./package.json');

const removeScssImports = () => ({
  name: 'remove-scss-imports',
  transform(code, id) {
    if (id.endsWith('.ts') || id.endsWith('.tsx')) {
      const transformedCode = code.replace(/import\s+.*?['"][^'"]+\.scss['"];?/g, '');
      return {
        code: transformedCode,
        map: null,
      };
    }
    return null;
  },
});

const externalPackages = [
  'react',
  'react-dom',
  'react-router-dom',
];

const commonPlugins = [
  peerDepsExternal(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: false,
    noEmitOnError: false,
    exclude: ['**/*.scss', '**/*.css'],
  }),
  babel({
    babelHelpers: 'bundled',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    include: ['src/**/*'],
  }),
  nodePolyfills(),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    browser: true,
    preferBuiltins: false,
  }),
  commonjs({
    include: /node_modules/,
    exclude: ['**/*.scss', '**/*.css'],
  }),
  postcss({
    extract: 'wallet.css',
    minimize: true,
    sourceMap: true,
    extensions: ['.css', '.scss'],
    use: [
      [
        'sass',
        {
          includePaths: ['./src', './src/styles'],
        },
      ],
    ],
    plugins: [tailwindcss(), autoprefixer()],
  }),
  terser(),
  json(),
  wasm(),
  image(),
  ignore(['**/*.scss', '**/*.css']),
];

module.exports = [
  // CommonJS Build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs', // Changed from 'file' to 'dir'
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: commonPlugins,
    external: [
      ...externalPackages,
      '@polkadot-api/descriptors',
      ...Object.keys(pkg.peerDependencies || {}),
      /^@polkadot\//,
      /^@substrate\//,
      /^react-hot-toast$/,
      /\.rollupUtils.js$/u,
    ],
  },
  // ES Module Build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm', // Changed from 'file' to 'dir'
      format: 'esm',
      sourcemap: true,
    },
    plugins: commonPlugins,
    external: [
      ...externalPackages,
      '@polkadot-api/descriptors',
      ...Object.keys(pkg.peerDependencies || {}),
      /^@polkadot\//,
      /^@substrate\//,
      /^react-hot-toast$/,
      /\.rollupUtils.js$/u,
    ],
  },
  // Type Declarations Build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist', // Changed from 'file' to 'dir'
      format: 'es',
    },
    plugins: [
      removeScssImports(),
      dts({
        respectExclude: true,
        exclude: ['src/variables.scss', 'src/styles', '**/*.scss', '**/*.css'],
      }),
      ignore(['**/*.scss', '**/*.css']),
    ],
    external: [
      ...externalPackages,
      '@polkadot-api/descriptors',
      ...Object.keys(pkg.peerDependencies || {}),
      /^@polkadot\//,
      /^@substrate\//,
      /^react-hot-toast$/,
      /\.css$/u,
      /\.scss$/u,
      /\.rollupUtils.js$/u,
    ],
  },
];
