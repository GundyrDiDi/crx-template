import $ from 'jquery'
import { createApp } from 'vue'
import App from '@/scripts/App.vue'
import pinia from '@/plugins/pinia'
import '@/styles/index.scss'
import useAuth from '@/store/useAuth'
import usePlat from '@/store/usePlat'
import { i18n } from '@/i18n'
import resolver from '@/components'
import antd from 'ant-design-vue'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
      root: HTMLElement
  }
}

declare global {
  export interface Window {
      __root: HTMLElement
  }
}

export default async (plat: string, isProduct: boolean) => {
  const el = $('<div sniff-ext><div>')
  $('body').append(el)
  const app = createApp(App).use(pinia).use(i18n).use(resolver).use(antd)
  await useAuth().init()
  await usePlat().init(plat, isProduct)
  window.__root = app.config.globalProperties.root = el[0]
  app.mount(el[0])
}
