<template>
  <div v-show="cur" ref="el" class="sniff-ext-attach" :style="{
    left: left + 'px',
    top: top + 'px',
  }">
    <div class="sqire" flex="cen ter" @click="handle">
      <img src="@/assets/images/sqire.png" alt="">
    </div>
  </div>
</template>
<script lang="ts" setup>
import $ from 'jquery'
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { readImg } from '@/hooks/useSrhImg'
// import usePlat from '@/store/usePlat'
import useAuth from '@/store/useAuth'

const auth = useAuth()
// const plat = usePlat()
const cur = ref()
const el = ref()
const left = ref(0)
const top = ref(0)
const root = getCurrentInstance()?.root
//
const handle = auth.searchFlow(2)
// const handle = auth.isLogin(auth.updateCount(() => {
//   // const url = plat.ruleUrl(cur.value)
//   // return readImg(url, '1688')
// }, 2))

const toggle = (img?: { src: string, rect: { left: number, top: number } }) => {
  if (!img) return (cur.value = null)
  cur.value = img.src
  left.value = img.rect.left
  top.value = img.rect.top
}

const bind = (e: any) => {
  // const [tar, x, y] = [e.target, e.clientX, e.clientY]
  // if (root?.vnode.el?.contains(tar)) return
  // if (el.value.contains(tar)) return
  // const img = plat.matchImg(tar, x, y)
  // toggle(img)
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
  background: #ffbb00;
  color: #000;
  border-radius: 3px;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
  transition: all 0.15s ease-in-out;
  cursor: pointer;

  .sqire {
    height: 40px;
    width: 40px;
    overflow: hidden;

    >img {
      height: 70% !important;
      width: 70% !important;
      background: #ffbb00 !important;
    }
  }
}
</style>
