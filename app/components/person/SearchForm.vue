<template>
  <form
    class="flex gap-4 m-6"
    role="search"
    @submit.prevent="emit('search')"
    @reset.prevent="emit('reset')"
  >
    <label class="flex flex-col">
      Prénom
      <input
        v-model="firstName"
        name="firstName"
        type="search"
        class="rounded p-2"
      >
    </label>

    <label class="flex flex-col">
      Nom
      <input
        v-model="lastName"
        name="lastName"
        type="search"
        class="rounded p-2"
      >
    </label>

    <button
      type="submit"
    >
      Rechercher
    </button>

    <button
      type="reset"
    >
      Effacer
    </button>
  </form>
</template>

<script setup lang="ts">
const firstName = defineModel<string>('firstName', { default: '' })
const lastName = defineModel<string>('lastName', { default: '' })

const emit = defineEmits<{ search: [], reset: [] }>()
</script>
