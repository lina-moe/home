<template>
  <div class="max-w-screen-md mx-auto md:rounded-lg md:my-6 md:shadow-lg bg-slate-50 md:border-slate-150 md:border divide-y">
    <section class="flex flex-row space-x-6 items-center p-6 justify-center md:justify-start">
      <img class="rounded-full w-16 h-16" src="https://s3.us-east-005.backblazeb2.com/techlgbt/accounts/avatars/110/056/993/506/740/064/original/cfc38a25a40d26e0.png">
      <h1 class="font-display text-2xl grow">Leah</h1>
      <h3 class="font-display text-xl text-slate-700">she/her</h3>
    </section>

    <a class="flex flex-row p-6" v-for="link in links" :href="link.href">
      <h1 class="font-display text-xl grow">{{ link.name }}</h1>
      <h3 class="font-display text-lg text-sky-700">{{ link.alt }}</h3>
    </a>

    <section class="flex flex-row p-6 items-center justify-center">
      <h1 class="font-display text-2xl">⚠ Website under construction! nya~</h1>
    </section>
  </div>
</template>

<script setup lang="ts">
const links = [
  { name: 'GitHub', alt: '@nullium21', href: 'https://github.com/nullium21' },
  { name: 'Mastodon', alt: '@lina@tech.lgbt', href: 'https://tech.lgbt/@lina' },
];
</script>
