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
  include: ['react', 'react-dom', 'react-router-dom', 'chains-lib', 'client', 'wallet'],
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
    dedupe: ['react', 'react-dom', 'react-router-dom'],
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
      '@polkadot-api/descriptors': path.resolve(__dirname, 'packages/chains-lib/.papi/descriptors/dist'),
      // '@polkadot-api/descriptors': path.resolve(__dirname, 'packages/chains-lib/node_modules/@polkadot-api/descriptors/dist/index.mjs'),
      "@": path.resolve(__dirname, "packages/client/src"),

      'chains-lib': path.resolve(__dirname, 'packages/chains-lib/dist/esm'),
      'client': path.resolve(__dirname, 'packages/client/dist/esm'),
      'wallet': path.resolve(__dirname, 'packages/wallet/dist/esm'),
      'wallet-styles': path.resolve(__dirname, 'packages/wallet/dist/esm/wallet.css'),
      // 'chains-lib': path.resolve(__dirname, 'packages/chains-lib/src'),
      // 'client': path.resolve(__dirname, 'packages/client/src'),
      // 'wallet': path.resolve(__dirname, 'packages/wallet/src'),
     

    },
  },
  build: {
    target: 'esnext'
  },
})
