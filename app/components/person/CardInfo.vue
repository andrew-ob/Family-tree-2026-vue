<template>
  <div
    class="p-4 min-w-29 min-h-13.25 gap-3 flex text-base hover:bg-surface rounded-full items-center"
  >
    <div
      class="rounded-full shrink-0 h-10 w-10 flex justify-center items-center font-bold text-xs"
      :class="{
        'bg-person-male-bg ': person.sex === 'male',
        'bg-person-female-bg': person.sex === 'female',
        'bg-person-unknown-bg': person.sex === 'unknown' }"
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
          {{ person.birth?.place }}
          <span v-if="person.birth?.place && person.death?.place">-</span>
          {{ person.death?.place }}
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
