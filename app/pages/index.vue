<template>
  <main class="flex flex-col items-center">
    <h1 class="m-6 text-3xl">
      Family tree
    </h1>

    <PersonList :persons="familyData.persons" />
  </main>
</template>

<script setup lang="ts">
import { familyData } from '~~/data/familyData'
</script>
