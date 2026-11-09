import type { PersonSearchCriteria } from '~~/shared/types/familyTypes'

export function usePersonSearch() {
  const { searchPersons } = useFamily()

  const criteria = reactive<PersonSearchCriteria>({ firstName: '', lastName: '' })
  const appliedCriteria = ref<PersonSearchCriteria>({ ...criteria })

  const results = computed(() => searchPersons(appliedCriteria.value))

  function search() {
    appliedCriteria.value = { ...criteria }
  }

  function reset() {
    criteria.firstName = ''
    criteria.lastName = ''
    search()
  }

  return {
    criteria,
    results,
    search,
    reset,
  }
}
