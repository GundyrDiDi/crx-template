<template>
  <Modal v-model:visible="login.visible" :width="500">
    <div style="height: 510px">
      <LangBar style="color: var(--b4)"></LangBar>
      <div flex="cen ter" class="rel" style="top: -20px">
        <svg-icon style="font-size: 120px" name="THECKB"></svg-icon>
      </div>
      <a-form
        v-bind="layout"
        :model="loginForm"
        :rules="loginRules"
        :hideRequiredMark="false"
        class="ph-35"
        recover
      >
        <div class="mb-20" flex="bwn colend">
          <span style="font-size: 18px; font-weight: 600">
            {{ enterText[login.enter] }}
          </span>
          <span
            style="color: var(--bl1)"
            cr-pointer
            @click="login.enter = reverse[login.enter]"
            >{{ enterText[reverse[login.enter]] }}</span
          >
        </div>
        <template v-if="login.enter === 0">
          <a-form-item name="nameOrEmail" key="nameOrEmail">
            <a-input
              v-model:value="loginForm.nameOrEmail"
              :placeholder="t('请输入账号')"
              name="sniff_login_nameOrEmail"
            ></a-input>
            <span class="abs">
              <svg-icon name="账号"></svg-icon>
            </span>
          </a-form-item>
          <a-form-item name="password" key="password">
            <a-input
              :type="ptype ? 'password' : 'text'"
              v-model:value="loginForm.password"
              :maxLength="32"
              :placeholder="t('请输入密码')"
              name="sniff_login_password"
              @keyup.enter="login.signin"
            ></a-input>
            <span class="abs sniff-crx-login-icon">
              <svg-icon name="密码"></svg-icon>
            </span>
            <span
              class="abs"
              @click="ptype = !ptype"
              style="
                line-height: 50px;
                right: 20px;
                font-size: 20px;
                cursor: pointer;
              "
            >
              <svg-icon :name="ptype ? '闭眼' : '睁眼'"></svg-icon>
            </span>
          </a-form-item>
        </template>
        <template v-else>
          <div></div>
        </template>
        <ant-btn :loading="loading" @click="signin" block>
          {{ t('登录') }}
        </ant-btn>
      </a-form>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { useLoading } from '@/hooks/utils'
import useLogin from '@/store/useLogin'
import { ref } from 'vue'
const login = useLogin()
const { loginForm, loginRules, enterText } = login
const layout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 }
}
/** 当前enter值取反 */
const reverse = [1, 0]

const ptype = ref(true)

const [signin, loading] = useLoading(login.signin)
</script>
<style lang="scss" scoped>
[recover] .ant-form-item {
  margin-bottom: 48px;
}

[recover] .ant-input {
  height: 50px;
  background: #fafafa;
  border-radius: 25px;
  padding-left: 44px;
  border: none !important;
  box-shadow: inset 0px 5px 8px 0px #efefef, inset 0px -2px 1px 0px #ffffff;

  &:focus + span {
    color: var(--g1);
  }

  + span {
    left: 18px;
    pointer-events: none;
    line-height: 50px;
    font-size: 18px;
  }
}
</style>
