import ElementPlus from 'element-plus'
import { App } from 'vue'

import { default as EdfDesigner } from './designer'
import { overrideLocalesKey } from './locales'

export { EdfDesigner }

type DotSeparatedPath<T> = T extends object
  ? {
      [K in keyof T & (string | number)]?: K extends string | number
        ? `${K}` | `${K}.${DotSeparatedPath<T[K]>}`
        : never
    }[keyof T & (string | number)]
  : ''

export type EdfLocalePath = Exclude<DotSeparatedPath<typeof import('./locales/en-us').default>, undefined>

export interface EdfOptions {
  locales?: { [k: string]: Partial<Record<EdfLocalePath, string>> }
}

export function install(app: App, options: EdfOptions = {}) {
  // Check if Element Plus is installed
  if (!app._context.components.ElButton) {
    app.use(ElementPlus)
  }
  app.component('EdfDesigner', EdfDesigner)
  app.component('EdfDesignerApercu', EdfDesigner.Apercu)

  if (typeof options.locales === 'object' && options.locales !== null) {
    app.provide(overrideLocalesKey, options.locales)
  }
}

export default install
