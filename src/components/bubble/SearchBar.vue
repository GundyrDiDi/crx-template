<template >
  <div class="rel pb-10" flex="ter">
    <div class="sniff-ext-search-input rel" fx-1>
      <a-input name="sniff-search-keyword" v-model:value="word" @keyup.enter="handleEnter"
        :placeholder="t('搜索商品名或店舗名')" />
      <div class="abs" cr-pointer @click="handleClick">
        <svg-icon name="搜索"></svg-icon>
      </div>
    </div>
    <slot>
      <div></div>
    </slot>
  </div>
</template>
<script lang="ts" setup>
import useSearch from '@/store/useSearch'
import useAuth from '@/store/useAuth'
import { cancelTimes } from '@/hooks/utils'
import { useDebounceFn } from '@vueuse/shared'
import { ref } from 'vue'

const { flow } = useAuth()
const { searchWord } = useSearch()
const word = ref('')
const search = flow.useCount.add(() => searchWord(word.value))

const handleEnter = cancelTimes(search)
const handleClick = useDebounceFn(search)
</script>
<style lang="scss" scoped>
.ant-input {
  padding-right: 30px;
  background-color: transparent;

  &:focus {
    ~.abs {
      color: var(--g1);
    }
  }

  ~.abs {
    top: 0;
    right: 5px;
    font-size: 20px;
    color: var(--b2);
  }
}
</style>
