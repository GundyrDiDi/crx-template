import { ref } from 'vue'
import { defineStore } from 'pinia'
import { sendMessage } from '@/hooks/useExt'
import { msg } from '@/plugins/ant'
import useLang from './useLang'

export default defineStore('login', () => {
  const visible = ref(false)
  const enter = ref(0)
  const show = () => {
    visible.value = true
  }
  const getEmailCode = async (email:string) => {
    const { langCode } = useLang()
    const res = await sendMessage('http', { customerEmail: email, langcode: langCode })
    if (res) {
      msg.success('验证码已发送')
    }
  }
  const signin = (data:obj) => {
    return sendMessage('http', [enter.value ? 'loginByPwd' : 'loginByCode', data])
  }
  const signout = () => {
    sendMessage('write', { userData: {} })
  }
  return {
    visible,
    show,
    signin,
    signout,
    getEmailCode
  }
})
