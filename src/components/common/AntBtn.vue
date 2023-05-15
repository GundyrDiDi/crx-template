<template>
  <a-button recover shape="round" v-bind="$attrs">
    <slot></slot>
  </a-button>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
.ant-btn[recover] {
  position: relative;
  font-size: 20px;
  height: 55px;
  background: var(--g1);
  border: none;
  color: #fff;

  &:hover,
  &:focus {
    background: var(--g7);
    color: #fff;
  }

  &:active {
    background: var(--g6);
    color: #fff;
  }

  &[disabled] {
    color: rgba(0, 0, 0, 0.25);
    border-color: #d9d9d9;
    background: #f5f5f5;
    text-shadow: none;
    box-shadow: none;
  }

  &[plain] {
    color: inherit;
    background-color: #fff;
    border: 2px solid #cccccc;
    &:hover,
    &:focus {
      background-color: #fff;
      color: var(--g1);
    }
  }

  &.ant-btn-block:hover:not([disabled]),
  &.ant-btn-block:focus:not([disabled]) &.ant-btn-block:active:not([disabled]) {
    &:after {
      content: '';
      height: inherit;
      width: inherit;
      background: #79bfae;
      position: absolute;
      bottom: -15px;
      left: 0;
      z-index: -1;
      border-radius: inherit;
      transform: scale(0.8);
      filter: blur(10px);
    }
  }
}
</style>
