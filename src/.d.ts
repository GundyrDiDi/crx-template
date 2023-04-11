type SData = {
  cmd: string,
  data?: any
}

type RData<T> = Promise<{
  code: string
  data: T
} | null>

declare enum SearchPlat {
  ali88 = '1688',
  taobao = 'taobao'
}

type SPlat = '1688' | 'taobao'

//
type obj<T = any> = Record<string, T>

type fn<T extends any[] = any[], R = any> = (...rest: T) => R

type pfn<T extends any[] = any[], R = any> = fn<T, Promise<R>>

type wrapFn<T extends fn> = (...args: Parameters<T>) => ReturnType<T>

type then<T = any> = T extends Promise<infer P> ? then<P> : T

type thenFn<T extends fn | pfn> = (...args: Parameters<T>) => then<ReturnType<T>>

type thenRes<T extends pfn> = then<ReturnType<T>>