import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import $ from 'jquery'
import { PLATS } from '@/hooks/const'
import { until } from '@/hooks/utils'
import { getSrcWin, $async } from '@/hooks/useExt'
import { getUrlParams, historyParams } from '@/hooks/useUrl'

declare global {
  type Product = {
    version: number
    shopName: string
    productUrl: string
    productCode: string
    productName: string
    productCate: string
    productMainImg: string
    skuMap?: Record<string, any>
  }
}

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
  const container = ref<JQuery>()
  const init = async (plat: string) => {
    product.productUrl = location.href
    const parse = {
      [PLATS.ali88]: parse1688,
      [PLATS.taobao]: parseTb,
      [PLATS.tmall]: parseTm
    }[plat]
    parse && await parse()
  }
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
    //
  }
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
  const createSku = () => {
    //
  }
  return {
    init,
    container,
    product
  }
})
