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
import { family } from '~~/data/familyData'
import { getPersonById } from '~~/shared/utils/family-utils'

const route = useRoute()

const person = computed(() => getPersonById(family, String(route.params.id)))
</script>
