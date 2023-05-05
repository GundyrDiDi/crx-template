<template>
  <div flex="bwn">
    <a-popover v-model:visible="visible" trigger="click" :getPopupContainer="() => root" placement="bottom">
      <div cr-pointer>
        <svg-icon name="切换语言" class="rel" style="font-size:16px;top:2px;"></svg-icon>
        {{ Langs.find(v => v.value === lang)!.label }}
        <svg-icon name="展开" :reverse="visible ? visible : undefined"></svg-icon>
      </div>
      <template #content>
        <div class="pv-5">
          <div class="ph-15 pv-5" v-for="v in Langs" :key="v.value" @click="changeLang(v.value); visible = false"
            cr-handle>
            {{ v.label }}
          </div>
        </div>
      </template>
    </a-popover>
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import useLang from '@/store/useLang'
import { computed, ref } from 'vue'
const { Langs, changeLang } = useLang()
const lang = computed(() => useLang().get('langCode'))

const visible = ref(false)
</script>
<style lang="scss" scoped></style>
