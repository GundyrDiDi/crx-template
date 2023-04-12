import { read, write } from './workers/store'
import http from './workers/http'

chrome.runtime.onMessage.addListener(async (req: SData, sender) => {
  const { cmd, data } = req
  try {
    const result = await dispatch[cmd](data).then(res => {
      if (res instanceof Error) {
        return Promise.reject(res)
      } else {
        return res
      }
    })
    return { data: result, code: '0' }
  } catch (err) {
    return { req, err: err instanceof Error ? err.message : err }
  }
})

const dispatch: Record<string, pfn> = {
  // 读写
  async read (key) {
    const res = await read(key)
    return res
  },
  async write (data) {
    await write(data)
  },
  // 搜图
  async readImg (url) {
    return fetch(url).then(res => res.blob()).then(res => {
      return new Promise((resolve, reject) => {
        const fd = new FileReader()
        fd.onload = (e) => {
          if (typeof e.target!.result === 'string') {
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
  async getImg (imgKey) {
    return read('imgData').then(res => res[imgKey] ?? new Error('获取图片失败'))
  },
  // 更新用户信息
  async updateUser () {
    const res = await http<Store['userData']>('getUser')
    write({ userData: res.data ? res.data : {} })
    return res.data
  },
  // 保存用户信息
  async setUser (data) {
    console.log(data)
    await write({ userData: data })
    this.canFreeSearch()
  },
  async canFreeSearch () {
    const userData = await read('userData')
    if (!userData.token) return
    const res = await http<{ templateLevel: number }>('getUserMember')
    if (res.data) {
      const memberLevel = res.data.templateLevel
      write({ memberLevel })
      if (memberLevel < 1) {
        await this.setSearchCount()
      }
    }
  },
  async setSearchCount () {
    const counts = await http<{ imageSearchKey: number, searchKeywordKey: number }>('getSearchTime')
    if (counts.data) {
      const { imageSearchKey, searchKeywordKey } = counts.data
      write({ imageCounts: imageSearchKey })
      write({ keywordCounts: searchKeywordKey })
    }
  },
  //
  async usedSearch (type) {
    const level = await read('memberLevel')
    if (level === 0) {
      await http('usedSearch', type).then(() => {
        this.setSearchCount()
      })
    }
  },
  // 搜索翻译
  async langToZh (word: string) {
    return http('translate', {
      from: await read('langCode'),
      to: 'zh',
      text: word
    })
  }
  //
  // async getSku(data: any) {
  //   fetch(data.url, {
  //     headers: data.headers
  //   })
  // }
}
