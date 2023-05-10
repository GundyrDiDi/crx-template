<template>
  <a-spin :spinning="sheet.waiting">
    <div class="sniff-ext-skulist" style="overflow-x: hidden" of-auto>
      <transition-group
        v-if="sheet.googleUrl"
        tag="div"
        name="list"
        class="rel"
      >
        <div
          v-for="(v, i) in sheet.sheetSkus"
          :key="v.time + v.productSpecification"
          flex
          class="rel sniff-ext-skulist-item"
        >
          <div>
            <a :href="v.photoUrl" target="_blank">
              <img lazy class="sku-photo" :src="v.photoUrl" alt="" />
            </a>
            <div style="margin-top: 13px">×{{ v.quantity }}</div>
          </div>
          <div class="sniff-ext-skulist-desc" flex="col">
            <a
              :href="v.productUrl"
              target="_blank"
              class="line--2"
              style="height: 36px; margin-bottom: 4px"
            >
              {{ v.productName }}
            </a>
            <span class="sniff-ext-skulist-prop line--1">
              {{ v.productSpecification }}
            </span>
          </div>
          <div class="abs sniff-ext-skulist-drawer">
            <div class="wrap" flex="cen ter" @click="sheet.delSku(i)">
              <span>
                <svg-icon name="删除"></svg-icon>
              </span>
            </div>
          </div>
        </div>
      </transition-group>
      <div v-else flex="col ter" class="pa-25">
        <img src="@/assets/images/占位.png" style="height: 120px" alt="" />
        <div v-html="pre"></div>
        <img class="abs arrow-d" src="@/assets/images/拐弯箭头.png" alt="" />
      </div>
    </div>
  </a-spin>
</template>
<script lang="ts" setup>
import useSheet from '@/store/useSheet'
import { t } from '@/i18n'

const sheet = useSheet()

const pre = t('绑定X后即可选购商品').replace(
  'X',
  `<span 
  style="color:#f96113;font-weight: 500;"
  >${t('谷歌表')}</span>`
)
</script>
<style lang="scss" scoped>
.ant-spin-nested-loading {
  margin: 0;
}

.sniff-ext-skulist {
  height: 330px;

  &-item {
    width: 220px;
    height: 100px;
    background: #fefefe;
    margin-bottom: 1px;
    padding: 15px 5px 15px 10px;

    .sku-photo {
      height: 40px;
      width: 40px;
      border-radius: 2px;
    }

    a {
      color: inherit !important;
    }

    &:hover .sniff-ext-skulist-drawer > div {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &-desc {
    width: 150px;
    margin-left: 10px;
    margin-top: 2px;
    transition: all 0.2s ease-in-out;
  }

  &-prop {
    margin-top: 12px;
    background: #fbfbfb;
    padding-left: 10px;
    border-radius: 10px;
  }

  &-drawer {
    height: 100%;
    top: 0;
    right: 0px;
    width: 50px;

    > div {
      color: #fff;
      background: rgba(0, 0, 0, 0.8);
      transition: all 0.2s ease-in-out;
      transform: translateX(100%);
      cursor: pointer;
      opacity: 0;
    }

    span {
      font-size: 16px;
    }
  }
}

.list-leave-active {
  position: absolute;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px) !important;
}

.list-enter-active,
.list-leave-active,
.list-move {
  transition: all 0.7s;
}

.arrow-d {
  height: 60px;
  right: 14px;
  top: -24px;
  animation: sniffzoom 1s infinite;
  pointer-events: none;
}

@keyframes sniffzoom {
  0% {
    transform: scale(0.98) rotate(-5deg);
  }

  50% {
    transform: scale(1) rotate(-2deg);
  }

  100% {
    transform: scale(0.98) rotate(-5deg);
  }
}
</style>
