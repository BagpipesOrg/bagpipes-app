import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import topLevelAwait from "vite-plugin-top-level-await";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    topLevelAwait({
      promiseExportName: "__tla",
      promiseImportName: i => `__tla_${i}`
    })  
  ],
  optimizeDeps: {
    esbuildOptions: {
        define: {
            global: "globalThis",
        },
        plugins: [
            GlobalPolyFill({
                process: true,
                buffer: true,
            }),
        ],
    },
  },
  resolve: {
    alias: {
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        util: "util",
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill()
      ]
    }
  },
  allowImportingTsExtensions: true,
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
  },
  // build: {
  //   target: 'esnext'
  // }
})
