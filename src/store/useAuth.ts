import { defineStore } from 'pinia'
import { sendMessage } from '@/hooks/useExt'
import { useDebounceFn } from '@vueuse/core'
// import { msg } from "@/plugins/ant"
import { Ref, ref } from 'vue'
import { ENV } from '@/hooks/const'
import { startLoop } from '@/hooks/utils'

export default defineStore('auth', () => {
  const userData: Ref<Record<string, any>> = ref({})
  const level = ref(0)
  const imageCounts = ref(0)
  const keywordCounts = ref(0)
  const getUser = async () => {
    const vals = await sendMessage<[Record<string, any>, number, number, number]>(
      'read', ['userData', 'memberLevel', 'imageCounts', 'keywordCounts']
    )
    userData.value = vals ? vals[0] : {}
    level.value = vals ? vals[1] : 0
    imageCounts.value = vals ? vals[2] : 0
    keywordCounts.value = vals ? vals[3] : 0
  }
  startLoop(getUser, 2000)

  const before = (fn: fn, t = 300) => useDebounceFn(() => {
    console.log(userData.value)
    if (userData.value.token) {
      fn()
    } else {
      // msg.warn('请先登录直行便')
      console.log(ENV.VITE_HOST)
      setTimeout(() => {
        window.open(ENV.VITE_HOST)
      }, 2000)
    }
  }, t)

  const updateCount = (fn: fn, type: 1 | 2) => {
    return async () => {
      if (level.value > 0) {
        return await fn()
      }
      const count = {
        1: keywordCounts.value,
        2: imageCounts.value
      }[type]
      if (count > 0) {
        const result = await fn()
        // 成功调用时，减一次
        if (result) {
          sendMessage('usedSearch', type)
        }
        return result
      } else {
        // msg.warn('今日使用次数已达到上限，请开通会员')
        setTimeout(() => {
          joinMember()
        }, 3000)
      }
    }
  }

  const joinMember = () => {
    const url = ENV.VITE_JOINMEMBER.replace('d2c', userData.value.systemSource === 1 ? 'd2c' : 'b2b')
    console.log(url)
    window.open(url)
  }

  const isLogin = <T extends fn>(fn: T) => {
    return fn
  }

  const logout = () => {
    userData.value = {}
    sendMessage('write', { userData })
  }

  const access = (l: number) => {
    return userData.value.token && level.value >= l
  }
  return {
    userData,
    level,
    imageCounts,
    keywordCounts,
    access,
    getUser,
    logout,
    before,
    updateCount,
    joinMember,
    isLogin
  }
})
