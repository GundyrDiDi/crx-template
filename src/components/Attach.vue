<template>
  <div v-show="cur" ref="el" class="sniff-ext-attach" :style="{
    left: left + 'px',
    top: top + 'px',
  }">
    <div class="sqire" flex="cen ter" @click="handle(2)">
      <!-- <img src="@/assets/images/sqire.png" alt=""> -->
      <svg-icon name="搜图"></svg-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import $ from 'jquery'
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { readImg } from '@/hooks/useSrhImg'
import useSearch from '@/store/useSearch'
import useAuth from '@/store/useAuth'
import { useLoading } from '@/hooks/utils'

const { flow } = useAuth()
const { parseUrl, matchImg } = useSearch()
const cur = ref()
const el = ref()
const left = ref(0)
const top = ref(0)
const root = getCurrentInstance()?.root

//
const [wrapReadImg, loading] = useLoading(readImg)

const handle = flow.useCount.add(() => {
  const url = parseUrl(cur.value)
  console.log(url)
  if (!loading.value) {
    return wrapReadImg(url, '1688')
  }
})

const toggle = (img?: { src: string, rect: { left: number, top: number } }) => {
  if (!img) return (cur.value = null)
  cur.value = img.src
  left.value = img.rect.left
  top.value = img.rect.top
}

const bind = (e: any) => {
  const [tar, x, y] = [e.target, e.clientX, e.clientY]
  if (root?.vnode.el?.contains(tar)) return
  if (el.value.contains(tar)) return
  const img = matchImg(tar, x, y)
  toggle(img)
}
onMounted(async () => {
  $('body').on('mouseover', bind)
})
onUnmounted(() => {
  $('body').off('mouseover', bind)
})
</script>
<style lang="scss" scoped>
.sniff-ext-attach {
  position: absolute;
  z-index: 200000000;
  height: 40px;
  width: 40px;

  .sqire {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    background: var(--g1) !important;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);

    >* {
      color: #fff;
      height: 70% !important;
      width: 70% !important;
    }
  }
}
</style>
