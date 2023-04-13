import { defineStore } from 'pinia'
import { sendMessage } from '@/hooks/useExt'
import { ref } from 'vue'

export default defineStore('lang', () => {
  const langCode = ref('en')
  //   startLoop(async () => {
  //     langCode.value = (await sendMessage('read', 'langCode')) ?? 'en'
  //   }, 1000)
  return {
    langCode
  }
})
