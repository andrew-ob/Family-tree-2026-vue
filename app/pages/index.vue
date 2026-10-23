<template>
  <main>
    <h1>Family tree</h1>

    <PersonList :persons="family.persons" />
  </main>
</template>

<script setup lang="ts">
import { family } from '~~/data/familyData'
</script>
