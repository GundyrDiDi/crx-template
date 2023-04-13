import type { App, AsyncComponentLoader } from 'vue'
import '@vue/runtime-core'
import { defineAsyncComponent } from 'vue'
// common
import SvgIcon from './common/svg-icon.vue'
// bussiness
import Attach from './Attach.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Attach: typeof Attach,
    SvgIcon: typeof SvgIcon
  }
}
export default (app: App) => {
  app.component('SvgIcon', SvgIcon)
  app.component('Attach', Attach)
}
