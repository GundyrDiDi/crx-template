import { defineStore } from 'pinia'
// import { ref } from 'vue'
import usePdt from './usePdt'
import { connect, sendMessage } from '@/hooks/useExt'
import { throwed } from '@/hooks/useParabola'
import { msg } from '@/plugins/ant'
import useAuth from './useAuth'

export default defineStore('sheet', () => {
  const sheetSkus = connect('sheetSkus', '')
  const googleUrl = connect('googleUrl', '')
  const waiting = connect('waiting', false)

  const changeUrl = async (googleUrl:string) => {
    console.log(googleUrl)
    const reg = /docs.google.com\/.+\/d\/.+$/
    if (!reg.test(googleUrl)) {
      msg.error('无效内容')
      return
    }
    const customerId = await sendMessage('read', 'customerId')
    const res = await sendMessage('http', ['setGoogleSheet', { googleUrl, customerId }])
    if (res) {
      await sendMessage('write', { googleUrl })
      // 替换后更新谷歌表
      sendMessage('updateSheet')
      msg.success('绑定成功')
      return true
    } else {
      // msg.error('绑定失败')
    }
  }

  const { flow } = useAuth()
  const hasUrl = flow.isLogin.add(async (ctx, next) => {
    if (!googleUrl.value) {
      msg.error('未绑定谷歌表')
    } else {
      await next()
      // sendMessage('updateSheet')
    }
  })

  const { matchSku, product } = usePdt()

  const addSku = hasUrl.add(async (ctx, next, e: MouseEvent) => {
    const skus = matchSku().map((v:Orders[0]) => {
      return {
        time: Date.now(),
        photoUrl: v.productSkuImg || product.productMainImg,
        productName: product.productName,
        productUrl: product.productUrl,
        productSpecification: v.productPropertiesName,
        quantity: v.orderQuantity
      }
    })
    console.log(skus)
    // 触发加购动画
    await throwed(skus[0].photoUrl, [e.x, e.y])
    //
    sendMessage('updateSheet', { add: skus })
    msg.success('写入成功')
  })

  const delSku = hasUrl.add((ctx, next, sku) => {
    //
  })

  return {
    googleUrl,
    sheetSkus,
    waiting,
    changeUrl,
    addSku,
    delSku
  }
})
