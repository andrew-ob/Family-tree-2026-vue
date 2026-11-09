const QUERY_KEY = 'member'

export function useSelectedMember() {
  const route = useRoute()
  const router = useRouter()

  const memberId = computed<string | null>(() => {
    const q = route.query[QUERY_KEY]
    return typeof q === 'string' ? q : null
  })

  const select = (id: string) =>
    router.push({ query: { ...route.query, [QUERY_KEY]: id } })

  const clear = () => {
    const { [QUERY_KEY]: _removed, ...rest } = route.query
    router.push({ query: rest })
  }

  const memberLocation = (id: string) => ({ query: { ...route.query, [QUERY_KEY]: id } })

  return {
    memberId,
    select,
    clear,
    memberLocation,
  }
}
