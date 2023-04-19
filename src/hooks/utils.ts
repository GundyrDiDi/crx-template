import { ref, Ref } from 'vue'
/**
 * 可以用于获取DOM元素，需要确保一定有值
 * @param fn
 * @param interval default 100
 * @returns
 */
export const until = async <T>(fn: () => T | undefined | null, interval = 100): Promise<T> => {
  // eslint版本过低导致
  const res: any = await fn()
  if (res === null || res === undefined || (typeof res === 'object' && 'length' in res && res.length === 0)) {
    return wait(interval).then(() => until(fn, interval))
  } else {
    return res
  }
}

/**
 *
 * @param fn 返回真值则停止
 * @param interval default 1000
 * @returns
 */
export const startLoop = async <T extends () => unknown>(fn: T, interval = 1000) => {
  return new Promise((resolve, reject) => {
    const t1 = () => setTimeout(async () => {
      try {
        const res = await fn()
        res ? resolve(res) : t1()
      } catch (err) {
        reject(err)
      }
    }, interval)
    t1()
  })
}

export const cancelTimes = (fn: fn, times = 2) => {
  let count = 0
  let timer: number | null
  return () => {
    count++
    if (!timer) {
      timer = setTimeout(() => {
        count % times && fn()
        count = 0
        timer = null
      }, 300)
    }
  }
}

export const useLoading = <T extends unknown[], R> (fn: pfn<T, R>, loading: Ref<boolean> = ref(false))
    : [pfn<T, R>, Ref<boolean>] => {
  return [
    async (...args) => {
      loading.value = true
      const result = await fn(...args)
      loading.value = false
      return result
    },
    loading
  ]
}

/**
 *
 * @param time
 * @param promise
 * @returns
 */
export const wait = <T>(time = 1000, promise?: Promise<T>) => {
  let delay = new Promise(resolve => {
    setTimeout(() => {
      resolve(time)
    }, time)
  })
  if (promise instanceof Promise) {
    delay = Promise.all([promise, delay]).then(res => res[0])
  }
  return delay
}

/**
 * 异步任务
 * @returns
 */
export const asyncTask = (): [Promise<unknown>, (v: unknown) => void] => {
  let finish!: (v: unknown) => void
  const task = new Promise(resolve => {
    finish = resolve
  })
  return [task, finish]
}

export const injectTask = <T extends unknown[], R>(fn: (...rest: T) => Promise<R>) => {
  const [task, finish] = asyncTask()
  const wrap = async (...rest: T) => {
    const t = await fn(...rest)
    finish(true)
    return t
  }
  wrap.$task = task
  return wrap
}

/**
 * 异位词排列
 * @param arr
 * @returns
 */
export const anagrams = <T>(arr: T[]) => {
  if (arr.length <= 2) return arr.length === 1 ? [arr] : [arr, [arr[1], arr[0]]]
  return arr.reduce((acc, item, i) => {
    anagrams([...arr.slice(0, i), ...arr.slice(i + 1)]).forEach(s => acc.push([item, ...s]))
    return acc
  }, [] as T[][])
}

export const isUrl = (url: string) => /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/.test(url)
