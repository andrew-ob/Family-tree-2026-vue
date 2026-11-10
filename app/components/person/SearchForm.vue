<template>
  <form
    class="mt-2"
    role="search"
    @submit.prevent="emit('search')"
    @reset.prevent="emit('reset')"
  >
    <div class="flex gap-4">
      <div class="flex min-w-0 flex-col">
        <label
          class="mb-1.25 text-sm text-text/70"
          for="firstName"
        >
          Prénom
        </label>

        <input
          id="firstName"
          v-model="firstName"
          name="firstName"
          type="search"
          placeholder="Prénom"
          class="min-h-9 w-full rounded-full border border-ink/16 bg-surface px-3.5 py-1.5 text-[14px] text-ink caret-accent hover:border-ink/45 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent [&::-webkit-search-cancel-button]:hidden"
        >
      </div>

      <div class="flex min-w-0 flex-col">
        <label
          class="mb-1.25 text-sm text-text/70"
          for="lastName"
        >
          Nom
        </label>

        <input
          id="lastName"
          v-model="lastName"
          name="lastName"
          type="search"
          placeholder="Nom"
          class="min-h-9 w-full rounded-full border border-ink/16 bg-surface px-3.5 py-1.5 text-[14px] text-ink caret-accent hover:border-ink/45 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent [&::-webkit-search-cancel-button]:hidden"
        >
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
