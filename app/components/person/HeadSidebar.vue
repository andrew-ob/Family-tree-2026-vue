<template>
  <div>
    <div>
      <h1 class="m-6 text-3xl">
        Family tree
      </h1>

      <p>{{ memberCount }} {{ memberCount > 1 ? 'membres' : 'membre' }}</p>
    </div>

    <PersonSearchForm
      v-model:first-name="firstName"
      v-model:last-name="lastName"
      @search="emit('search')"
      @reset="emit('reset')"
    />
  </div>
</template>

<script setup lang="ts">
interface HeaderSidebarProps {
  memberCount: number
}
defineProps<HeaderSidebarProps>()

const firstName = defineModel<string>('firstName', { default: '' })
const lastName = defineModel<string>('lastName', { default: '' })

const emit = defineEmits<{ search: [], reset: [] }>()
</script>
