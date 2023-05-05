<template>
  <div>
    <svg-icon class="ml-10" name="谷歌表" style="font-size: 20px" cr-pointer :primary="googleUrl ? true : undefined"
      @click="visible = true"></svg-icon>
    <Modal v-model:visible="visible" :width="440">
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import useSheet from '@/store/useSheet'

const googleUrl = computed(() => useSheet().googleUrl)
const visible = ref(false)
</script>

<style lang="scss" scoped>
[primary] {
  color: var(--g1);
}
</style>
