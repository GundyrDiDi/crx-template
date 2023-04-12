<template>
    <svg class="icon">
        <use :xlink:href="'#' + name" />
    </svg>
</template>

<script lang="ts" setup>
// require "svg-sprite-loader"
// vue.config.js make chain-webpack use the plugin
import { defineProps } from 'vue'
const importAll = (requireContext: any) => requireContext.keys().forEach(requireContext)
importAll(require.context('@/assets/svg', true, /\.svg$/))
defineProps(['name'])

</script>

<style lang="scss" scoped>
.icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
