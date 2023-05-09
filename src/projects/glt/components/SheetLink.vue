<template>
  <div flex="ter bwn">
    <span>
      <span>{{ t('数量') }}:</span>
      <span class="ml-5" style="color:#E83D51;font-weight: 500;">{{ sheet.sheetSkus.length }}</span>
    </span>
    <ant-btn twcover :disabled="!sheet?.googleUrl" @click="jump">
      {{ t('查看谷歌表') }}
    </ant-btn>
  </div>
</template>
<script lang="ts" setup>
import useSheet from '@/store/useSheet'
const sheet = useSheet()
const jump = () => {
  window.open(sheet.googleUrl)
}
</script>
<style lang="scss" scoped>
.ant-btn[recover][twcover] {
  height: 34px;
  font-size: inherit;
}
</style>
