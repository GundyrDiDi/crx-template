import { createApp } from 'vue'
import $ from 'jquery'
import App from '@/scripts/App.vue'
import pinia from '@/plugins/pinia'
import '@/styles/index.scss'
import useAuth from '@/store/useAuth'
// import 'ant-design-vue/dist/antd.min.css'
// import 'ant-design-vue/es/message/style/index.css'
import { i18n } from '@/i18n'
import resolver from '@/components'

export default async (plat: string, isProduct: boolean) => {
  const el = $('<div sniff-ext><div>')
  $('body').append(el)
  const app = createApp(App).use(pinia).use(i18n).use(resolver)
  await useAuth().getUser()
  // await usePlat().init(plat, isProduct)
  app.mount(el[0])
}
