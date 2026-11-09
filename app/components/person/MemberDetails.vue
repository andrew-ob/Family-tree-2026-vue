<template>
  <main>
    <div v-if="memberDetails">
      <PersonHeader
        :person="memberDetails.person"
      />

      <PersonSummaryList
        title="Parents"
        :persons="memberDetails.parents"
      />

      <PersonSummaryList
        title="Enfants"
        :persons="memberDetails.children"
      />

      <PersonSummaryList
        title="Frères et soeurs"
        :persons="memberDetails.siblings.map(s => s.person)"
      />

      <PersonSummaryList
        title="Partenaires"
        :persons="memberDetails.partners"
      />
    </div>

    <div v-else>
      Personne introuvable
    </div>
  </main>
</template>

<script setup lang="ts">
interface MemberDetailsProps {
  memberId: string
}

const { memberId } = defineProps<MemberDetailsProps>()

const { getPersonDetails } = useFamily()

const memberDetails = computed(() => getPersonDetails(memberId))
</script>
