import './service-worker/store'
import http from './service-worker/fetch'

interface Request{
  cmd:string;
  data?:any
}

chrome.runtime.onMessage.addListener(function (request:Request, sender:any, sendResponse:(res:any)=>void) {
  // 不能传输函数
  Promise.resolve()
    .then(() => dispatch[request.cmd](request, sender))
    .then(res => sendResponse(res))
    .catch(e => sendResponse({ error: 'background error', res: e, request }))
    // 异步返回必须先返回true
  return true
})

const dispatch:any = {}
