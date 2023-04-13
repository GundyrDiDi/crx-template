<template>
  <div class="fix" :id="id">
    <Home />
  </div>
</template>
<script lang="ts" setup>
import Home from '@p/Home.vue'
import { ENV } from '@/hooks/const'
const id = 'sniff-ext-' + ENV.VUE_APP_PJT
</script>
<style lang="scss" scoped>
.fix {
  top: 0 !important;
  left: 0 !important;
  z-index: 10000000000000 !important;
}
</style>
