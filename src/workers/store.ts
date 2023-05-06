// 最大支持5m
const storage = chrome.storage.local

const mainfest = chrome.runtime.getManifest()
const defaultLocale = mainfest.default_locale ?? 'zh'

declare global{
  type Store = {
    /** shopid token */
    userData: Partial<{
      curShop: string,
      token: string,
      systemSource: number,
      customerId: string,
      langcode: string,
      googleUrl: string
    }>,
    /** 用户等级 */
    memberLevel: number,
    /** 搜图次数 */
    imageCounts: number,
    keywordCounts: number,
    /** 最大次数 */
    maxCounts: number,
    /** 用户谷歌表绑定语言 */
    googleSheetLangCode:string,
    /** 语言 */
    langCode: string,
    /** 图片base64储存 */
    imgData: Record<string, string>,
    /**  */
    customerId: string,
    /** 用户保存谷歌表 */
    googleUrl: string,
    /** 谷歌商品表 */
    sheetSkus: obj[],
    /** 谷歌表接口极慢，且同一个表不能并发请求，所以在background内声明一个值来控制所有页面的状态 */
    waiting: boolean
  }
}

const store: Store = {
  userData: {},
  memberLevel: 0,
  imageCounts: 0,
  keywordCounts: 0,
  maxCounts: 0,
  googleSheetLangCode: defaultLocale,
  langCode: defaultLocale,
  imgData: {},
  customerId: '',
  googleUrl: '',
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
