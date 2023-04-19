<template>
  <div v-show="show" ref="el" sniff-ext>
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import usePdt from '@/store/usePdt'
import { ref, onMounted } from 'vue'

const el = ref<HTMLElement>()
const show = ref(false)

onMounted(async () => {
  const { container } = usePdt()
  if (container && el.value) {
    container.append(el.value)
    show.value = true
  }
})
</script>
<style lang="scss" scoped></style>
