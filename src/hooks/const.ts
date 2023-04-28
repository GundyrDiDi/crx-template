/**
 * @prop url
 * @prop host
 * @prop pjt
 * @prop path_vip
 */
export const ENV = new Proxy(process.env, {
  get (target, prop:string) {
    if (prop.toLowerCase() === prop) return target[`VUE_APP_${prop.toUpperCase()}`]

    return target[prop]
  }
})

/**
 * @description 值是url匹配到的名称标识
 */
export const PLATS = {
  taobao: 'taobao',
  tmall: 'tmall',
  ali88: '1688',
  aliexpress: 'aliexpress',
  pinduoduo: 'pinduoduo',
  amazon: 'amazon',
  rakuten: 'rakuten',
  yahoo: 'yahoo',
  coupang: 'coupang',
  gmarket: 'gmarket',
  '11st': '11st',
  theckb: 'theckb'
}
