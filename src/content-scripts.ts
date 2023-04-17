import createExt from '@/scripts/app'
import { getImgData } from './hooks/useSrhImg'
import connect from './scripts/post'
import { PLATS } from './hooks/const'

const url = location.href.replace(/\?.*$/, '')
/**
 * @description 匹配平台
 * @param url
 * @returns
 */
const matchPlat = (url: string) => {
  const match = new RegExp(`[^?]*\\.(${Object.values(PLATS).map(v => v + '\\.').join('|')})`)
  const word = (url.match(match) || [])[1] ?? ''
  return word.slice(0, -1)
}
/**
 * @description 页面地址url中的标识
 */
const plat = matchPlat(url)

// 是否商品详情页
const matchProduct = (plat: string) => {
  const t = {
    [PLATS.ali88]: 'detail',
    [PLATS.taobao]: 'item',
    [PLATS.tmall]: 'detail'
  }
  return (plat in t) && url.includes(t[plat])
}
const isProduct = matchProduct(plat)

// 等待页面原始先加载
setTimeout(() => {
  if (plat) {
    console.log(plat)
    const connects = [PLATS.theckb]
    if (connects.includes(plat)) {
      connect(plat)
    } else {
      createExt(plat, isProduct)
    }
  }
}, 500)

getImgData()
