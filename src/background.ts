import './service-worker/store'
import http from './service-worker/fetch'

chrome.runtime.onMessage.addListener(function (request:any, sender:any, sendResponse:any) {
  // 不能传输函数
  Promise.resolve()
    .then(() => dispatch[request.cmd](request, sender))
    .then(res => sendResponse(res))
    .catch(e => sendResponse({ error: 'background error', res: e, request }))
    // 异步返回必须先返回true
  return true
})

const dispatch:any = {}
