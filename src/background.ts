import { read, write } from './workers/store'
import http from './workers/http'
import { sendMessage } from './hooks/useExt'

// 注意 V2版本的回调函数不可为异步函数，且必须返回true才会保持通信
chrome.runtime.onMessage.addListener((req: SData, sender, sendResponse) => {
  const { cmd, data } = req
  const run = async () => {
    try {
      const result = await dispatch[cmd](data).then(res => {
        if (res instanceof Error) {
          return Promise.reject(res)
        } else {
          return { data: res }
        }
      })
      sendResponse(result)
    } catch (err) {
      sendResponse({ req, err: err instanceof Error ? err.message : err })
    }
  }
  run()
  return true
})

const dispatch: Record<string, pfn> = {
  // 读写
  async read (key) {
    if (Array.isArray(key)) {
      return Promise.all(key.map(v => read(v)))
    } else {
      const res = await read(key)
      return res
    }
  },
  async write (data) {
    await write(data)
  },
  // 请求
  async http (data) {
    return http(data[0], data[1])
  },
  // 搜图
  async readImg (url) {
    return fetch(url).then(res => res.blob()).then(res => {
      return new Promise((resolve, reject) => {
        const fd = new FileReader()
        fd.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            const imgKey = Date.now().toString()
            write({ imgData: { [imgKey]: e.target!.result } })
            resolve(imgKey)
          } else {
            reject(new Error())
          }
        }
        setTimeout(reject, 15 * 1000)
        fd.readAsDataURL(res)
      })
    }).catch(() => new Error('读取图片失败'))
  },
  async setImg (imgData) {
    const imgKey = Date.now().toString()
    await write({ imgData: { [imgKey]: imgData } })
    return imgKey
  },
  async getImg (imgKey) {
    return read('imgData').then(res => res[imgKey] ?? new Error('获取图片失败'))
  },
  // 更新用户信息
  async updateUser () {
    write({ userData: {} })
    const res = await http<Store['userData']>('getUser')
    write({ userData: res })
    res.customerId && write({ customerId: res.customerId })
    res.googleUrl && write({ googleUrl: res.googleUrl ?? '' })
    res.langcode && write({ googleSheetLangCode: res.langcode })
    return res
  },
  // 保存用户信息
  async setUser (data) {
    await write({ userData: data })
    this.canFreeSearch()
  },
  async canFreeSearch () {
    const userData = await read('userData')
    if (!userData.token) return
    const res = await http<{ templateLevel: number }>('getUserMember')
    const memberLevel = res.templateLevel
    write({ memberLevel })
    if (memberLevel < 1) {
      await this.setSearchCount()
    }
  },
  async setSearchCount () {
    const counts = await http<{ imageSearchKey: number, searchKeywordKey: number }>('getSearchTime')
    const { imageSearchKey, searchKeywordKey } = counts
    write({ imageCounts: imageSearchKey })
    write({ keywordCounts: searchKeywordKey })
  },
  // 减少次数
  async usedSearch (type) {
    const level = await read('memberLevel')
    if (level === 0) {
      await http('usedSearch', type)
      await this.setSearchCount()
    }
  },
  // 搜索翻译
  async langToZh (word: string) {
    http('logSrch', { word })
    return http('translate', {
      from: await read('langCode'),
      to: 'zh',
      text: word
    })
  },
  // 更新谷歌表
  async updateSheet ({ add, del }:{loop?:boolean, add?:obj[], del?:obj} = {}) {
    await write({ waiting: true })
    const [googleSheetLangCode, googleUrl] = await this.read(['googleSheetLangCode', 'googleUrl'])
    const thMap = {
      time: 'Date',
      photoUrl: 'Photo Url',
      productName: 'Product Name',
      productUrl: 'Product Url',
      productSpecification: 'Product Specification',
      quantity: 'Quantity'
    }
    const googleHeaderData = Object.values(thMap).join(',')
    const setProps = (data: obj[], forward?:boolean) => {
      return data.map(v => {
        const o:obj = {}
        Object.entries(thMap).forEach(([key1, key2]) => {
          if (forward) {
            o[key1] = v[key2]
          } else {
            o[key2] = v[key1]
          }
        })
        return o
      })
    }
    if (!googleUrl) {
      write({ sheetSkus: [] })
    } else {
      if (add) {
        const res = await http('postGoogleSheet', {
          googleUrl,
          langCode: googleSheetLangCode,
          data: setProps(add)
        })
        console.log(res)
      } else if (del) {
        const res = await http('deleteGoogleSheet', {
          googleUrl,
          langCode: googleSheetLangCode,
          // ...delItem,
          googleHeaderData
        })
        console.log(res)
      } else {
        const res = await http<obj[]>('getGoogleSheet', {
          googleUrl,
          langCode: googleSheetLangCode,
          googleHeaderData
        })
        write({ sheetSkus: setProps(res, true) })
      }
    }
    await write({ waiting: false })
  }
}

setInterval(
  dispatch.canFreeSearch,
  1000 * 10 * 60
)
