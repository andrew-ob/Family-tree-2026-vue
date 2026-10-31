<template>
  <main>
    <div v-if="person">
      <div>{{ person.firstName }}</div>
      <div>{{ person.lastName }}</div>
      <div>{{ person.birthDate }}</div>
      <div>{{ person.deathDate }}</div>
      <div>{{ person.sex }}</div>
    </div>

    <div v-else>
      Personne introuvable
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const { getPersonById } = useFamily()

const person = computed(() => getPersonById(String(route.params.id)))
</script>
