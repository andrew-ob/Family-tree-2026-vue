<template>
  <div>
    <h1 class="m-6 text-3xl">
      Family tree
    </h1>

    <PersonSearchForm
      v-model:first-name="firstName"
      v-model:last-name="lastName"
      @search="emit('search')"
      @reset="emit('reset')"
    />
  </div>
</template>

<script setup lang="ts">
const firstName = defineModel<string>('firstName', { default: '' })
const lastName = defineModel<string>('lastName', { default: '' })

const emit = defineEmits<{ search: [], reset: [] }>()
</script>
