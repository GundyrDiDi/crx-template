const storage = chrome.storage.local

const store:any = {}

storage.get(store, (res:any) => {
  Object.keys(store).forEach(key => {
    if (!res[key]) {
      storage.set({ [key]: store[key] })
    }
  })
})
