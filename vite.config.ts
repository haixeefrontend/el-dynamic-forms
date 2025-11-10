import { copyFileSync } from 'node:fs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

import packageJson from './package.json'
import unoConfig from './uno.config'

function getPackageName() {
  const { name } = packageJson
  return name
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      entryRoot: 'src',
      afterBuild() {
        // Publint requires a .d.cts type definition file
        // https://publint.dev/rules#export_types_invalid_format
        copyFileSync('dist/index.d.ts', 'dist/index.d.cts')
      },
    }),
    unocss(unoConfig),
    AutoImport({
      imports: [
        'vue',
      ],
      dts: true,
      eslintrc: {
        enabled: true,
      },
    }),
    ElementPlus({ defaultLocale: 'zh-cn', useSource: true }),
    Components({
      dirs: [],
      globs: [],
      resolvers: [
        ElementPlusResolver({ importStyle: 'sass' }),
      ],
      dts: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: getPackageName(),
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    minify: false,
  },
})
