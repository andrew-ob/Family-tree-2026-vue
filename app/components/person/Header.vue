<template>
  <h1>{{ person.firstName }} {{ person.lastName }}</h1>

  <div v-if="hasBirthInfo || hasDeathInfo">
    <p v-if="hasBirthInfo">
      {{ birthText }}
    </p>

    <p v-if="hasDeathInfo">
      {{ deathText }}
    </p>
  </div>
</template>

<script setup lang="ts">
type HeaderProps = {
  person: Person
}

const { person } = defineProps<HeaderProps>()

const birthLabel = computed(() => {
  if (person.sex === 'male') return 'Né'
  if (person.sex === 'female') return 'Née'
  return 'Né(e)'
})

const deathLabel = computed(() => {
  if (person.sex === 'male') return 'Décédé'
  if (person.sex === 'female') return 'Décédée'
  return 'Décédé(e)'
})

const hasBirthInfo = computed(() => !!(person.birth?.date || person.birth?.place))
const hasDeathInfo = computed(() => !person.isAlive)

const buildText = (label: string, date?: string, place?: string) =>
  [label, date && `en ${date}`, place && `à ${place}`].filter(Boolean).join(' ')

const birthText = computed(() => buildText(birthLabel.value, person.birth?.date, person.birth?.place))
const deathText = computed(() => buildText(deathLabel.value, person.death?.date, person.death?.place))
</script>
