import ElementPlus from 'element-plus'
import { App } from 'vue'

import { default as EdfDesigner } from './designer'

export { EdfDesigner }

export function install(app: App) {
  // Check if Element Plus is installed
  if (!app._context.components.ElButton) {
    app.use(ElementPlus)
  }
  app.component('EdfDesigner', EdfDesigner)
  app.component('EdfDesignerApercu', EdfDesigner.Apercu)
}

export default install
