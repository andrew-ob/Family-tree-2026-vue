<template>
  <form
    class="mt-2"
    role="search"
    @submit.prevent="emit('search')"
    @reset.prevent="emit('reset')"
  >
    <div class="flex">
      <div>
        <label class="flex flex-col">
          Prénom
          <input
            v-model="firstName"
            name="firstName"
            type="search"
            class="rounded p-2"
          >
        </label>
      </div>

      <div>
        <label class="flex flex-col">
          Nom
          <input
            v-model="lastName"
            name="lastName"
            type="search"
            class="rounded p-2"
          >
        </label>
      </div>
    </div>

    <div class="flex gap-2">
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
    </div>
  </form>
</template>

<script setup lang="ts">
const firstName = defineModel<string>('firstName', { default: '' })
const lastName = defineModel<string>('lastName', { default: '' })

const emit = defineEmits<{ search: [], reset: [] }>()
</script>
