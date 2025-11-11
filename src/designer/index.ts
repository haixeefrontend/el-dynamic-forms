import component from './index.vue'

import { default as Apercu } from './apercu.vue'

Object.assign(component, {
  Apercu,
})

export default component as typeof component & {
  Apercu: typeof Apercu
}
