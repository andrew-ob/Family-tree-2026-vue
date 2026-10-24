<template>
  <main class="min-h-screen bg-red-100 flex flex-col items-center pt-16">
    <h1 class="m-6 text-3xl">
      Family tree
    </h1>

    <PersonList :persons="family.persons" />
  </main>
</template>

<script setup lang="ts">
import { family } from '~~/data/familyData'
</script>
