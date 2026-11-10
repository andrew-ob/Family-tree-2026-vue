<template>
  <main class="grid h-full grid-cols-[400px_1fr] grid-rows-[minmax(0,1fr)] bg-bg overflow-hidden">
    <PersonSidebar v-if="!memberId" />

    <PersonMemberDetails
      v-else
      :member-id="memberId"
    />

    <div class="bg-surface rounded-[32px]" />
  </main>
</template>

<script setup lang="ts">
const { memberId } = useSelectedMember()
</script>
