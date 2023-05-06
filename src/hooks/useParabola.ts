import { ref, reactive } from 'vue'
import { asyncTask } from '@/hooks/utils'
/**
 * 二阶贝塞尔曲线
 * 多阶则在二阶上递归
 * @param points 控制点
 * @param num 经过点个数 越多线越顺滑
 * @returns
 */
export const bezier = (points:(number[])[], num:number) => {
  const [[x1, y1], [x2, y2], [x3, y3]] = points
  const res = []
  for (let i = 1; i <= num; i++) {
    //
    const xa = x1 + (x2 - x1) * i / num
    const ya = y1 + (y2 - y1) * i / num
    //
    const xb = x2 + (x3 - x2) * i / num
    const yb = y2 + (y3 - y2) * i / num
    //
    const xc = xa + (xb - xa) * i / num
    const yc = ya + (yb - ya) * i / num
    //
    res.push([xc, yc])
  }
  return res
}

export const getStartEnd = () => {
  //
}
/**
 * 计算控制点，生成经过点
 * @param v
 */
export const calcPoint = (v:obj<number[]>, step:number) => {
  const { start: p1, end: p3 } = v
  const delta = (p1[0] - p3[0]) / 3
  const x2 = p1[1] < p3[1] ? p1[0] - delta : p3[0] + delta
  const y2 = Math.min(p1[1], p3[1]) - 200
  return bezier([p1, [x2, y2], p3], step)
}

/**
 * 图片地址
 */
export const parabola = ref('')
/**
 * 起点和终点
 */
export const points = reactive<obj<number[]>>({
  start: [],
  end: []
})

export const transform = ref('')

/**
 * 悬浮气泡位置
 */
export const bubbleDom = ref()

const step = 60

export const throwed = (src:string) => {
  console.log(bubbleDom)
  // parabola.value = src
  // const { start } = points
  // const dots = calcPoint(points, step)
  // transform.value = `translate(${start[0]}px,${start[1]}px)`
  // let i = 0
  // const [task, finish] = asyncTask()
  // const timer = setInterval(() => {
  //   if (i === step) {
  //     clearInterval(timer)
  //     parabola.value = ''
  //     finish(true)
  //     //
  //   } else {
  //     transform.value = `translate(${dots[i][0]}px,${dots[i++][1]}px)`
  //   }
  // }, 1000 / step)

  // return task
}
