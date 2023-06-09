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
  const use = <R>(...tasks: (Task|string)[]) => {
    const flow = <T extends unknown[]>(...rest:T) => new Promise<R>((resolve) => {
      const ctx: Ctx = {
        params: rest,
        res: undefined,
        i: -1
      }
      const next = async () => {
        const task = tasks[++ctx.i]
        let fn:Task
        if (task) {
          if (typeof task === 'string') {
            fn = fns[task]
          } else {
            fn = task
          }
          return await fn(ctx, next, ...ctx.params)
        }
      }
      next().then(() => resolve(ctx.res as R))
    })
    flow.tasks = tasks
    flow.push = (...extra:(Task|string)[]) => {
      tasks.push(...extra)
      return flow
    }
    flow.add = <T=R>(...extra:(Task|string)[]) => {
      return use<T>(...tasks, ...extra)
    }
    flow.copy = () => {
      //
    }
    return flow
  }

  return {
    define,
    use
  }
})
