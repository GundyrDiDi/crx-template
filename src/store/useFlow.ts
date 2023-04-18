import { defineStore } from 'pinia'

export default defineStore('flow', () => {
  type Ctx = {
    params: unknown[],
    res: unknown,
    i:number
  }

  type Next = <T>(res?:T) => unknown

  type Task=(ctx: Ctx, next: Next, ...rest: any[]) => unknown

  const fns: obj<Task> = {}
  /**
   *
   * @param key
   * @param fn
   */
  const define = (key: string, fn: Task) => {
    fns[key] = fn
  }
  /**
   *
   * @param tasks
   * @returns
   */
  const use = <R>(...tasks: (string|Task)[]) => {
    const flow = <T extends unknown[]>(...rest:T) => new Promise<R>((resolve) => {
      const ctx: Ctx = {
        params: rest,
        res: undefined,
        i: -1
      }
      const next:Next = () => {
        const task = tasks[++ctx.i]
        let fn:Task
        if (task) {
          if (typeof task === 'string') {
            fn = fns[task]
          } else {
            fn = task
          }
          return fn(ctx, next, ...ctx.params)
        } else {
          resolve(ctx.res as R)
        }
      }
      next()
    })
    flow.tasks = tasks
    flow.add = (...extra:Task[]) => {
      tasks.push(...extra)
      return flow
    }
    flow.copy = () => {
      return use(...tasks)
    }
    return flow
  }

  return {
    define,
    use
  }
})
