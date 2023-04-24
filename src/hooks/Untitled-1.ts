// import http from '@/plugins/axios'
import { useCookies } from '@vueuse/integrations/useCookies'
import md5 from 'md5'
// import { historyParams } from '@/hooks/useUrl'

export const TBSign = (data: string, token: string) => {
  // const cookies = useCookies()
  // const token = (cookies.get('_m_h5_tk') ?? cookies.get('_m_h5_tk_enc') ?? '').split('_')[0]
  // const t = Date.now()
  const t = 1682324977235
  // const token = '16d778daeff98620e42efced74dba63b'
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
    data
  }
}

// jsv: 2.6.1
// appKey: 12574478
// t: 1682324977235
// sign: 1448930d3996332d2bc1e577ae152c13
// api: mtop.taobao.pcdetail.data.get
// v: 1.0
// isSec: 0
// ecode: 0
// timeout: 10000
// dataType: json
// valueType: string
// ttid: 2022@taobao_litepc_9.17.0
// AntiFlood: true
// AntiCreep: true
// preventFallback: true
// type: json
// data: {"id":"598265939499","detail_v":"3.3.2","exParams":"{\"de_count\":\"1\",\"id\":\"598265939499\",\"pvid\":\"07478e57-f53b-46ba-8a1d-f7566a47af95\",\"scm\":\"1007.40986.275655.0\",\"spm\":\"a21bo.jianhua.201876.2.5af911d9YvSDvH\",\"queryParams\":\"de_count=1&id=598265939499&pvid=07478e57-f53b-46ba-8a1d-f7566a47af95&scm=1007.40986.275655.0&spm=a21bo.jianhua.201876.2.5af911d9YvSDvH\",\"domain\":\"https://detail.tmall.com\",\"path_name\":\"/item.htm\"}"}

// _m_h5_tk=bd4930569b43f1d17d2c7bb899aa53e3_1682335211539
// _m_h5_tk_enc=16d778daeff98620e42efced74dba63b

const data = {
  id: '598265939499',
  detail_v: '3.3.2',
  exParams: JSON.stringify({
    de_count: '1',
    id: '598265939499',
    pvid: '07478e57-f53b-46ba-8a1d-f7566a47af95',
    scm: '1007.40986.275655.0',
    spm: 'a21bo.jianhua.201876.2.5af911d9YvSDvH',
    queryParams: 'de_count=1&id=598265939499&pvid=07478e57-f53b-46ba-8a1d-f7566a47af95&scm=1007.40986.275655.0&spm=a21bo.jianhua.201876.2.5af911d9YvSDvH',
    domain: 'https://detail.tmall.com',
    path_name: '/item.htm'
  })
}

// 1448930d3996332d2bc1e577ae152c13
console.log(
  TBSign(JSON.stringify(data), 'bd4930569b43f1d17d2c7bb899aa53e3').sign
)
console.log(
  TBSign(JSON.stringify(data), 'bd4930569b43f1d17d2c7bb899aa53e3_1682335211539').sign
)
console.log(
  TBSign(JSON.stringify(data), '16d778daeff98620e42efced74dba63b').sign
)
