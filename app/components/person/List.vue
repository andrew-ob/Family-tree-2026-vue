<template>
  <ul>
    <li
      v-for="person in persons"
      :key="person.id"
    >
      <NuxtLink :to="`/person/${person.id}`">
        <PersonCardInfo
          :key="person.id"
          :person="person"
        />
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Person } from '~~/shared/types/familyTypes'

defineProps<{ persons: Person[] }>()
</script>
