<template>
  <h1 :class="cls">
    <slot />
  </h1>
</template>
<script setup lang="ts">
const props = defineProps<{
  small?: boolean
}>();

const cls = `${props.small ? 'text-xl' : 'text-2xl'} grow`;
</script>
