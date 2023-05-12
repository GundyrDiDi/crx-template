import { ref, reactive, Ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { http, sendMessage, write } from '@/hooks/useExt'
import { msg } from '@/plugins/ant'
import useLang from './useLang'
import { ENV } from '@/hooks/const'
import { t } from '@/i18n'
import md5 from 'md5'
import { useLocalStorage } from '@vueuse/core'

export default defineStore('login', () => {
  /** 登录弹窗 */
  const visible = ref(false)
  const show = () => (visible.value = true)
  const hide = () => (visible.value = false)

  /** 登录方式 */
  const enterText = (enter: number) => [t('账号密码登录'), t('邮箱验证码登录')][enter]
  const enter = ref(0)

  const loginForm = reactive({
    nameOrEmail: ENV.NODE_ENV === 'development' ? 'qiaoyi10' : '',
    password: ENV.NODE_ENV === 'development' ? '111111' : '',
    customerEmail: ENV.NODE_ENV === 'development' ? '1053353746@qq.com' : '',
    verificationCode: ENV.NODE_ENV === 'development' ? '1234' : ''
  })

  const loginRules = reactive({})

  /** 验证码接口 */
  const [waitCount, getEmailCode] = LimitSend(async () => {
    const res = await http('getLoginCode', {
      customerEmail: loginForm.customerEmail,
      langcode: useLang().langCode
    })
    if (res) {
      msg.success('验证码已发送')
    }
    return !!res
  }, 'loginByCode')

  /** 登录接口 */
  const signin = async () => {
    const res = await http<{ token: string }>(
      enter.value ? 'loginByCode' : 'loginByPwd',
      { ...loginForm, password: md5(loginForm.password) }
    )
    if (res) {
      hide()
      write({ token: res.token })
      const user = await sendMessage('updateUser')
      console.log(user)
    }
  }

  /** 退出登录 */
  const outVisible = ref(false)
  const signout = () => {
    write({ token: '', curShop: '', customerId: '' })
    outVisible.value = false
  }

  /** 忘记密码 */
  const forgotPwLink = () => ENV.host + '/login/findpwd?lang=' + useLang().langCode

  /** 注册弹窗 */
  const upVisible = ref(true)
  const toggle = () => {
    hide()
    setTimeout(() => {
      upVisible.value = true
    }, 200)
  }
  const SUForm = reactive({
    loginName: '',
    password: '',
    repassword: '',
    customerEmail: '',
    verificationCode: '',
    customerMobile: '',
    customerName: '',
    countryCode: ''
  })
  const SURules = reactive({})

  watch(() => useLang().langCode, v => {
    const cc:obj = {
      en: '',
      ko: '+82',
      th: '+66'
    }
    SUForm.countryCode = cc[v]
  })

  /** 验证重名 */
  const checkLoginName = async () => {
    return await http('checkLoginName', { loginName: SUForm.loginName })
  }

  /** 验证码接口 */
  const [waitCnt, getSignupCode] = LimitSend(async () => {
    const res = await http('getSignupCode', {
      customerEmail: SUForm.customerEmail,
      langcode: useLang().langCode
    })
    if (res) {
      msg.success('验证码已发送')
    }
    return !!res
  }, 'SignupByCode')

  /** 注册接口 */
  const signup = async () => {
    //
  }

  return {
    visible,
    enter,
    enterText,
    loginForm,
    loginRules,
    show,
    signin,
    waitCount,
    getEmailCode,
    outVisible,
    signout,
    forgotPwLink,
    toggle,
    upVisible,
    SUForm,
    SURules,
    waitCnt,
    getSignupCode,
    signup
  }
})

/**
 *
 * @param fn 获取验证码api
 * @param local 本地储存key
 * @param num 限制秒数
 * @returns
 */
const LimitSend = <T extends unknown[]>(fn: pfn<T, boolean>, local: string, num = 60)
  : [Ref<number>, pfn<T, boolean | undefined>] => {
  const count: any = useLocalStorage(local, 0)
  const dida = () => {
    const timer = setInterval(() => {
      if (count.value < 1) {
        clearInterval(timer)
      } else {
        count.value = count.value - 1
      }
    }, 1000)
  }
  if (count.value > 0) dida()
  const wrap = async (...args: T) => {
    if (count.value === 0) {
      count.value = num
      const res = await fn(...args)
      dida()
      if (!res) {
        count.value = 0
      }
      return res
    }
  }
  return [count, wrap]
}
