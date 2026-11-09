<template>
  <div
    class="p-4 min-w-29 min-h-13.25 flex text-base hover:bg-surface rounded-full"
  >
    <div
      class="rounded-3xl p-0.5 mr-1.25"
      :class="{
        'bg-blue-300': person.sex === 'male',
        'bg-pink-300': person.sex === 'female',
        'bg-gray-300': person.sex === 'unknown' }"
    >
      <span class="sr-only">{{ sexLabel }}</span>
    </div>

    <div>
      <div>
        <p class="text-lg">
          {{ person.firstName }} {{ person.lastName }}
        </p>
      </div>

      <div class="flex gap-1 text-neutral-700">
        <p>
          {{ person.birth?.date || 'XXXX' }} - {{ person.death?.date || 'XXXX' }}
        </p>
        <p>
          {{ person.birth?.place || '?' }} - {{ person.death?.place || '?' }}
        </p>
      </div>
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
