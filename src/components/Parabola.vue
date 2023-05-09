<template>
  <div class="fix" parabola v-show="parabola" :style="{ transform }">
    <img :src="parabola" alt="" />
  </div>
</template>
<script lang="ts" setup>
import { transform, parabola } from '@/hooks/useParabola'
</script>
<style lang="scss">
[parabola] {
  top: 0;
  left: 0;
  z-index: 200000000;

  img {
    height: 40px !important;
    width: 40px !important;
    transform: translate(-50%, -50%) !important;
    border-radius: 50% !important;
    opacity: .8;
  }
}
</style>
