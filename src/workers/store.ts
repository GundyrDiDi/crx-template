// 最大支持5m
const storage = chrome.storage.local

type Store = {
  userData: {
    curShop?: string,
    token?: string,
    systemSource?: number
  },
  memberLevel: number,
  imageCounts: number,
  keywordCounts: number,
  maxCounts: number,
  langCode: string,
  imgData: Record<string, string>
}

const store: Store = {
  userData: {},
  memberLevel: 0,
  imageCounts: 0,
  keywordCounts: 0,
  maxCounts: 0,
  langCode: 'ja',
  imgData: {}
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

export const write = <T extends keyof Store>(key: T, val: Store[T]): Promise<Store[T] | undefined> => read(key).then(old => {
  if (old === val) return val
  storage.set({ [key]: val })
})
