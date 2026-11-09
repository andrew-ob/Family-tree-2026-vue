<template>
  <NuxtLink :to="`/?member=${id}`">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
