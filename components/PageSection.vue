<template>
  <component :is="el" :class="_class" :href="props.href">
    <slot>
      <img :class="iconClass" :src="props.icon" v-if="props.icon">
      <Heading :small="props.small">{{ props.left }}</Heading>
      <h3 :class="valueClass">{{ props.right }}</h3>
    </slot>
  </component>
</template>
<script setup lang="ts">
const props = defineProps<{
  icon?: string,
  left?: string,
  href?: string,
  right?: string,

  small?: boolean,
  noPadding?: boolean,
  class?: string,
}>();

const el = (props.href != null) ? 'a' : 'section';

const _class = `flex flex-row ${props.noPadding ? '' : 'p-6'} space-x-6 items-center font-display ${props.class ?? ''}`;
const iconClass = `rounded-full ${props.small ? 'w-12' : 'w-16'} ${props.small ? 'h-12' : 'h-16'}`;
const valueClass = `${props.small ? 'text-lg' : 'text-xl'} ${el === 'a' ? 'text-sky-700' : 'text-slate-700'}`;
</script>
