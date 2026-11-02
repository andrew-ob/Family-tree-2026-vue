<template>
  <NuxtLink :to="`/person/${id}`">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
