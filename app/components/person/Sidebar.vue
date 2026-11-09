<template>
  <aside class="relative bg-bg h-full min-h-0 flex flex-col overflow-hidden p-3">
    <PersonHeadSidebar
      v-model:first-name="criteria.firstName"
      v-model:last-name="criteria.lastName"
      class="shrink-0"
      @search="search"
      @reset="reset"
    />

    <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain">
      <PersonList :persons="results" />
    </div>
  </aside>
</template>

<script setup lang="ts">
const { criteria, results, search, reset } = usePersonSearch()
</script>
