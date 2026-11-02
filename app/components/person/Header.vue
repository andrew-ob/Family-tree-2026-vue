<template>
  <h1>{{ person.firstName }} {{ person.lastName }}</h1>

  <div v-if="person.birthDate || person.deathDate">
    <p v-if="person.birthDate">
      {{ birthLabel }} {{ person.birthDate }}
    </p>

    <p v-if="person.deathDate">
      {{ deathLabel }} {{ person.deathDate }}
    </p>
  </div>
</template>

<script setup lang="ts">
type HeaderProps = {
  person: Person
}

const { person } = defineProps<HeaderProps>()

const birthLabel = computed(() => {
  if (person.sex === 'male') return 'Né en'
  if (person.sex === 'female') return 'Née en'
  return 'Né(e) en'
})

const deathLabel = computed(() => {
  if (person.sex === 'male') return 'Décédé en'
  if (person.sex === 'female') return 'Décédée en'
  return 'Décédé(e) en'
})
</script>
