<template>
  <main class="flex flex-col items-center">
    <h1 class="m-6 text-3xl">
      Family tree
    </h1>

    <PersonList :persons="family.persons" />
  </main>
</template>

<script setup lang="ts">
const { family } = useFamily()
</script>
