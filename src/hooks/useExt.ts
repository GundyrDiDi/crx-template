import $ from 'jquery'
import { wait, until } from './utils'

/**
 * content-script 与 background 通信
 * @param cmd
 * @param data
 * @returns void | data
 */
export const sendMessage = <T>(cmd: string, data?: unknown) => {
  const p = new Promise<T|void>((resolve, reject) => {
    chrome.runtime.sendMessage({ cmd, data }, (res) => {
      if (res?.err) {
        console.error(res)
        // sendMessage 应该返回错误还是返回undefined？
        // reject(res)
        resolve()
      } else {
        resolve(res.data)
      }
    })
  })
  return p
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
export const getAsyncDom = (selector:string) => until(() => $(selector))
