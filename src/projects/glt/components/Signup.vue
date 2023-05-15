<template>
  <Modal v-model:visible="login.upVisible" :width="500">
    <div class="ph-35" of-auto>
      <div modal-title class="mb-30">{{ t('注册会员') }}</div>
      <a-form
        v-bind="layout"
        :model="SUForm"
        :rules="SURules"
        :hideRequiredMark="false"
        recover
        name="signup"
      >
        <!-- 语言 -->
        <a-form-item>
          <LangBar :select="true">
            <template #select="{ visible, value, open }">
              <a-input readonly :value="value" @click="open()"></a-input>
              <span class="abs unneed">
                <svg-icon name="切换语言2"></svg-icon>
              </span>
              <span class="abs" right-icon>
                <svg-icon
                  style="font-size: 13px"
                  name="展开箭头"
                  :reverse="visible ? true : undefined"
                ></svg-icon>
              </span>
              <div class="abs" style="top: -28px; left: 0px" swing>
                <div class="ant-tooltip-content">
                  <div
                    class="ant-tooltip-arrow"
                    style="left: 19px; bottom: -6px"
                  >
                    <span
                      class="ant-popover-arrow-content"
                      style="transform: rotate(45deg)"
                    ></span>
                  </div>
                  <div>
                    {{ t('谷歌表语言') }}
                  </div>
                </div>
              </div>
            </template>
          </LangBar>
        </a-form-item>
        <!-- 账号 -->
        <a-form-item name="loginName">
          <a-input
            v-model:value="SUForm.loginName"
            :placeholder="t('请输入账号')"
          ></a-input>
          <span class="abs">
            <svg-icon name="账号"></svg-icon>
          </span>
        </a-form-item>
        <!-- 密码 -->
        <a-form-item name="password">
          <a-input
            :type="ptype ? 'password' : 'text'"
            v-model:value="SUForm.password"
            :maxLength="32"
            :placeholder="t('请输入密码')"
          ></a-input>
          <span class="abs">
            <svg-icon name="密码"></svg-icon>
          </span>
          <span class="abs" right-icon>
            <svg-icon
              @click="ptype = !ptype"
              :name="ptype ? '闭眼' : '睁眼'"
            ></svg-icon>
          </span>
        </a-form-item>
        <!-- 确认密码 -->
        <a-form-item name="repassword">
          <a-input
            :type="ptype1 ? 'password' : 'text'"
            v-model:value="SUForm.repassword"
            :maxLength="32"
            :placeholder="t('请再次输入密码')"
          ></a-input>
          <span class="abs">
            <svg-icon name="确认密码"></svg-icon>
          </span>
          <span class="abs" right-icon>
            <svg-icon
              @click="ptype1 = !ptype1"
              :name="ptype1 ? '闭眼' : '睁眼'"
            ></svg-icon>
          </span>
        </a-form-item>
        <!-- 邮箱 -->
        <a-form-item name="customerEmail" key="customerEmail">
          <a-input
            v-model:value="SUForm.customerEmail"
            :placeholder="t('请输入邮箱')"
            name="sniff_login_customerEmail"
          ></a-input>
          <span class="abs">
            <svg-icon name="邮箱"></svg-icon>
          </span>
        </a-form-item>
        <!-- 验证码 -->
        <a-form-item name="nameOrEmail" key="nameOrEmail">
          <a-input
            v-model:value="SUForm.verificationCode"
            :placeholder="t('请输入验证码')"
            name="sniff_login_verificationCode"
          ></a-input>
          <span class="abs">
            <svg-icon name="验证码"></svg-icon>
          </span>
          <span class="abs" style="right: 10px; top: 7px">
            <ant-btn
              :loading="login.waitCnt > 0"
              @click="login.getSignupCode"
              style="min-width: 110px; height: 30px; font-size: 14px"
            >
              <template v-if="login.waitCnt > 0">
                {{ t('发送中') }}
                ({{ login.waitCnt }})
              </template>
              <template v-else> {{ t('获取验证码') }} </template>
            </ant-btn>
          </span>
        </a-form-item>
        <!-- 手机号 -->
        <a-form-item prop="customerMobile" key="customerMobile">
          <a-input
            v-model:value="SUForm.customerMobile"
            :placeholder="t('手机号')"
            name="sniff_login_customerMobile"
            :style="{ paddingLeft: SUForm.countryCode ? '88px' : '' }"
          ></a-input>
          <span class="abs sniff-crx-login-icon">
            <svg-icon name="手机号"></svg-icon>
          </span>
          <span class="abs" v-if="SUForm.countryCode" country-code>
            {{ SUForm.countryCode }}
          </span>
        </a-form-item>
        <!-- 姓名 -->
        <a-form-item prop="customerName" key="customerName">
          <a-input
            v-model:value="SUForm.customerName"
            :placeholder="t('请输入您的名称')"
            name="sniff_login_customerName"
          ></a-input>
          <span class="abs unneed">
            <svg-icon name="联系人姓名"></svg-icon>
          </span>
        </a-form-item>
        <!-- 条款  -->
        <div flex="ter" class="mb-10">
          <a-checkbox v-model="agreed"></a-checkbox>
          <span class="ml-5" cr-active :class="{ blink }">
            {{ t('同意此项条款') }}
          </span>
        </div>
        <div class="rel" style="z-index: 1">
          <ant-btn :loading="loading" @click="signup" block>
            {{ t('注册会员') }}
          </ant-btn>
        </div>
        <div align="r" class="mt-10" style="color: var(--b4)">
          <span cr-handle @click="toSignin">{{ t('已有帐户去登录') }}</span>
        </div>
      </a-form>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { useLoading } from '@/hooks/utils'
