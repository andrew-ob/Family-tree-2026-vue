<template>
  <div class="py-4">
    <div>{{ person.firstName }} {{ person.lastName }}</div>
    <div>{{ person.sex }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Person } from '~~/shared/types/familyTypes'

defineProps<{
  person: Person
}>()
</script>
