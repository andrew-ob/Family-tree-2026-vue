<template>
  <ul>
    <li
      v-for="person in persons"
      :key="person.id"
    >
      <PersonCardLink :id="person.id">
        <PersonCardInfo
          :person="person"
        />
      </PersonCardLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Person } from '~~/shared/types/familyTypes'

defineProps<{ persons: Person[] }>()
</script>
