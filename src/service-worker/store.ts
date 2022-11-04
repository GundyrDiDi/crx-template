const storage = chrome.storage.local

const store:any = {}

storage.get(store, (res:any) => {
  Object.keys(store).forEach(key => {
    if (!res[key]) {
      storage.set({ [key]: store[key] })
    }
  })
})

const read = (key:string):Promise<any> =>
  new Promise(resolve =>
    storage.get([key], res => {
      resolve(res[key])
    })
  )

const write = (key:string, val:any) =>
  Promise.resolve(() => read(key)).then(old => {
    if (old === val) return val
    storage.set({ [key]: val }, res => {
      return val
    })
  })
