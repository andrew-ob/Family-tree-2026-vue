<template>
  <div class="relative bg-bg h-full min-h-0 overflow-y-auto overscroll-contain">
    <h1 class="m-6 text-3xl">
      Family tree
    </h1>

    <PersonSearchForm
      v-model:first-name="criteria.firstName"
      v-model:last-name="criteria.lastName"
      @search="search"
      @reset="reset"
    />

    <PersonList
      v-if="results.length"
      :persons="results"
    />

    <p v-else>
      Aucune personne trouvée
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PersonSearchCriteria } from '~~/shared/types/familyTypes'

const { searchPersons } = useFamily()

const criteria = reactive<PersonSearchCriteria>({ firstName: '', lastName: '' })
const appliedCriteria = ref<PersonSearchCriteria>({ ...criteria })

const results = computed(() => searchPersons(appliedCriteria.value))

function search() {
  appliedCriteria.value = { ...criteria }
}

function reset() {
  criteria.firstName = ''
  criteria.lastName = ''
  search()
}
</script>
