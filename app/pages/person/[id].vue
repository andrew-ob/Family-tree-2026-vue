<template>
  <main>
    <div v-if="personDetails">
      <PersonHeader
        :person="personDetails.person"
      />

      <PersonSummaryList
        title="Parents"
        :persons="personDetails.parents"
      />

      <PersonSummaryList
        title="Enfants"
        :persons="personDetails.children"
      />

      <PersonSummaryList
        title="Frères et soeurs"
        :persons="personDetails.siblings.map(s => s.person)"
      />

      <PersonSummaryList
        title="Partenaires"
        :persons="personDetails.partners"
      />
    </div>

    <div v-else>
      Personne introuvable
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const { getPersonDetails } = useFamily()

const personDetails = computed(() => getPersonDetails(route.params.id as string))
</script>
