import { defineStore } from 'pinia'
import { ref } from 'vue'
import usePdt from './usePdt'
import { connect, sendMessage } from '@/hooks/useExt'
import { throwed, points } from '@/hooks/useParabola'
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
    console.log(res)
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
      // sendMessage('updateSheet')
    }
    await next()
  })

  const { matchSku, product } = usePdt()

  const addSku = hasUrl.add(async (ctx, next, e:MouseEvent) => {
    const skus = matchSku()
    console.log(skus)
    // const
    points.start = [e.x, e.y]
    console.log(points)
    // 先触发加购动画
    await throwed(skus[0].productSkuImg || product.productMainImg)
    //
    const add = skus
    // sendMessage('updateSheet', { add })
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
