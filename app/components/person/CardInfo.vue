<template>
  <div
    class="p-4 my-2 min-w-29 min-h-13.25 flex bg-red-500 hover:bg-red-900 rounded-xl text-white"
  >
    <div
      class="rounded-2xl p-0.5 mr-1.25"
      :class="{
        'bg-blue-300': person.sex === 'male',
        'bg-pink-300': person.sex === 'female',
        'bg-gray-300': person.sex === 'unknown' }"
    >
      <span class="sr-only">{{ sexLabel }}</span>
    </div>

    <div>
      <p>{{ person.firstName }} {{ person.lastName }}</p>

      <p>{{ person.birth?.date || 'XXXX' }} - {{ person.death?.date || 'XXXX' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Person } from '~~/shared/types/familyTypes'

interface CardProps {
  person: Person
}

const { person } = defineProps<CardProps>()

const sexLabel = computed(() => {
  if (person.sex === 'female') return 'Femme'
  if (person.sex === 'male') return 'Homme'
  return 'Sexe inconnu'
})
</script>
