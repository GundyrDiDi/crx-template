import { read, write } from './store'
import env from '@/hooks/env'

function serize (params?: obj, url = '') {
  if (!params) return url
  return Object.entries(params).reduce((acc, [k, v]) => {
    return acc + (k + '=' + v) + '&'
  }, url + '?').slice(0, -1)
}

const baseUrl = env.VITE_URL

const http = async (url: string, options: RequestInit) => {
  const { token, curShop } = await read('userData')
  if (token && curShop) {
    options.headers = {
      'X-AuthToken': token,
      'X-AuthShopId': curShop,
      ...options.headers
    }
  }
  if (typeof options.body === 'string') {
    options.headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      ...options.headers
    }
  }
  return fetch(baseUrl + url, options).then(res => res.json()).then(res => {
    const { code } = res
    if (code === '24010063' || code === '24010062' || code === '10000000') {
      write({ userData: {} })
    }
    return code === '0'
      ? res
      : Promise.reject(new Error(JSON.stringify({ url, code, msg: res?.msg ?? '接口报错' })))
  })
}

const post = (url: string, data?: obj | FormData | URLSearchParams) => http(url, {
  method: 'post',
  body: ((data instanceof FormData) || (data instanceof URLSearchParams)) ? data : JSON.stringify(data)
})
const get = (url: string, params?: obj) => http(serize(params, url), {
  method: 'get'
})

const requests: obj<fn> = {
  /**
     * 翻译
     * @param data
     * @returns
     */
  translate: data => post('/goods/translate/common', data),
  /**
     * 获取用户信息
     * @param data
     * @returns
     */
  getUser: data => get('/customer/getCustomerDetails', data),
  /**
     * 获取会员信息
     * @returns
     */
  getUserMember: () => get('/customer/getCustomerMembership'),
  /**
     * 获取非会员搜索次数
     * @returns
     */
  getSearchTime: () => get('/customer/pluginSearchStatistics'),
  usedSearch: (type) => get('/customer/pluginSearchStatistics/update', { type }),
  /**
     * 记录用户搜索
     * @param data
     * @returns
     */
  logSrch: data => post('/goods/search/key/plugin/log', data),
  /**
     *
     * @param data
     * @returns
     */
  canBuy: data => post('/goods/search/isInBlacklist', data),
  /**
     * 插件加购
     * @param data
     * @returns
     */
  addCart: data => post('/order/cart/add/pluginProduct', data)
}

export default <T>(key: string, data?: obj): Promise<{ data: T }> => {
  return requests[key](data)
}
