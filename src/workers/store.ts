// 最大支持5m
const storage = chrome.storage.local

const mainfest = chrome.runtime.getManifest()
const defaultLocale = mainfest.default_locale ?? 'zh'

declare global{
  type Store = {
    /** 登录时返回的token，用于调用获取用户接口 */
    token: string
    /** 作为ckb插件的登录凭证 */
    curShop: string,
    /** 作为glt插件的登录凭证 */
    customerId: string,
    /** 2b:2;2c:1 */
    systemSource: number,
    /** 用户等级 */
    memberLevel: number,
    /** 搜图次数 */
    imageCounts: number,
    /** 搜词次数 */
    keywordCounts: number,
    /** 最大次数 */
    maxCounts: number,
    /** 用户谷歌表绑定语言 */
    langcode:string,
    /** 语言 */
    langCode: string,
    /** 图片base64储存 */
    imgData: Record<string, string>,
    /** 用户保存谷歌表 */
    googleUrl: string,
    /** 谷歌商品表 */
    sheetSkus: obj[],
    /** 谷歌表接口极慢，且同一个表不能并发请求，所以在background内声明一个值来控制所有页面的状态 */
    waiting: boolean
  }
}

const store: Store = {
  token: '',
  curShop: '',
  systemSource: 1,
  customerId: '',
  memberLevel: 0,
  imageCounts: 0,
  keywordCounts: 0,
  maxCounts: 0,
  googleUrl: '',
  langcode: defaultLocale,
  langCode: defaultLocale,
  imgData: {},
  sheetSkus: [],
  waiting: false
}

// 设置默认值
storage.get(Object.keys(store), res => {
  Object.keys(store).forEach(key => {
    if (res[key] === undefined) {
      storage.set({
        [key]: store[key as keyof Store]
      })
    }
  })
})

export const read = <T extends keyof Store>(key: T): Promise<Store[T]> => new Promise(resolve =>
  storage.get([key], res => {
    resolve(res[key])
  })
)

export const write = <T extends keyof Store>(data: Record<T, Store[T]>):Promise<void> => storage.set(data)
