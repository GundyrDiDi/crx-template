<template>
  <div parabola v-show="parabola" :style="{ transform }">
    <img :src="parabola" alt="" />
  </div>
</template>
<script lang="ts" setup>
import { transform, parabola } from '@/hooks/useParabola'
</script>
<style lang="scss">
[parabola] {
  position: fixed;
  top: 0;
  left: 0;

  img {
    height: 30px !important;
    width: 30px !important;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    opacity: .8;
  }
}
</style>
