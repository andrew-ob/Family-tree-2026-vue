<template>
  <div
    v-if="persons.length > 0"
    class="m-4"
  >
    <h2>{{ title }}</h2>
    <ul>
      <li
        v-for="person in persons"
        :key="person.id"
      >
        <PersonSummary
          :person="person"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  persons: Person[]
}>()
</script>
