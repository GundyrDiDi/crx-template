import { defineStore } from 'pinia'
import { sendMessage } from '@/hooks/useExt'
// import { msg } from "@/plugins/ant"
import { Ref, ref } from 'vue'
import { ENV } from '@/hooks/const'
import { startLoop } from '@/hooks/utils'
import useFlow from './useFlow'

export default defineStore('auth', () => {
  const flow = useFlow()
  const userData: Ref<obj> = ref({})
  const level = ref(0)
  const imageCounts = ref(0)
  const keywordCounts = ref(0)
  const getUser = async () => {
    const vals = await sendMessage<[obj, number, number, number]>(
      'read', ['userData', 'memberLevel', 'imageCounts', 'keywordCounts']
    )
    userData.value = vals ? vals[0] : {}
    level.value = vals ? vals[1] : 0
    imageCounts.value = vals ? vals[2] : 0
    keywordCounts.value = vals ? vals[3] : 0
  }
  startLoop(getUser, 2000)

  flow.define('isLogin', async (ctx, next) => {
    console.log(userData.value)
    if (userData.value.token) {
      await next()
    } else {
      // msg.warn('请先登录直行便')
      setTimeout(() => {
        window.open(ENV.host)
      }, 2000)
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
        // msg.warn('今日使用次数已达到上限，请开通会员')
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

  const joinMember = () => {
    const url = ENV.path_vip.replace('{sys}', userData.value.systemSource === 1 ? 'd2c' : 'b2b')
    console.log(url)
    window.open(url)
  }

  const logout = () => {
    userData.value = {}
    sendMessage('write', { userData: {} })
  }

  const hasAccess = (l: number) => {
    return userData.value.token && level.value >= l
  }
  return {
    userData,
    level,
    imageCounts,
    keywordCounts,
    hasAccess,
    getUser,
    logout,
    flow: {
      isLogin,
      useCount
    },
    joinMember
  }
})
