import { defineStore } from 'pinia'
import usePlat from './usePlat'
import $ from 'jquery'
import { sendMessage } from '@/hooks/useExt'
import { encodeToGb2312HexList as encodeGbk } from 'gb2312-hex'

export default defineStore('search', () => {
  /**
   * 匹配图片元素
   * @param tar
   * @param x
   * @param y
   * @returns
   */
  const matchImg = (tar: obj, x: number, y: number) => {
    const name = usePlat().plat
    let t: {
      rect: { left: number, top: number, height: number, width: number },
      src: string
    } | undefined
    const parent = $(tar).parent()
    let imgs: obj[] = [...parent.find('img')]
    if (name === 'rakuten') {
      imgs = [...parent.find('a.image'), ...imgs]
    }
    if (name === '1688') {
      imgs = [...parent.find('.img'), ...imgs]
    }
    // rules
    imgs.find(v => {
      let src = ''
      // 使用 background 的商品图片
      if (v.nodeName !== 'IMG') {
        src = ($(v).css('background').match(/url\((.*)\)/) || '')[1]?.slice(1, -1)
        if (!src) return
      } else {
        src = v.src
      }
      // 在直行便中，商品图片的 data-goods 值是 ''
      if (name === 'theckb') {
        if (v.dataset.goods ?? true) return
      }
      // 图片大小
      const { left, top, height, width } = v.getBoundingClientRect()
      if (height < 80 || width < 80) return
      if (height * width > 760 * 760) return
      if (left > x || left + width < x || top > y || top + height < y) return
      //
      t = {
        rect: { left, top, height, width },
        src
      }
      return true
    })
    return t
  }
  /**
   * 解析图片url
   * @param url
   * @returns
   */
  const parseUrl = (url:string) => {
    const name = usePlat().plat
    const reg = /.(png|jpg|jpeg|bmp|webp)$/
    url = url.replace(/\?.+$/, '')
    const type = (url.match(reg) || [''])[1]
    // 1688规则
    if (type === 'webp' && name === '1688') {
      const i = url.indexOf('jpg') + 3
      url = url.slice(0, i)
    }
    // 速卖通、淘宝 图片规则
    if (type === 'webp') {
      url = url.replace(/_\.webp/, '')
    }
    return url
  }
  //
  const hostForSrch: obj<string> = {
    1688: 'https://s.1688.com/selloffer/offer_search.htm?keywords=',
    taobao: 'https://s.taobao.com/search?q=',
    tmall: 'https://list.tmall.com/search_product.htm?q='
  }
  /**
   * 搜索关键词
   * @param word
   * @returns
   */
  const searchWord = async (word: string) => {
    const name = usePlat().plat
    console.log(word)
    const plat = name in hostForSrch ? name : '1688'
    word = word.trim().replace(/\s/g, '+')
    if (!word) return false
    const w = await sendMessage<string>('langToZh', word).then(res => res || word)
    console.log(w)
    // 将中文转为gb内码
    const s = plat === '1688' ? '%' + encodeGbk(w).join('%') : w
    window.open(hostForSrch[plat] + s)
    return true
  }
  return {
    matchImg,
    parseUrl,
    searchWord
  }
})
