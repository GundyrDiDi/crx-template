<template>
  <div ref="el" class="fix" :style="isDragging ? style : staticStyle">
    <slot v-bind:isDragging="isDragging"></slot>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ENV } from '@/hooks/const'
import { useDraggable, useLocalStorage } from '@vueuse/core'

type C = (e?: PointerEvent) => boolean
const props = defineProps<{ canDrag: C }>()
const el = ref()
const isDragging = ref(false)

const staticStyle = useLocalStorage(
  `${ENV.pjt}_sniff_bubble_style`,
  'right:80px;top:30px'
)

const i = { x: -Infinity, y: 0 }

/** 拖拽时style */
const { style } = useDraggable(el, {
  initialValue: i,
  onStart: (p, e) => props.canDrag(e) && undefined,
  onMove: () => (isDragging.value = true),
  /** 由于点击不拖拽也会触发onEnd，这时候p等于初始值，需要过滤 */
  onEnd: (p) => {
    if (i.x === p.x) return
    setStatic([p.x, p.y])
    requestAnimationFrame(() => (isDragging.value = false))
  }
})
/** 计算静止时的style */
const setStatic = (p: number[]) => {
  const w = window.innerWidth
  // const [g, x, y] = (
  //   style.match(/left:(-?[\d.]+)px;top:(-?[\d.]+)px/) ?? [0, 0, 0]
  // ).map((v) => Number(v))
  const [x, y] = p
  if (x > w / 2) {
    const scrollWidth =
      document.body.clientHeight > window.innerHeight
        ? (navigator.userAgent.includes('Mac') ? 8 : 0) +
          window.innerWidth -
          document.body.offsetWidth
        : 0
    console.log(scrollWidth)
    staticStyle.value = `right:${Math.max(
      -25,
      w - x - 50 - scrollWidth /* 滚动条宽度 */
    )}px;top:${Math.max(0, y)}px`
  } else {
    staticStyle.value = `left:${Math.max(-25, x)}px;top:${Math.max(0, y)}px`
  }
  return { x, y }
}
</script>
<style lang="scss" scoped>
.fix {
  z-index: 200000000;
}
</style>
