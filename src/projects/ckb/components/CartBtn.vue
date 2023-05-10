<template>
  <CartBtn class="sniff-ext-cart-btn" :id="'sniff-ext-' + plat">
    <a
      href="#"
      @click.prevent="pdt.canBuy && wrap()"
      class="rel"
      :class="{ loading, disabled: !pdt.canBuy }"
    >
      <img
        v-show="pdt.canBuy"
        class="abs sniff-ext-cart-icon"
        src="@/assets/images/logo1.png"
      />
      <span>{{ pdt.canBuy ? t('添加商品') : t('不支持采购') }}</span>
    </a>
  </CartBtn>
</template>
<script lang="ts" setup>
import { useLoading } from '@/hooks/utils'
import usePdt from '@/store/usePdt'
import useAuth from '@/store/useAuth'
import usePlat from '@/store/usePlat'

const { plat } = usePlat()
const { flow } = useAuth()
const pdt = usePdt()
const [wrap, loading] = useLoading(flow.isLogin.add(pdt.addCart))
</script>
<style lang="scss" scoped>
.sniff-ext-cart-btn {
  margin-top: 15px;
  clear: both;
  display: block;

  > a {
    float: left !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    margin-right: 21px !important;
    height: 40px !important;
    padding: 0 48px !important;
    border-radius: 40px !important;
    border: 1px solid var(--g1) !important;
    overflow: hidden !important;
    text-decoration: none !important;
    transition: all 0.1s;

    .sniff-ext-cart-icon {
      top: 2px;
      left: 2px;
      height: 34px;
    }

    > span {
      font-size: 16px;
      color: var(--g1);
    }

    &:hover:not(.loading, .disabled) {
      background: var(--g3) !important;
      border: 1px solid var(--g2) !important;
    }

    &:active:not(.loading, .disabled) {
      background: var(--g4) !important;
      border: 1px solid var(--g5) !important;
    }

    &.loading,
    &.disabled {
      color: #eee !important;
      cursor: not-allowed !important;
      border: 1px solid #e8e8e8 !important;

      .sniff-ext-cart-icon {
        filter: grayscale(1);
        opacity: 0.5;
      }

      > span {
        color: #898989;
      }
    }
  }
}

// 不同平台样式调整
#sniff-plat-1688 {
  margin-bottom: 23px;
}
</style>
