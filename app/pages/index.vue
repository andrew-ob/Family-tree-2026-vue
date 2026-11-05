<template>
  <main class="flex flex-col items-center">
    <h1 class="m-6 text-3xl">
      Family tree
    </h1>

    <PersonSearchForm
      v-model:first-name="criteria.firstName"
      v-model:last-name="criteria.lastName"
    />
    <PersonList :persons="results" />
  </main>
</template>

<script setup lang="ts">
import type { PersonSearchCriteria } from '~~/shared/types/familyTypes'

const { searchPersons } = useFamily()

const criteria = reactive<PersonSearchCriteria>({ firstName: '', lastName: '' })
const results = computed(() => searchPersons(criteria))
const { family } = useFamily()
</script>
