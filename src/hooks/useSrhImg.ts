import http from '@/plugins/axios'
import { sendMessage } from '@/hooks/useExt'
import { historyParams } from '@/hooks/useUrl'
import { useCookies } from '@vueuse/integrations/useCookies'
import md5 from 'md5'

/**
 * 读取图片
 * 打开平台地址
 * 获取图片源数据
 * 调取接口
 */

export const readImg = async (url: string, sPlat: SPlat) => {
  const res = await sendMessage<string>('readImg', url)
  // 提示读取错误
  if (!res) return
  jumpTo(res, sPlat)
  return true
}

export const jumpTo = (imgKey: string, sPlat: SPlat) => {
  const map = {
    1688: 'https://www.1688.com/',
    taobao: 'https://s.taobao.com/',
    pinduoduo: 'https://pifa.pinduoduo.com/'
  }
  const url = map[sPlat] + `?sniffimg=${imgKey}&source=${sPlat}`
  window.open(url)
}

export const getImgData = () => {
  const { sniffimg, source } = historyParams
  // todo:等待遮罩层
  if (sniffimg) {
    sendMessage<string>('getImg', sniffimg).then(res => {
      if (!res) return
      searchImg(res, source as SPlat)
    })
  }
}

export const searchImg = async (base64: string, sPlat: SPlat) => {
  const t = await search1688(base64)
  return t
}

export const TBSign = (data: string) => {
  const cookies = useCookies()
  const token = (cookies.get('_m_h5_tk') ?? cookies.get('_m_h5_tk_enc') ?? '').split('_')[0]
  const t = Date.now()
  const appKey = 12574478
  return {
    jsv: '2.4.11',
    appKey,
    t,
    sign: md5(`${token}&${t}&${appKey}&${data}`),
    api: 'mtop.1688.imageService.putImage',
    ecode: 0,
    v: '1.0',
    type: 'originaljson',
    dataType: 'jsonp'
  }
}

export const search1688 = (base64: string) => {
  const data = JSON.stringify({
    imageBase64: base64.replace(/^data:image\/.+;base64,/, ''),
    appName: 'searchImageUpload',
    appKey: 'pvvljh1grxcmaay2vgpe9nb68gg9ueg2'
  })
  return http({
    url: 'https://h5api.m.1688.com/h5/mtop.1688.imageservice.putimage/1.0/',
    method: 'post',
    params: TBSign(data),
    data: new URLSearchParams({ data })
  }).then(res => {
    if (res.data.data.imageId) {
      location.replace(`https://s.1688.com/youyuan/index.htm?tab=imageSearch&imageAddress=&imageId=${res.data.data.imageId}`)
      return true
    } else {
      throw new Error(JSON.stringify(res))
    }
  })
}

export const searchTb = (base64: string) => {
  return base64
}
