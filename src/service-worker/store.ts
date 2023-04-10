const storage = chrome.storage.local

interface Store{
  [key:string]:unknown
}
const store:Store = {}

storage.get(store, (res) => {
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
    storage.set({ [key]: val }, () => {
      return val
    })
  })
