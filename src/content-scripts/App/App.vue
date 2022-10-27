<template>
    <div>
        {{ a }}
    </div>
</template>
<script lang="ts" setup>
import { ref, Ref } from 'vue'
const a: Ref<string> = ref('extension-app')
const update = () => {
  console.log(a)
}
</script>
<style lang="scss" scoped>

</style>
