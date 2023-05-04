import { sendMessage } from '@/hooks/useExt'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export default defineStore('login', () => {
  const visible = ref(false)
  const enter = ref(0)
  const show = () => {
    visible.value = true
  }
  const signin = (data:obj) => {
    return sendMessage('http', [enter.value ? 'loginByPwd' : 'loginByCode', data])
  }
  return {
    show,
    signin
  }
})
