import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from 'vite-plugin-wasm';
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
	wasm(),
	  react(),
    topLevelAwait({
      promiseExportName: "__tla",
      promiseImportName: i => `__tla_${i}`
    })  
  ],
optimizeDeps: {
  // include: ['wasm-crypto'],
  include: ['chains-lib', 'client', 'wallet'],
  esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
          global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
          NodeGlobalsPolyfillPlugin({
              buffer: true
          })
      ]
    },
    },    
   

  allowImportingTsExtensions: true,
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      styl: {
        define: {
        },
      },
      scss: {
        api: 'modern-compiler', // or "modern", "legacy"
        importers: [
          // ...
        ],
      },
    },
  },
 
  resolve: {
    alias: {
      '@polkadot-api/descriptors': path.resolve(__dirname, 'node_modules/@polkadot-api/descriptors/dist/index.mjs'),
      '@polkadot-api/descriptors': path.resolve(__dirname, 'packages/chains-lib/node_modules/@polkadot-api/descriptors/dist/index.mjs'),

      'chains-lib': path.resolve(__dirname, 'packages/chains-lib/dist/esm'),
      'client': path.resolve(__dirname, 'packages/client/dist/esm'),
      'wallet': path.resolve(__dirname, 'packages/wallet/dist/esm'),
      
    },
  },
  build: {
    target: 'esnext'
  },
})
