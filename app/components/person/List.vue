<template>
  <ul v-if="persons.length">
    <li
      v-for="person in persons"
      :key="person.id"
    >
      <PersonLinkPage :id="person.id">
        <PersonCardInfo
          :person="person"
        />
      </PersonLinkPage>
    </li>
  </ul>

  <p v-else>
    Aucune personne trouvée
  </p>
</template>

<script setup lang="ts">
import type { Person } from '~~/shared/types/familyTypes'

defineProps<{ persons: Person[] }>()
</script>
