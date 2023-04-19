import type { App, AsyncComponentLoader } from 'vue'
import { defineAsyncComponent } from 'vue'
// common
import SvgIcon from './common/svg-icon.vue'
// bussiness
import Attach from './Attach.vue'
import Bubble from './Bubble.vue'
import CartBtn from './CartBtn.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Attach: typeof Attach,
    SvgIcon: typeof SvgIcon,
    Bubble: typeof Bubble
  }
}

export default (app: App) => {
  app.component('SvgIcon', SvgIcon)
  app.component('Attach', Attach)
  app.component('Bubble', Bubble)
  app.component('CartBtn', CartBtn)
}
