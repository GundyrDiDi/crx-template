<template>
  <div v-if="!select" flex="bwn">
    <a-popover
      v-model:visible="visible"
      trigger="click"
      :getPopupContainer="() => root"
      placement="bottom"
    >
      <div cr-pointer>
        <svg-icon
          name="切换语言"
          class="rel"
          style="font-size: 16px; top: 2px"
        ></svg-icon>
        {{ langText }}
        <svg-icon
          name="展开"
          :reverse="visible ? visible : undefined"
        ></svg-icon>
      </div>
      <template #content>
        <div class="pv-5">
          <div
            class="ph-15 pv-5"
            v-for="v in Langs"
            :key="v.value"
            @click="handleClick(v.value)"
            cr-handle
          >
            {{ v.label }}
          </div>
        </div>
      </template>
    </a-popover>
    <slot></slot>
  </div>
  <div v-else ref="el" class="rel">
    <slot name="select" v-bind="{ visible, value: langText, open }"></slot>
    <a-select
      class="abs-cover"
      style="visibility: hidden; pointer-events: none"
      ref="sel"
      :value="lang.langCode"
      :getPopupContainer="() => el"
      :showArrow="false"
      :options="Langs"
      @dropdownVisibleChange="onDropdown"
      @change="changeLang"
      :open="visible"
    >
    </a-select>
  </div>
</template>
<script lang="ts" setup>
import useLang from '@/store/useLang'
import { computed, ref, onUnmounted } from 'vue'

const visible = ref(false)
const lang = useLang()
const { Langs, changeLang } = lang

/** popover 方式 */
const langText = computed(
  () => Langs.find((v) => v.value === lang.langCode)!.label
)

const handleClick = (v: string) => {
  changeLang(v)
  visible.value = false
}

/** select 方式 */
defineProps<{ select?: boolean }>()

const el = ref()
const sel = ref()

const onDropdown = (open: boolean) => {
  visible.value = open
  down = true
}

const fn = () => {
  requestAnimationFrame(() => {
    down = false
  })
}
document.body.addEventListener('mouseup', fn)

onUnmounted(() => {
  document.body.removeEventListener('mouseup', fn)
})

let down = false

const open = () => {
  if (!down) {
    visible.value || (visible.value = true)
  }
}
</script>
<style lang="scss" scoped></style>
