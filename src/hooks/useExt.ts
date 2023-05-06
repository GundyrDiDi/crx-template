import $ from 'jquery'
import { wait, until, startLoop } from './utils'
import { UnwrapRef, ref, Ref, watch } from 'vue'
import { msg } from '@/plugins/ant'
import type { Messages } from '@/i18n'

const ErrorCode: obj<keyof Messages> = {
  noMatch: 'sku'
}

/**
 *
 * @param key
 * @param dft 默认值
 * @param interval 间隔时间
 * @returns
 */
export const connect = <T>(key: string, dft: T, interval = 2000) => {
  const v = ref<T>(dft)
  const fn = async () => {
    const res = await sendMessage<T>('read', key)
    v.value = (res ?? dft) as UnwrapRef<T>
  }
  fn()
  startLoop(fn, interval)
  observe(key, fn)
  return v
}

/**
 * content-script 与 background 通信
 * @param cmd
 * @param data
 * @returns void | data
 */
export const sendMessage = <T>(cmd: string, data?: unknown) => {
  const p = new Promise<T | void>((resolve, reject) => {
    chrome.runtime.sendMessage({ cmd, data }, (res) => {
      if (res?.err) {
        console.error(res)
        const { req, err } = res
        if (err in ErrorCode) {
          msg.error(ErrorCode[err])
        }
        // todo: 上报错误监控
        resolve()
      } else {
        if (cmd === 'write') {
          Object.keys(data as obj).forEach(key => {
            if (observer[key]) {
              observer[key].forEach(v => v())
            }
          })
        }
        resolve(res.data)
      }
    })
  })
  return p
}

const observer:obj<fn[]> = {}
/**
 *
 * @param data
 * @param callback
 * @returns
 */
export const observe = (data:string, callback:fn) => {
  if (!observer[data])observer[data] = []
  observer[data].push(callback)
  const index = observer[data].length - 1
  return () => {
    const t = observer[data]
    if (t[index] === callback) {
      t.splice(index, 1)
    }
  }
}

/**
 * content-script 获取内部环境的全局对象
 * @param props
 * @param count
 * @returns
 */
export const getSrcWin = <T>(props: string, count = 10): Promise<T> => {
  const postID = Math.random()
  return new Promise((resolve) => {
    const success = (value: T) => {
      resolve(value)
      btn.remove()
      window.removeEventListener('message', cb)
    }
    const cb = (res: MessageEvent<{ value: T, id: number }>) => {
      const { value, id } = res.data
      if (id === postID) {
        if (--count !== 0 && value === undefined) {
          wait(100).then(() => btn.trigger('click'))
        } else {
          success(value)
        }
      }
    }
    window.addEventListener('message', cb)
    const btn = $(`<div onclick="
            window.postMessage({id:${postID},value:${props}})
        "></div>`)
    $('body').append(btn)
    requestAnimationFrame(() => {
      btn.trigger('click')
    })
  })
}

/**
 *
 * @param selector
 * @returns
 */
export const $async = (selector: string) => until(() => $(selector))

/**
 *
 * @param r
 * @param delay1
 * @param delay2
 */
export const aRef = (r: Ref, delay1: number, delay2?: number) => {
  const a = ref(r.value)
  watch(r, (v) => {
    if (delay2 === undefined) {
      delay1 ? setTimeout(() => {
        a.value = v
      }, delay1) : (a.value = v)
    } else {
      setTimeout(() => {
        a.value = v
      }, v ? delay1 : delay2)
    }
  })
  return a
}
