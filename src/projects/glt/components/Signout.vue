<template>
  <Modal v-model:visible="login.outVisible" :width="440">
    <div style="padding: 30px 20px">
      <div modal-title>{{ t('您确定退出登录吗') }}</div>
      <div align="c" class="text-gray">
        {{ t('退出登录后进货袋内的商品信息保留') }}
      </div>
      <div flex="bwn">
        <ant-btn plain @click="login.outVisible = false">
          {{ t('取消') }}
        </ant-btn>
        <ant-btn @click="login.signout">
          {{ t('确定') }}
        </ant-btn>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import useLogin from '@/store/useLogin'
const login = useLogin()
</script>
<style lang="scss" scoped>
[modal-title] {
  margin-top: 30px;
  margin-bottom: 20px;
}

.text-gray {
  font-size: 16px;
  line-height: 22px;
  color: var(--b4);
  margin-bottom: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
}

.ant-btn[recover] {
  width: 170px;
  height: 50px;
  border-radius: 30px;
}
</style>
