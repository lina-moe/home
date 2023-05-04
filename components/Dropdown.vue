<template>

  <input class="hidden" type="checkbox" :id="inputId">
  <div class="dropdown-container flex flex-col p-6 space-y-6 font-display">
    <label class="flex flex-row" :for="inputId">
      <Heading>{{ props.name }}</Heading>
    </label>
    <div class="dropdown-content">
      <slot />
    </div>
  </div>

</template>
<script setup lang="ts">
const props = defineProps<{
  name: string,
}>();

const inputId = `dropdown-${Math.random().toString(36).substring(2)}`;
</script>
<style lang="postcss" scoped>
input ~ .dropdown-container>.dropdown-content {
  display: none;
}

input:checked ~ .dropdown-container>.dropdown-content {
  display: block;
}
input:checked ~ .dropdown-container {
  @apply bg-slate-200;
}
</style>
