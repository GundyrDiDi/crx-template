<template>
  <a class="sniff-ext-btn" :class="[`sniff-ext-btn-${type ?? 'default'}`, plain ? 'sniff-ext-btn-plain' : '']">
    <slot></slot>
  </a>
</template>
<script lang="ts" setup>
defineProps<{
  type?: 'info' | 'primary' | 'warn' | 'error',
  plain?: boolean
}>()
</script>
<style lang="scss" scoped>
.sniff-ext-btn {
  height: 22px;
  line-height: 20px;
  background: #fff;
  text-decoration: none;
  border-radius: 4px;
  border: 1px solid #fff;
  transition: all .15s linear;
  cursor: pointer;
}

.sniff-ext-btn-default {
  color: var(--b1);
  border: 1px solid #ddd;
}

.sniff-ext-btn-info {
  color: #007aff;
  border-color: #007AFF;

  &:hover {
    background-color: #EFF6FD;
    border-color: #EFF6FD;
  }

  &:active {
    background-color: #DDEDFC;
    border-color: #DDEDFC;
  }
}

.sniff-ext-btn-warn {
  color: #fff;
  background: #CBA166;
  border: 1px solid #CBA166;
  ;
}
</style>
