<template>
  <main>
    <h1>Family tree</h1>

    <ul>
      <li
        v-for="person in family.persons"
        :key="person.id"
      >
        {{ person.firstName }} {{ person.lastName }}
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { family } from '~~/data/familyData'
</script>
