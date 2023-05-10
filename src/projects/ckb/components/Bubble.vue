<template>
  <Bubble v-if="plat.showBubble()" :can-drag="canDrag">
    <template #default="{ isDragging }">
      <div class="sniff-ext-bubble" flex="col colend">
        <div
          ref="icon"
          flex="cen ter"
          cr-pointer
          @click="isDragging || handleClick()"
        >
          <img
            :ref="(v: any) => bubbleDom = v"
            :class="{ droping }"
            class="sniff-ext-bubble-logo"
            shadow
            src="@/assets/images/logo1.png"
            alt=""
          />
        </div>
        <div
          v-if="userData.token"
          v-show="delayC"
          class="abs sniff-ext-bubble-box"
          of-hidden
        >
          <div
            :class="{ expand: delayE }"
            class="sniff-ext-bubble-content"
            shadow
            of-hidden
          >
            <MemberInfo />
            <div class="sniff-ext-bubble-panel">
              <img
                style="height: 20px"
                src="@/assets/images/theckb_logo.png"
                alt=""
              />
              <SearchBar />
              <div style="height: 1px; background: #f4f5f8; margin: 0"></div>
              <div align="c" style="margin: 6px">
                <span
                  cr-pointer
                  style="color: var(--bl1)"
                  @click="expand = !expand"
                >
                  {{ t('关闭') }}
                  <svg-icon
                    name="展开"
                    style="transform: translate(-3px, -1px) rotate(-90deg)"
                  ></svg-icon>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else></div>
      </div>
    </template>
  </Bubble>
</template>
<script lang="ts" setup>
import usePlat from '@/store/usePlat'
import { ref, computed } from 'vue'
import { aRef } from '@/hooks/useExt'
import useAuth from '@/store/useAuth'
import { bubbleDom, droping } from '@/hooks/useParabola'

const auth = useAuth()
const userData = computed(() => auth.userData)
const handleClick = auth.flow.isLogin.add(() => (expand.value = !expand.value))

const expand = ref(true)
const delayC = aRef(expand, 0, 300)
const delayE = aRef(expand, 20, 0)

const plat = usePlat()

const icon = ref()
const canDrag = (e?: PointerEvent) => e?.target === icon.value
</script>
<style lang="scss" scoped>
.sniff-ext-bubble {
  &-logo {
    height: 58px;
    width: 58px;
    border-radius: 50%;
    pointer-events: none;

    &.droping {
      transform: translateY(4px);
    }
  }

  &-box {
    top: 60px;
    right: -5px;
    padding: 5px;
  }

  &-content {
    width: 220px;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
    transform: translateX(100%);

    &.expand {
      transform: translateX(0);
    }
  }

  &-panel {
    background: #fbfbfb url('~@/assets/images/bubble_bg.png') no-repeat;
    background-size: contain;
    min-height: 110px;

    > * {
      margin: 10px 10px 0 10px;
    }
  }
}
</style>
