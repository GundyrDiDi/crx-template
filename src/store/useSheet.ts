import { defineStore } from 'pinia'
import { watch } from 'vue'
import usePdt from './usePdt'
import { connect, sendMessage, read, write, http } from '@/hooks/useExt'
import { throwed } from '@/hooks/useParabola'
import { msg } from '@/plugins/ant'
import useAuth from './useAuth'
import dayjs from 'dayjs'

export default defineStore('sheet', () => {
  const sheetSkus = connect<obj[]>('sheetSkus', [])
  const googleUrl = connect('googleUrl', '')
  const waiting = connect('waiting', false)

  const changeUrl = async (googleUrl:string) => {
    console.log(googleUrl)
    const reg = /docs.google.com\/.+\/d\/.+$/
    if (!reg.test(googleUrl)) {
      msg.error('无效内容')
      return
    }
    const customerId = await read('customerId')
    const res = await http('setGoogleSheet', { googleUrl, customerId })
    if (res) {
      await write({ googleUrl })
      msg.success('绑定成功')
      return true
    } else {
      // msg.error('绑定失败')
    }
  }

  const { flow, onUserChange } = useAuth()

  onUserChange(v => {
    if (!v)write({ googleUrl: '' })
  })
  watch(googleUrl, () => {
    sendMessage('updateSheet')
  })

  const hasUrl = flow.isLogin.add(async (ctx, next) => {
    if (!googleUrl.value) {
      msg.error('未绑定谷歌表')
    } else {
      waiting.value = true
      await write({ waiting: true })
      await next()
      waiting.value = false
      await write({ waiting: false })
    }
  })

  /** 加购时使用 */
  const { matchSku, product } = usePdt()
  const addSku = hasUrl.add(async (ctx, next, e: MouseEvent) => {
    const add = matchSku().map((v:Orders[0]) => {
      return {
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        photoUrl: v.productSkuImg || product.productMainImg,
        productName: product.productName,
        productUrl: product.productUrl,
        productSpecification: v.productPropertiesName,
        quantity: v.orderQuantity
      }
    })
    if (!add.length) {
      msg.error('未选择商品规格')
      return
    }
    // 触发加购动画
    await throwed(add[0].photoUrl, [e.x, e.y])

    const res = await sendMessage('updateSheet', { add })
    if (res) {
      sheetSkus.value.unshift(...add)
      write({ sheetSkus: sheetSkus.value })
      msg.success('写入成功')
    } else {
      msg.success('写入失败')
    }
  })

  /** 删除sku */
  const delSku = hasUrl.add(async (ctx, next, index:number) => {
    const skus = sheetSkus.value
    const t = skus[index]
    const del = {
      timeHeader: t.time,
      skuNameHeader: t.productSpecification
    }
    const res = await sendMessage('updateSheet', { del })
    if (res) {
      skus.splice(index, 1)
      write({ sheetSkus: skus })
    } else {
      msg.success('删除失败')
    }
  })

  // 初始化后获取skus
  sendMessage('updateSheet')

  return {
    googleUrl,
    sheetSkus,
    waiting,
    changeUrl,
    addSku,
    delSku
  }
})
