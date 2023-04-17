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
const staticStyle = useLocalStorage(`${ENV.pjt}_sniff_bubble_style`, 'right:80px;top:30px')
const setStatic = (style: string) => {
  const w = window.innerWidth
  const [g, x, y] = (style.match(/left:(-?[\d.]+)px;top:(-?[\d.]+)px/) ?? [0, 0, 0]).map(v => Number(v))
  if (x > w / 2) {
    // console.log(el.value.getBoundingClientRect())
    // console.log(w, x, w - x - 50)
    staticStyle.value = `right:${Math.max(-25, w - x - 50/* 滚动条宽度 */)}px;top:${Math.max(0, y)}px`
  } else {
    staticStyle.value = `left:${Math.max(-25, x)}px;top:${Math.max(0, y)}px`
  }
  return { x, y }
}
const i = { x: -Infinity, y: 0 }
const { style } = useDraggable(el, {
  initialValue: i,
  onStart: (p, e) => props.canDrag(e) && undefined,
  onMove: () => (isDragging.value = true),
  onEnd: (p) => {
    if (i.x === p.x) return
    setStatic(style.value)
    requestAnimationFrame(() => (isDragging.value = false))
  }
})
</script>
<style lang="scss" scoped>
.fix {
  z-index: 200000000;
}
</style>
