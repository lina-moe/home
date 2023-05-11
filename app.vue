<template>
  <div class="max-w-screen-md mx-auto md:rounded-lg md:my-6 shadow-lg bg-slate-50 md:border-slate-150 md:border divide-y">
    <PageSection icon="https://s3.us-east-005.backblazeb2.com/techlgbt/accounts/avatars/110/056/993/506/740/064/original/cfc38a25a40d26e0.png" left="Lina" right="she/her" />

    <PageSection small left="GitHub" right="@nullium21" href="https://github.com/nullium21" />
    <PageSection small left="Mastodon" right="@lina@tech.lgbt" href="https://tech.lgbt/@lina" />

    <Dropdown name="Projects" content-el="ul" item-el="li" v-slot="dropdown">
      <component :is="dropdown.item" v-for="project in projects" class="flex flex-col space-y-3">
        <PageSection small no-padding :left="project.name" :right="project.github ? 'GitHub' : undefined" :href="useGithubLink(project.github)" />
        <code class="text-xs text-slate-700" v-if="project.desc">{{ project.desc }}</code>
      </component>
    </Dropdown>

    <PageSection>
      <h1 class="font-display text-2xl grow text-center">⚠ Website under construction! nya~</h1>
    </PageSection>
  </div>
</template>
<script setup lang="ts">
const { $client } = useNuxtApp();

const { data: projects } = await $client.projects.useQuery();
</script>
