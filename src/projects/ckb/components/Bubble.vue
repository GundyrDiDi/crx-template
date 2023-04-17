<template>
  <Bubble v-if="plat.showBubble()" :can-drag="canDrag">
    <template #default="{ isDragging }">
      <div class="sniff-ext-bubble" flex="col colend">
        <div ref="icon" flex="cen ter" @click="isDragging || (collapse = false)">
          <img class="sniff-ext-bubble-logo" src="@/assets/images/logo1.png" alt="" />
        </div>
        <div :class="{ collapse }" class="sniff-ext-bubble-content">
          <div>123</div>
        </div>
      </div>
    </template>
  </Bubble>
</template>
<script lang="ts" setup>
import usePlat from '@/store/usePlat'
import useAuth from '@/store/useAuth'
import { ref, watch } from 'vue'
import MemberPanel from './components/MemberPanel.vue'
import { cancelTimes } from '@/hooks/utils'

const collapse = ref(true)
const plat = usePlat()
const auth = useAuth()

const icon = ref()
const canDrag = (e?: PointerEvent) => e?.target === icon.value

const word = ref('')

</script>
<style lang="scss" scoped>
.sniff-ext-bubble {
  &-logo {
    height: 58px;
    width: 58px;
    pointer-events: none;
  }

  &-content {
    background: red;
  }
}
</style>
