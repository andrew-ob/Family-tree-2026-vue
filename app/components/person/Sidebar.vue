<template>
  <aside class="relative bg-bg h-full min-h-0 overflow-y-auto overscroll-contain">
    <PersonHeadSidebar
      v-model:first-name="criteria.firstName"
      v-model:last-name="criteria.lastName"
      @search="search"
      @reset="reset"
    />

    <PersonList :persons="results" />
  </aside>
</template>

<script setup lang="ts">
const { criteria, results, search, reset } = usePersonSearch()
</script>
