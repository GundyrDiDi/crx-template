import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { sendMessage } from '@/hooks/useExt'
import { msg } from '@/plugins/ant'
import useLang from './useLang'
import { t } from '@/i18n'
import { ENV } from '@/hooks/const'
import md5 from 'md5'

export default defineStore('login', () => {
  const visible = ref(false)
  const enterText = [
    t('账号密码登录'),
    t('邮箱验证码登录')
  ]
  const enter = ref(0)

  const loginForm = reactive({
    nameOrEmail: ENV.NODE_ENV === 'development' ? 'qiaoyi10' : '',
    password: ENV.NODE_ENV === 'development' ? '111111' : '',
    customerEmail: ENV.NODE_ENV === 'development' ? '502121489@qq.com' : '',
    verificationCode: ENV.NODE_ENV === 'development' ? '1234' : ''
  })

  const loginRules = reactive({})

  const show = () => {
    visible.value = true
  }
  const hide = () => {
    visible.value = false
  }
  const getEmailCode = async (email:string) => {
    const { langCode } = useLang()
    const res = await sendMessage('http', { customerEmail: email, langcode: langCode })
    if (res) {
      msg.success('验证码已发送')
    }
  }
  const signin = async () => {
    console.log(loginForm)
    const res = await sendMessage('http', [
      enter.value ? 'loginByCode' : 'loginByPwd',
      { ...loginForm, password: md5(loginForm.password) }
    ])
    if (res) {
      hide()
      await sendMessage('write', { userData: res })
      const user = await sendMessage('updateUser')
      console.log(user)
    }
  }
  const signout = () => {
    sendMessage('write', { userData: {} })
  }
  return {
    visible,
    enter,
    enterText,
    loginForm,
    loginRules,
    show,
    signin,
    signout,
    getEmailCode
  }
})
