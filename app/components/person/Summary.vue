<template>
  <PersonLinkPage :id="person.id">
    {{ person.firstName }} {{ person.lastName }}
  </PersonLinkPage>

  <span>{{ person.birthDate }}</span>
  <span
    v-if="person.birthDate && person.deathDate"
  >-</span>
  <span>{{ person.deathDate }}</span>
</template>

<script setup lang="ts">
defineProps<{
  person: Person
}>()
</script>
