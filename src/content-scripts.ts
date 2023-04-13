import createExt from '@/scripts/app'
import { getImgData } from './hooks/useSrhImg'

declare enum PLAT{
  taobao='TM'
}

const url = location.href.replace(/\?.*$/, '')
// 匹配平台
const matchPlat = (url: string) => {
  const match = /[^?]*\.(taobao\.|tmall\.|1688\.|amazon\.|aliexpress\.|rakuten\.|yahoo\.|pinduoduo\.|coupang\.|gmarket\.|11st\.|theckb\.)/
  const word = (url.match(match) || [])[1] ?? ''
  return word.slice(0, -1)
}
const plat = matchPlat(url)

// 是否商品详情页
const matchProduct = (plat: string) => {
  const t = {
    1688: 'detail',
    taobao: 'item',
    tmall: 'detail'
  }
  return (plat in t) && url.includes(t[plat as '1688'])
}
const isProduct = matchProduct(plat)

getImgData()

if (plat) {
  console.log(plat)
  console.log(PLAT)
  const connects = ['theckb']
  if (connects.includes(plat)) {

  } else {
    createExt(plat, isProduct)
  }
}
