import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import $ from 'jquery'
import { PLATS } from '@/hooks/const'
import { until, anagrams } from '@/hooks/utils'
import { getSrcWin, $async, sendMessage } from '@/hooks/useExt'
import { getUrlParams, historyParams } from '@/hooks/useUrl'
import md5 from 'md5'
import { tmGoodsApi } from '@/hooks/useApi'
import { msg } from '@/plugins/ant'

declare global {
  type Product = {
    version: number
    shopName: string
    productUrl: string
    productCode: string
    productName: string
    productCate: string
    productMainImg: string
    skuMap?: obj
  }

  type Sku = {
    decode: string,
    productSku: string,
    productPropertiesName: string,
    productSkuImg: string,
    productSellPrice: string
  }

  type Orders = (Sku & { orderQuantity: number })[]
}

enum PKey {
  ali88 = 'AM',
  taobao = 'TB',
  tmall = 'TM'
}

const noSku = 'noSku'

export default defineStore('product', () => {
  const product = reactive<Product>({
    version: 1,
    shopName: '',
    productUrl: '',
    productCode: '',
    productName: '',
    productCate: '',
    productMainImg: ''
  })
  const skuMap = reactive<obj<Sku>>({})
  const container = ref<JQuery>()

  let plat: string
  let pkey: string

  /**
   * 1688
   */
  const parse1688 = async () => {
    const { skuModel, tempModel, images, orderParamModel } = await getSrcWin<obj>('_GLOBALDATA')
    product.productCode = `${pkey}-${tempModel.offerId}`
    product.productName = document.title
    product.productCate = tempModel.postCategoryId
    product.productMainImg = images ? images[0]?.fullPathImageURI : (await until(() => $('.detail-gallery-img:only-child').attr('src')))
    product.shopName = (await $async('#hd_0_container_0 [title]')).attr('title') ?? ''
    skuModel.orderParamModel = orderParamModel
    product.skuMap = skuModel
    container.value = await $async('.order-button-children')
    container.value.css('display', 'block')
  }
  const createSku1688 = () => {
    const map = product.skuMap?.skuInfoMap as obj
    const props = product.skuMap?.skuProps as obj[]
    // console.log(props)
    // console.log(map)
    const scalePrice = product.skuMap?.skuPriceScale?.split('-').pop() || '0'
    if (map.length === 0) {
      const decode = product.productCode
      skuMap[noSku] = {
        decode,
        productSku: md5(decode),
        productPropertiesName: '规格:默认',
        productSkuImg: '',
        productSellPrice: scalePrice
      }
    } else {
      const propMap: obj<string> = {}
      props.forEach(item => {
        const { prop, value } = item
        value.forEach((v: obj<string>) => {
          const { imageUrl, name } = v
          propMap[name] = `${prop}:${name}`
          if (imageUrl) {
            propMap[`img-${name}`] = imageUrl
          }
        })
      })
      Object.entries(map).forEach(([key, item]) => {
        const { skuId, discountPrice, price } = item
        const decode = `${product.productCode}${skuId}`
        const names = key.split('&gt;')
        skuMap[key] = {
          decode,
          productSku: md5(decode),
          productPropertiesName: names.map(v => propMap[v]).join(';'),
          productSkuImg: names.reduce((acc, v) => acc || propMap[`img-${v}`], '') ?? '',
          productSellPrice: discountPrice || price || scalePrice
        }
      })
    }
    // console.log(skuMap)
  }
  // 1688需要点击sku弹窗
  const trigger1688 = (close?: boolean) => {
    if (close) return $('.order-has-select-button').trigger('click')
    return new Promise((resolve) => {
      if ($('.selected-list-wrapper .selected-item-wrapper').length) {
        resolve(1)
      } else {
        $('.order-has-select-button').trigger('click')
        setTimeout(() => {
          resolve(1)
        }, 100)
      }
    })
  }
  const matchSku1688 = async () => {
    await trigger1688()
    const orderList:Orders = []
    if (skuMap[noSku]) {
      const num = parseInt(($('.total-count').html()?.match(/\d+/) || [''])[0])
      orderList.push({
        ...skuMap[noSku],
        orderQuantity: num
      })
    } else {
      const trs = $('.selected-list-wrapper .selected-item-wrapper')
      trs.each((i, tr) => {
        const firstName = $(tr).find('.name').html()
        const lis = $(tr).find('.children-item .children-wrapper')
        lis.each((i, li) => {
          const names = [firstName]
          const name = $(li).find('span').attr('title')
          if (name) {
            names.push(name)
          }
          const skuKey = names.join('&gt;')
          if (skuMap[skuKey]) {
            orderList.push({
              ...skuMap[skuKey],
              orderQuantity: parseInt(($(li).find('span').text().match(/\((\d+)\)$/) ?? '')[1])
            })
          }
        })
      })
    }
    trigger1688(true)
    return orderList
  }
  /**
   * 淘宝
   */
  const sliceImgUrl = (str?:string) => str?.replace(/_\d+x\d+.*?\..*$/, '')
  const parseTb = async () => {
    product.productCode = `${pkey}-${historyParams.id}`
    const cate = (((await until(() => $('script[exparams]').attr('exparams'))).match(/category=item(.+?)&/) ?? [])[1]).replace(/%.{2}/, '')
    product.productCate = cate
    product.productName = document.title.replace(/-淘宝网$/, '')
    const img = await until(() => $('.tb-pic img').attr('src'))
    product.productMainImg = sliceImgUrl(img) ?? ''
    product.shopName = await until(() => $('.shop-name-title[title]').attr('title') || $('.tb-shop-name [title]').attr('title'))
    product.skuMap = (await getSrcWin<obj>('Hub?.config?.config?.sku?.valItemInfo')).skuMap
    container.value = await $async('.tb-skin')
  }
  const assemble = (props:(obj<string>[])[]) => {
    return props.reduce<obj[]>((acc, v) => {
      const res:obj[] = []
      acc.forEach(v2 => {
        v.forEach(v3 => {
          res.push({
            value: v2.value.concat(v3.value),
            propName: v2.propName + ';' + v3.propName,
            img: v2.img ?? v3.img
          })
        })
      })
      return res
    }, [{ value: [], propName: '' }])
  }
  const assort = (t:obj[], map:obj<{skuId:string}>, temp:fn = v => v, keyback:fn = skuId => skuId) => {
    // console.log(t)
    // console.log(map)
    t.forEach(v => {
      const { value, propName, img } = v
      const keys = anagrams(v.value)
      keys.some(v => {
        const key = temp(v.join(';'))
        if (map[key]) {
          const { skuId } = map[key]
          const decode = `${product.productCode}${skuId}`
          // 用value保证prop的顺序一致 从上到下
          skuMap[keyback(skuId, value, propName)] = {
            decode,
            productSku: md5(decode),
            productPropertiesName: propName,
            productSkuImg: img,
            productSellPrice: '0'
          }
          return true
        }
      })
    })
  }
  const createSkuTb = () => {
    const map = product.skuMap
    if (!map) {
      const decode = product.productCode + '0'
      skuMap[noSku] = {
        decode,
        productSku: md5(decode),
        productPropertiesName: '规格:默认',
        productSkuImg: '',
        productSellPrice: $('#J_PromoPriceNum').html() || '0'
      }
    } else {
      const props: obj[][] = []
      $('[data-property]').each((i, v) => {
        const prop:obj[] = []
        const name = $(v).attr('data-property')
        $('li', v).each((i, v2) => {
          const value = $(v2).attr('data-value')
          const nameValue = $('a span', v2).html()
          const a = ($('a', v2).css('background').match(/url\("(.*)"\)/) ?? [])[1]
          prop.push({
            value,
            propName: `${name}:${nameValue}`,
            img: sliceImgUrl(a)
          })
        })
        props.push(prop)
      })
      const t = assemble(props)
      assort(t, map, v => `;${v};`, (skuId, propValue) => propValue.join(';'))
    }
    console.log(skuMap)
  }
  const matchSkuTb = ():Orders => {
    const num = parseInt($('#J_IptAmount').val() as string)
    if (skuMap[noSku]) {
      return [{
        ...skuMap[noSku],
        orderQuantity: num
      }]
    } else {
      const selected = [...$('.J_Prop .tb-selected')]
      const key = selected.map((v) => $(v).attr('data-value')).join(';')
      if (skuMap[key]) {
        return [{
          ...skuMap[key],
          productSellPrice: $('#J_PromoPriceNum').text(),
          orderQuantity: num
        }]
      } else {
        return []
      }
    }
  }
  /**
   * 天猫
   */
  const parseTm = async () => {
    // location.href.match('itemo.html')
    product.version = location.href.includes('item.htm') ? 2 : 1
    const upt = product.version === 2
    product.productCode = `${pkey}-${historyParams.id}`
    product.productName = document.title.replace(/-tmall.*$/, '')
    const cate = (((await until(() => $('script[exparams]').attr('exparams'))).match(/category=item(.+?)&/) ?? [])[1]).replace(/%.{2}/, '')
    product.productCate = cate
    if (upt) {
      product.productMainImg = await until(() => $('[class*="PicGallery--thumbnail"] img').attr('src'))
      product.shopName = await until(() => $('[class*="ShopHeader--title"]').attr('title'))
    } else {
      product.productMainImg = await until(() => $('#J_UlThumb img').attr('src'))
      product.shopName = await until(() => $('.shopLink').html())
    }
    product.skuMap = {}
    container.value = await until(() => upt ? $('[class*="BasicContent--itemInfo"]') : $('.tb-sku .tb-action'))
  }
  const createSkuTm = async () => {
    const { props, skus } = await tmGoodsApi()
    console.log(props, skus)
    if (skus?.length === 0) {
      const decode = product.productCode + '0'
      skuMap[noSku] = {
        decode,
        productSku: md5(decode),
        productPropertiesName: '规格:默认',
        productSkuImg: '',
        productSellPrice: $('[class*="Price--extraPriceText"]').html() || $('[class*="Price--priceText"]').html() || '0'
      }
    } else if (props && skus) {
      const map = skus.reduce<obj<{skuId:string}>>((acc, { propPath, skuId }) => {
        acc[propPath] = { skuId }
        return acc
      }, {})
      const tmProps: obj[][] = []
      props.forEach(v => {
        const { pid, name, values } = v
        const prop:obj[] = []
        values.forEach((v:obj) => {
          const { name: nameValue, vid, image } = v
          prop.push({
            value: pid + ':' + vid,
            propName: `${name}:${nameValue}`,
            img: image
          })
        })
        tmProps.push(prop)
      })
      const t = assemble(tmProps)
      assort(t, map)
    } else {
      msg.error('读取商品sku失败')
      canBuy.value = false
    }
    console.log(skuMap)
  }
  const matchSkuTm = () => {
    const orderQuantity = parseInt($('input.countValueForPC').val() as string)
    if (skuMap[noSku]) {
      return [{
        ...skuMap[noSku],
        orderQuantity
      }]
    } else {
      const key = getUrlParams().skuId as string
      if (skuMap[key]) {
        return [{
          ...skuMap[key],
          productSellPrice: $('[class*="Price--extraPriceText"]').html() || $('[class*="Price--priceText"]').html() || '0',
          orderQuantity
        }]
      } else {
        return []
      }
    }
  }
  const exec:obj<fn> = {
    parse: () => null,
    createSku: () => null,
    matchSku: () => null
  }
  const parse = () => exec.parse()
  const createSku = () => exec.createSku()
  const matchSku = () => exec.matchSku()
  /**
   * 根据不同平台重新注册 parse、createSku、matchSku 函数
   * init 后才会挂载整个组件
   * @param platName
  */
  const init = async (platName: string) => {
    product.productUrl = location.href
    plat = platName
    const t = {
      [PLATS.ali88]: {
        pkey: PKey.ali88,
        parse: parse1688,
        createSku: createSku1688,
        matchSku: matchSku1688
      },
      [PLATS.taobao]: {
        pkey: PKey.taobao,
        parse: parseTb,
        createSku: createSkuTb,
        matchSku: matchSkuTb
      },
      [PLATS.tmall]: {
        pkey: PKey.tmall,
        parse: parseTm,
        createSku: createSkuTm,
        matchSku: matchSkuTm
      }
    }[plat]
    pkey = t.pkey
    exec.parse = t.parse
    exec.createSku = t.createSku
    exec.matchSku = t.matchSku
    await parse()
    await createSku()
    await queryCanBuy()
  }
  /**
   * 能否加购
   * @returns
   */
  const canBuy = ref(false)
  const queryCanBuy = async () => {
    const cateId = product.productCate
    if (!cateId) {
      canBuy.value = false
    } else {
      canBuy.value = await sendMessage('http', ['canBuy', { cate_code: cateId, platform_code: plat }]).then(res => !res)
    }
  }
  /**
   *
   * @returns
   */
  const addCart = async () => {
    const orderList: Orders = []
    try {
      orderList.push(...await matchSku())
      if (!orderList.length) {
        msg.error('未选择商品规格')
        return
      }
    } catch (err) {
      console.log(err)
      msg.error('添加商品失败')
      return
    }
    const isNull = orderList.some(v => !v.orderQuantity)
    if (isNull) {
      msg.error('商品数量不能为空')
      return
    }
    console.log(orderList)
    const data = {
      addCartSource: 1,
      url: product.productUrl,
      cartGroupName: product.shopName,
      commonProductItemList: orderList.map(v => {
        return {
          ...v,
          productCode: product.productCode,
          productTitle: product.productName,
          productMainImg: sliceImgUrl(product.productMainImg),
          noAdditionalFlag: 0
        }
      })
    }
    return sendMessage('http', ['addCart', data]).then(res => {
      console.log(res)
      res === null ? msg.success('添加商品成功') : msg.error('添加商品失败')
    })
  }
  return {
    init,
    container,
    product,
    canBuy,
    matchSku,
    addCart
  }
})
