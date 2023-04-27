<template >
  <div class="rel sniff-ext-member-panel" flex>
    <div fx-1>
      <div flex="ter">
        <img src="@/assets/images/member-label.png" style="height:18px;margin-right:6px;" alt="">
        <a-tooltip :getPopupContainer="() => root" color="#fff" placement="bottom">
          <template #title>
            <div class="sniff-ext-tooltip">
              <div v-html="t('※非会员每日限免X次图搜、Y次关键词搜索。开通会员可无限使用').replaceAll('\n', '<br/>')"></div>
            </div>
          </template>
          <span class="sniff-ext-tip-icon" cr-pointer>
            <svg-icon name="问号"></svg-icon>
          </span>
        </a-tooltip>
      </div>
      <div style="font-size:11px;line-height:18px;">
        <div>
          {{ t('今日剩余：') }}
        </div>
        <div>
          {{ inject(t('图搜X次，关键词搜索Y次')) }}
        </div>
      </div>
    </div>
    <sniff-btn class="abs" @click="joinMember" type="warn"
      style="height:24px;border-radius:12px;padding:4px 8px;line-height:14px;right:10px;">
      {{ t('加入会员') }}
    </sniff-btn>
  </div>
</template>
<script lang="ts" setup>
import useAuth from '@/store/useAuth'
import { computed, ref, reactive } from 'vue'

const auth = useAuth()
const level = computed(() => auth.get('level'))
const imageCounts = computed(() => auth.get('imageCounts'))
const keywordCounts = computed(() => auth.get('keywordCounts'))

const inject = (str: string) => {
  const m = {
    X: imageCounts,
    Y: keywordCounts
  }
  return str.replace(/X|Y/g, ($1) => {
    return m[$1 as 'X' | 'Y'].value.toString()
  })
}

const joinMember = auth.joinMember
</script>
<style lang="scss" scoped>
.sniff-ext-member-panel {
  padding: 10px;
  background-image: url('~@/assets/images/member-bg.png');
  background-position: -60px 0;
  background-size: cover;
  color: #fff;
}

.sniff-ext-tip-icon {
  transform: translateY(-1px) scale(1.25);
}

.sniff-ext-tooltip {
  background: #fff;
  color: #555;
  font-size: 12px;
  // transform: translate(-50%, 25px);
  // box-shadow: 0px 2px 6px 0px rgba(183, 183, 183, 0.5);
}
</style>
