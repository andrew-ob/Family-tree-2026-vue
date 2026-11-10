<template>
  <span
    aria-hidden="true"
    class="inline-flex flex-none items-center justify-center rounded-full font-bold leading-none"
    :class="[tint, SIZES[size]]"
  >{{ initials }}</span>
</template>

<script setup lang="ts">
import type { Person } from '~~/shared/types/familyTypes'

type Sex = 'female' | 'male' | 'unknown'
type Size = 'list' | 'relations' | 'tree' | 'fan'

interface AvatarProps {
  person: Partial<Pick<Person, 'firstName' | 'lastName'>>
  sex?: Sex
  showSex?: boolean
  size?: Size
  onFocus?: boolean
}

const props = withDefaults(defineProps<AvatarProps>(), { sex: 'unknown', showSex: true, size: 'list', onFocus: false })

const TINTS: Record<Sex, string> = {
  female: 'bg-person-female-bg text-person-female-ink',
  male: 'bg-person-male-bg text-person-male-ink',
  unknown: 'bg-person-unknown-bg text-person-unknown-ink',
}

const SIZES: Record<Size, string> = {
  list: 'size-[40px] text-[11px]',
  relations: 'size-[32px] text-[11.5px]',
  tree: 'size-[42px] text-[13px]',
  fan: 'size-[34px] text-[11.5px]',
}

// Shown when neither the first name nor the last name is known
const UNKNOWN_INITIALS = '?'

const initials = computed(() => {
  const first = [...(props.person.firstName ?? '').trim()][0] ?? ''
  const last = [...(props.person.lastName ?? '').trim()][0] ?? ''
  return (first + last).toLocaleUpperCase('fr') || UNKNOWN_INITIALS
})

const tint = computed(() => {
  if (props.onFocus) return 'bg-bg/24 text-bg'
  return TINTS[props.showSex ? props.sex : 'unknown']
})
</script>
