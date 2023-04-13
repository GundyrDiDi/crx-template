import { createPinia, StoreActions } from 'pinia'
import { useDebounceFn } from '@vueuse/core'

declare module 'pinia' {
    export interface PiniaCustomProperties<Id, S, G, A> {
        get: <K extends keyof S>(key: K) => S[K]
        set: <K extends keyof S>(key: K, val: S[K]) => S[K]
    }
    export interface DefineStoreOptionsBase<S, Store> {
        debounce?: Partial<Record<keyof StoreActions<Store>, number>>
    }
}

const pinia = createPinia()

// get/set
pinia.use(({ store }) => {
  return {
    get: (key) => store.$state[key],
    set: (key, val) => (store.$state[key] = val)
  }
})

// 防抖 plugins
pinia.use(({ options, store }) => {
  if (options.debounce) {
    // 封装原有的action并替换
    return Object.keys(options.debounce).reduce<Partial<StoreActions<typeof store>>>((debouncedFns, a) => {
      debouncedFns[a] = useDebounceFn(store[a], options.debounce![a])
      return debouncedFns
    }, {})
  }
})

// 鉴权
pinia.use(({ options, store }) => {
  //
})

export default pinia
