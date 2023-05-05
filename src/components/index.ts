import type { App } from 'vue'
// common
import SvgIcon from './common/SvgIcon.vue'
import SniffBtn from './common/SniffBtn.vue'
import Modal from './common/Modal.vue'
// bussiness
import Attach from './Attach.vue'
import Bubble from './Bubble.vue'
import CartBtn from './CartBtn.vue'
import LangBar from './bubble/LangBar.vue'
import MemberInfo from './bubble/MemberInfo.vue'
import SearchBar from './bubble/SearchBar.vue'
import SkuList from './bubble/SkuList.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Attach: typeof Attach,
    SvgIcon: typeof SvgIcon,
    Modal: typeof Modal,
    SniffBtn: typeof SniffBtn,
    Bubble: typeof Bubble,
    LangBar: typeof LangBar,
    MemberInfo: typeof MemberInfo,
    SearchBar: typeof SearchBar,
    SkuList: typeof SkuList,
  }
}

export default (app: App) => {
  app.component('SvgIcon', SvgIcon)
  app.component('Modal', Modal)
  app.component('Attach', Attach)
  app.component('Bubble', Bubble)
  app.component('CartBtn', CartBtn)
  app.component('SniffBtn', SniffBtn)
  app.component('LangBar', LangBar)
  app.component('MemberInfo', MemberInfo)
  app.component('SearchBar', SearchBar)
  app.component('SkuList', SkuList)
}
