import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import $ from 'jquery'
import { PLATS } from '@/hooks/const'
import { until } from '@/hooks/utils'
import { getSrcWin, $async, sendMessage } from '@/hooks/useExt'
import { getUrlParams, historyParams } from '@/hooks/useUrl'
import md5 from 'md5'

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
    const { skuModel, tempModel, images, orderParamModel } = await getSrcWin<any>('__GLOBAL_DATA')
    product.productCode = tempModel.offerId
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
    const scalePrice = product.skuMap?.skuPriceScale?.split('-').pop() ?? '0'
    if (map.length === 0) {
      const decode = `${pkey}-${product.productCode}`
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
        const decode = `${pkey}-${product.productCode}${skuId}`
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
  }
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
    console.log(orderList)
    trigger1688(true)
    return orderList
  }
  /**
   * 淘宝
   */
  const parseTb = async () => {
    product.productCode = historyParams.id as string
    const cate = (((await until(() => $('script[exparams]').attr('exparams'))).match(/category=item(.+?)&/) ?? [])[1]).replace(/%.{2}/, '')
    product.productCate = cate
    product.productName = document.title.replace(/-淘宝网$/, '')
    const img = await until(() => $('.tb-pic img').attr('src')?.replace(/_\d+x\d+.*?\..*$/, ''))
    product.productMainImg = img ?? ''
    product.shopName = await until(() => $('.shop-name-title[title]').attr('title') || $('.tb-shop-name [title]').attr('title'))
    product.skuMap = (await getSrcWin<any>('Hub?.config?.config?.sku?.valItemInfo')).skuMap
    container.value = await $async('.tb-skin')
  }
  const createSkuTb = () => {
    //
  }
  const matchSkuTb = () => {
    //
  }
  /**
   * 天猫
   */
  const parseTm = async () => {
    product.version = location.href.includes('item.htm') ? 2 : 1
    const upt = product.version === 2
    product.productCode = historyParams.id as string
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
  const createSkuTm = () => {
    //
  }
  const matchSkuTm = () => {
    //
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
    // 1688需要点击sku弹窗
    try {
      orderList.push(...await matchSku())
      if (!orderList.length) {
        // msg.error('未选择商品规格')
        return
      }
    } catch (err) {
      //
      console.log(err)
      // msg.error('添加商品失败')
      return
    }
    const isNoQuantity = false
    // const data = {
    //     addCartSource: 1,
    //     url: product.productUrl,
    //     cartGroupName: product.shopName,
    //     commonProductItemList: skuList.map(v => {
    //         !v.orderQuantity && (isNoQuantity = true)
    //         return {
    //             ...v,
    //             productCode: platKey.value + '-' + product.productCode,
    //             productSkuImg: v.productSkuImg.replace(/_\d+x\d+.[^\.]+?$/, ''),
    //             productTitle: product.productName,
    //             productMainImg: product.productMainImg,
    //             noAdditionalFlag: 0
    //         }
    //     })
    // }
    if (isNoQuantity) {
      // msg.error('商品数量不能为空')

    }
    // console.log(data)
    // return sendMessage('http', ['addCart', data]).then(res => {
    //     res ? msg.success('添加商品成功') : msg.error('添加商品失败')
    // })
  }
  return {
    init,
    container,
    product,
    canBuy,
    addCart
  }
})
