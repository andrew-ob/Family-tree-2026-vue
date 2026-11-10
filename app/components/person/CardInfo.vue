<template>
  <div
    class="p-4 min-w-29 min-h-13.25 gap-3 flex text-base hover:bg-surface rounded-full items-center"
  >
    <UiAvatar
      :person="person"
      :sex="person.sex"
      size="list"
    />

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
</script>
