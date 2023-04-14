import { defineStore } from 'pinia'

export default defineStore('flow', () => {
  type Ctx = {
    params: unknown[],
    res: unknown,
    i:number
  }

  type Next = () => unknown

  type C<T extends unknown[]= []>=(ctx: Ctx, next: Next, ...rest: T) => unknown

  type Task = string | { name: string, params: (() => unknown[]) | unknown[] }

  const fns: obj<fn> = {}
  /**
   *
   * @param key
   * @param fn
   */
  const use = <T extends unknown[] =unknown[]>(key: string, fn: C<T>) => {
    fns[key] = fn
  }
  /**
   *
   * @param tasks
   * @returns
   */
  const carry = <T>(...tasks: Task[]) => {
    const flow = () => new Promise<T>((resolve) => {
      const ctx: Ctx = {
        params: [],
        res: undefined,
        i: -1
      }
      const next = () => {
        const task = tasks[++ctx.i]
        if (task) {
          const fn = typeof task === 'string' ? fns[task] : fns[task.name]
          ctx.params = []
          if (typeof task !== 'string') {
            ctx.params = Array.isArray(task.params) ? task.params : task.params()
          }
          return fn(ctx, next, ...ctx.params)
        } else {
          resolve(ctx.res as T)
        }
      }
      next()
    })
    flow.tasks = tasks
    flow.add = (...extra:Task[]) => {
      tasks.push(...extra)
      return this
    }
    flow.copy = () => {
      return carry(...tasks)
    }
    return flow
  }

  return {
    use,
    carry
  }
})
