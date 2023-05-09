<template>

  <input class="dropdown-checkbox hidden" type="checkbox" :id="inputId">
  <div class="dropdown-container flex flex-col font-display">
    <label class="flex flex-row p-6" :for="inputId">
      <Heading>{{ props.name }}</Heading>
    </label>
    <component :is="props.contentEl ?? 'div'" class="dropdown-content m-3 mt-0 divide-y">
      <slot :item="item" />
    </component>
  </div>

</template>
<script setup lang="tsx">
import { FunctionalComponent } from 'vue';

const props = defineProps<{
  name: string,
  contentEl?: string,
  itemEl?: string,
}>();

const inputId = `dropdown-${Math.random().toString(36).substring(2)}`;

const item: FunctionalComponent = (_, { slots }) => {
  return h(props.itemEl ?? 'div', {
    class: 'p-6'
  }, [
    slots.default?.()
  ]);
};
</script>
<style lang="postcss" scoped>
input.dropdown-checkbox ~ .dropdown-container>.dropdown-content {
  display: none;
}

input.dropdown-checkbox:checked ~ .dropdown-container>.dropdown-content {
  display: block;
}
input.dropdown-checkbox:checked ~ .dropdown-container {
  @apply bg-slate-200;
}
input.dropdown-checkbox:checked ~ .dropdown-container>.dropdown-content {
  @apply bg-slate-300 rounded-xl;
}
</style>
