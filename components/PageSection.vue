<template>
  <component :is="el" class="flex flex-row p-6 space-x-6 items-center font-display" :href="props.href">
    <img :class="iconClass" :src="props.icon" v-if="props.icon">
    <h1 :class="nameClass">{{ props.left }}</h1>
    <h3 :class="valueClass">{{ props.right }}</h3>
  </component>
</template>
<script setup lang="ts">
const props = defineProps<{
  icon?: string,
  left: string,
  href?: string,
  right: string,

  small?: boolean,
}>();

const el = (props.href != null) ? 'a' : 'section';

const iconClass = `rounded-full ${props.small ? 'w-12' : 'w-16'} ${props.small ? 'h-12' : 'h-16'}`;
const nameClass = `${props.small ? 'text-xl' : 'text-2xl'} grow`;
const valueClass = `${props.small ? 'text-lg' : 'text-xl'} ${el === 'a' ? 'text-sky-700' : 'text-slate-700'}`;
</script>
