<template>
  <a-modal v-model:visible="computedVisible" :getContainer="() => root" :footer="null" centered v-bind="$attrs"
    @cancel="computedVisible = false">
    <slot></slot>
    <template #closeIcon>
      <svg-icon name="关闭"></svg-icon>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
const props = defineProps<{ visible: boolean }>()
const emits = defineEmits<{ (a: 'update:visible', b: boolean): boolean }>()
const computedVisible = computed({
  get: () => props.visible,
  set: (v) => emits('update:visible', v)
})
</script>
<style lang="scss" scoped></style>
