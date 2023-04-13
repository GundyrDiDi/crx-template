import { createApp } from 'vue'
import $ from 'jquery'
import App from '@/pages/App.vue'
import pinia from '@/plugins/pinia'
import '@/styles/index.scss'
// import 'ant-design-vue/dist/antd.min.css'
// import 'ant-design-vue/es/message/style/index.css'
import { i18n } from '@/i18n'

export default async (plat: string, isProduct: boolean) => {
  const el = $('<div><div>')
  $('body').append(el)
  const app = createApp(App).use(pinia).use(i18n)
  // await usePlat().init(plat, isProduct)
  // await useAuth().setUser()
  app.mount(el[0])
}
