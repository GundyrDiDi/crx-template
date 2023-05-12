import { defineStore } from 'pinia'
import { sendMessage, connect } from '@/hooks/useExt'
import { watch } from 'vue'
import { ENV, CKB } from '@/hooks/const'
import useFlow from './useFlow'
import { msg } from '@/plugins/ant'
import useLogin from './useLogin'
import { wait } from '@/hooks/utils'

export default defineStore('auth', () => {
  const flow = useFlow()
  const login = useLogin()
  const token = connect('token', '')
  const curShop = connect('curShop', '')
  const customerId = connect('customerId', '')
  const systemSource = connect('systemSource', 1)
  const level = connect('memberLevel', 0)
  const imageCounts = connect('imageCounts', 0)
  const keywordCounts = connect('keywordCounts', 0)

  flow.define('isLogin', async (ctx, next) => {
    console.log(token.value)
    if (token.value) {
      await next()
    } else {
      if (ENV.pjt === CKB) {
        msg.warn('请先登录直行便')
        setTimeout(() => {
          window.open(ENV.host)
        }, 2000)
      } else {
        login.show()
      }
    }
  })

  flow.define('updateCount', async (ctx, next, type: 1 | 2) => {
    if (level.value > 0) {
      await next()
    } else {
      const count = {
        1: keywordCounts.value,
        2: imageCounts.value
      }[type]
      if (count > 0) {
        const result = await next()
        // 成功调用时，减一次
        if (result) {
          sendMessage('usedSearch', type)
        }
      } else {
        msg.warn('今日使用次数已达到上限，请开通会员')
        setTimeout(() => {
          joinMember()
        }, 3000)
      }
    }
  })

  /**
   *
   * @returns
   */
  const isLogin = flow.use('isLogin')
  const useCount = isLogin.add('updateCount')

  const joinMember = isLogin.add(() => {
    const url = ENV.path_vip.replace('{sys}', systemSource.value === 1 ? 'd2c' : 'b2b')
    console.log(url)
    window.open(url)
  })

  const hasAccess = (l: number) => {
    return token.value && level.value >= l
  }

  /** 向外暴露出 token 变化的监听 */
  const onUserChange = (fn:fn) => {
    watch(token, fn)
  }

  // 等待 userData 初始化
  const init = () => wait()
  return {
    token,
    curShop,
    customerId,
    level,
    imageCounts,
    keywordCounts,
    hasAccess,
    flow: {
      isLogin,
      useCount
    },
    joinMember,
    onUserChange,
    init
  }
})
