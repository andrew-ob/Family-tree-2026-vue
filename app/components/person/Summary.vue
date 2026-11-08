<template>
  <PersonLinkPage :id="person.id">
    {{ person.firstName }} {{ person.lastName }}
  </PersonLinkPage>

  <span>{{ person.birth?.date }}</span>
  <span
    v-if="person.birth?.date && person.death?.date"
  >-</span>
  <span>{{ person.death?.date }}</span>
</template>

<script setup lang="ts">
defineProps<{
  person: Person
}>()
</script>
