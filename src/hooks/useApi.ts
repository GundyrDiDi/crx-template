/* eslint-disable camelcase */
import http from '@/plugins/axios'
import { useCookies } from '@vueuse/integrations/useCookies'
import md5 from 'md5'
import { getUrlParams } from '@/hooks/useUrl'

export const tbSign = (obj: obj) => {
  const data = JSON.stringify(obj)
  const cookies = useCookies()
  const token = (cookies.get('_m_h5_tk') ?? '').split('_')[0]
  const t = Date.now()
  const appKey = 12574478
  return {
    jsv: '2.6.1',
    appKey,
    t,
    sign: md5(`${token}&${t}&${appKey}&${data}`),
    api: 'mtop.taobao.pcdetail.data.get',
    v: '1.0',
    isSec: 0,
    encode: 0,
    dataType: 'json',
    valueType: 'string',
    ttid: '2022@taobao_litepc_9.17.0',
    AntiFlood: true,
    AntiCreep: true,
    preventFallback: true,
    type: 'json',
    data,
    fromSniff: true
  }
}

export const tmGoodsApi = (): Promise<{ props: obj[], skus: obj[] }> => {
  const query = getUrlParams('history')
  // const api = 'https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/' 失败
  const api = 'https://h5api.m.tmall.com/h5/mtop.taobao.pcdetail.data.get/1.0/'
  const detail_v = '3.3.2'
  const domain = 'https://detail.tmall.com'
  const path_name = 'item.htm'
  const queryParams = location.search.slice(1)
  const obj = {
    id: query.id,
    detail_v,
    exParams: JSON.stringify({
      ...query,
      queryParams,
      domain,
      path_name
    })
  }
  const params = tbSign(obj)
  console.log(params)
  return http.get(api, { params }).then(res => {
    const { props, skus } = res.data?.data?.skuBase ?? {}
    return { props, skus }
  })
}

// const data = {
//   id: '598265939499',
//   detail_v: '3.3.2',
//   exParams: {
//     de_count: '1',
//     id: '598265939499',
//     pvid: '07478e57-f53b-46ba-8a1d-f7566a47af95',
//     scm: '1007.40986.275655.0',
//     spm: 'a21bo.jianhua.201876.2.5af911d9YvSDvH',
//     queryParams: 'de_count=1&id=598265939499&pvid=07478e57-f53b-46ba-8a1d-f7566a47af95&scm=1007.40986.275655.0&spm=a21bo.jianhua.201876.2.5af911d9YvSDvH',
//     domain: 'https://detail.tmall.com',
//     path_name: '/item.htm'
//   }
// }
