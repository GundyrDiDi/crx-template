import { read, write } from './store'
import { ENV } from '@/hooks/const'

function serize (params?: obj, url = '') {
  if (!params) return url
  return Object.entries(params).reduce((acc, [k, v]) => {
    return acc + (k + '=' + v) + '&'
  }, url + '?').slice(0, -1)
}

const baseUrl = ENV.url

const http = async (url: string, options: RequestInit, other?:string) => {
  const { token, curShop } = await read('userData')
  if (token) {
    options.headers = {
      'X-AuthToken': token,
      'X-AuthShopId': curShop ?? '',
      ...options.headers
    }
  }
  if (typeof options.body === 'string') {
    options.headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      ...options.headers
    }
  }
  return fetch((other || baseUrl) + url, options).then(res => res.json()).then(res => {
    const { code, msg, error } = res
    if (code === '24010063' || code === '24010062' || code === '10000000') {
      write({ userData: {} })
    }
    return code === '0'
      ? (res.data ?? true)
      : Promise.reject(new Error(code + '#' + (msg ?? error) + '#' + JSON.stringify(options)))
  })
}

const post = (url: string, data?: obj | FormData | URLSearchParams) => http(url, {
  method: 'post',
  body: ((data instanceof FormData) || (data instanceof URLSearchParams)) ? data : JSON.stringify(data)
})
const get = (url: string, params?: obj) => http(serize(params, url), {
  method: 'get'
})
const post1 = (url: string, data?: obj | FormData | URLSearchParams) => http(url, {
  method: 'post',
  body: ((data instanceof FormData) || (data instanceof URLSearchParams)) ? data : JSON.stringify(data)
}, 'https://productPlugIn.theckb.com')

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
  addCart: data => post('/order/cart/add/pluginProduct', data),
  /**
   * 注册
   * @param data
   * @returns
   */
  checkLoginName: data => get('/customer/signup/check/loginname', data),
  getSignupCode: data => post('/customer/signup/send/code', data),
  signup: data => post('/customer/signup', data),
  setDefault: data => post('/customer/signup/defaultLogin', data),
  /**
   * 登录
   * @param data
   * @returns
   */
  getLoginCode: data => post('/customer/emailLogin/send/code', data),
  loginByCode: data => post('/customer/emailLogin', data),
  loginByPwd: data => post('/customer/passwordLogin', data),
  /**
   * 保存谷歌表地址
   * @param data
   * @returns
   */
  setGoogleSheet: data => post('/customer/updateCustomerGoogle', data),
  /**
   * 添加谷歌表商品
   * @param data
   * @returns
   */
  getSheetSkus: data => post1('/productPlugInSelect', data),
  addSheetSku: data => post1('/productPlugInInsert', data),
  delSheetSku: data => post1('/productPlugInDelete', data)
}

export default <T>(key: string, data?: obj): Promise<T> => {
  return requests[key](data)
}
