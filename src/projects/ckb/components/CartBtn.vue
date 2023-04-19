<template >
  <CartBtn class="sniff-ext-cart-btn">
    <!-- <a href="#" @click.prevent="canBuy && handle()" :class="{ loading, disabled: !canBuy }">
      <img v-show="canBuy" class="sniff-ext-cart-icon" src="@img/cart.png" alt="" />
      <span>{{ canBuy ? t('添加商品') : t('不支持采购') }}</span>
    </a> -->
    <span @click="addCart">
      123
    </span>
  </CartBtn>
</template>
<script lang="ts" setup>
import usePdt from '@/store/usePdt'
import { useLoading } from '@/hooks/utils'
import useAuth from '@/store/useAuth'

const { flow } = useAuth()
const addCart = usePdt().addCart
// const plat = usePlat()
// const canBuy = plat.canBuy
// const [wrap, loading] = useLoading(plat.addCart)
// const handle = auth.before(wrap, 0)
</script>
<style lang="scss" scoped></style>
