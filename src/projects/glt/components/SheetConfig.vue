<template>
  <div>
    <svg-icon class="ml-10" name="谷歌表" style="font-size: 20px" cr-pointer :primary="googleUrl ? true : undefined"
      @click="visible = true"></svg-icon>
    <Modal v-model:visible="visible" :width="480">
      <div class="ma-20" flex="cen" style="font-size: 20px;line-height: 28px;font-weight: 500;">{{ t("绑定谷歌表") }}</div>
      <div class="ph-30 rel">
        <div class="rel flex-ter" style="margin: 50px 0;">
          <a-input recover v-model:value="url" :placeholder="t('请输入谷歌表链接')"></a-input>
          <span class="abs" v-show="url" @click="url = ''" cr-pointer style="right: 16px;top: 9px;">
            <img style="height: 16px;" src="@/assets/images/关闭圆.png" alt="">
          </span>
        </div>
        <div class="rel" style="z-index:1">
          <ant-btn class="mb-20" :block="true" :loading="loading" :disabled="url === googleUrl" @click="bind">
            {{ t('确定') }}
          </ant-btn>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import useSheet from '@/store/useSheet'
import { useLoading } from '@/hooks/utils'

const sheet = useSheet()
const googleUrl = computed(() => sheet.googleUrl)
const url = ref(sheet.googleUrl)
const visible = ref(false)

watch(visible, (v) => {
  if (v) url.value = sheet.googleUrl
})

const [bind, loading] = useLoading(async () => {
  const res = await sheet.changeUrl(url.value)
  visible.value = !res
})
</script>

<style lang="scss" scoped>
[primary] {
  color: var(--g1);
}

.ant-input[recover] {
  height: 44px;
  border-radius: 22px;
  padding: 0 50px 0 22px;
  border: none !important;
  box-shadow: inset 0px 5px 8px 0px #EFEFEF, inset 0px -2px 1px 0px #FFFFFF;
}
</style>