import useLogin from '@/store/useLogin'
import { ref } from 'vue'
const login = useLogin()
const { SUForm, SURules } = login
const layout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 }
}

const ptype = ref(true)
const ptype1 = ref(true)

const agreed = ref(false)
const blink = ref(false)

const [signup, loading] = useLoading(async () => {
  if (!agreed.value) {
    blink.value = true
    setTimeout(() => {
      blink.value = false
    }, 1200)
  }
  return login.signup()
})

const toSignin = () => {
  login.upVisible = false
  setTimeout(login.show, 200)
}
</script>
<style lang="scss" scoped>
[recover] .ant-form-item {
  margin-bottom: 30px;
}

[recover] .ant-input {
  height: 44px;
  background: #fafafa;
  border-radius: 25px;
  padding-left: 49px;
  border: none !important;
  box-shadow: inset 0px 5px 8px 0px #efefef, inset 0px -2px 1px 0px #ffffff;

  &:focus + span {
    color: var(--g1);
  }

  + span {
    left: 18px;
    pointer-events: none;
    line-height: 44px;
    font-size: 16px;
    &:not(.unneed)::after {
      content: '*';
      color: inherit;
      font-weight: 200;
      display: inline-block;
      transform: translate(5px, 3px);
    }
  }

  ~ [right-icon] {
    right: 20px;
    font-size: 18px;
    line-height: 44px;
    cursor: pointer;
  }
}

[country-code] {
  display: flex;
  left: 51px;
  top: 10px;
  padding: 3px 0;
  width: 30px;
  line-height: 18px;
  transform: scaleY(0.95);
  border-right: 1px solid #eee;
}

.ant-tooltip-content {
  box-shadow: 0px 3px 6px 0px #e0ebe8;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 12px;
  color: var(--g1);
  background: #fff;
}

[swing] {
  transform-origin: center center;
  animation: swing 3s 1s infinite;
}

@keyframes swing {
  10% {
    transform: rotate3d(0, 0, 1, 2deg);
  }

  20% {
    transform: rotate3d(0, 0, 1, -2deg);
  }

  30% {
    transform: rotate3d(0, 0, 1, 2deg);
  }

  40% {
    transform: rotate3d(0, 0, 1, -2deg);
  }

  50% {
    transform: rotate3d(0, 0, 1, 0deg);
  }

  100% {
    transform: rotate3d(0, 0, 1, 0deg);
  }
}

.blink {
  transition: all 0.2s;
  animation: blink 0.8s linear 2;
}

@keyframes blink {
  0% {
    color: var(--g1);
    transform: scale(1);
  }

  25% {
    color: #f57322;
    transform: scale(1.05);
  }

  50% {
    color: var(--g1);
    transform: scale(1);
  }

  75% {
    color: #f57322;
    transform: scale(1.05);
  }

  100% {
    color: var(--g1);
    transform: scale(1);
  }
}
</style>
