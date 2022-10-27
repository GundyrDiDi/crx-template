import { createApp } from 'vue'
import $ from 'jquery'
import App from './App.vue'
import '@/assets/css/style.scss'

export const createCrx = () => {
  const id = '__crx__'
  const el = $(`<div id="${id}"><div>`)
  $('body').append(el)
  createApp(App).mount('#' + id)
}
