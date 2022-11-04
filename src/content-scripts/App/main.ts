import { createApp } from 'vue'
import $ from 'jquery'
import App from './App.vue'
import '@/assets/css/style.scss'
import common from '@/common/setup'

export const createCrx = ():void => {
  const id = '__crx__'
  const el = $(`<div id="${id}"><div>`)
  $('body').append(el)
  createApp(App).use(common).mount('#' + id)
}
