import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSelectedMember } from './useSelectedMember'

describe('useSelectedMember', () => {
  beforeEach(async () => {
    await useRouter().push({ path: '/', query: {} })
  })

  describe('memberId', () => {
    it('should be null when there is no member in the query', () => {
      const { memberId } = useSelectedMember()

      expect(memberId.value).toBeNull()
    })

    it('should read the member id from the query', async () => {
      await useRouter().push({ query: { member: 'paulId' } })

      const { memberId } = useSelectedMember()

      expect(memberId.value).toBe('paulId')
    })

    it('should be null when the member param is repeated', async () => {
      await useRouter().push({ query: { member: ['paulId', 'leaId'] } })

      const { memberId } = useSelectedMember()

      expect(memberId.value).toBeNull()
    })

    it('should follow the route when it changes', async () => {
      const { memberId } = useSelectedMember()

      await useRouter().push({ query: { member: 'leaId' } })
      expect(memberId.value).toBe('leaId')

      await useRouter().push({ query: {} })
      expect(memberId.value).toBeNull()
    })
  })

  describe('select', () => {
    it('should put the member id in the query', async () => {
      const { select, memberId } = useSelectedMember()

      await select('paulId')

      expect(useRoute().query).toEqual({ member: 'paulId' })
      expect(memberId.value).toBe('paulId')
    })

    it('should replace the previously selected member', async () => {
      await useRouter().push({ query: { member: 'paulId' } })
      const { select } = useSelectedMember()

      await select('leaId')

      expect(useRoute().query).toEqual({ member: 'leaId' })
    })

    it('should keep the other query params', async () => {
      await useRouter().push({ query: { lang: 'fr' } })
      const { select } = useSelectedMember()

      await select('paulId')

      expect(useRoute().query).toEqual({ lang: 'fr', member: 'paulId' })
    })
  })

  describe('clear', () => {
    it('should remove the member from the query', async () => {
      await useRouter().push({ query: { member: 'paulId' } })
      const { clear, memberId } = useSelectedMember()

      clear()

      await vi.waitFor(() => expect(useRoute().query).toEqual({}))
      expect(memberId.value).toBeNull()
    })

    it('should keep the other query params', async () => {
      await useRouter().push({ query: { member: 'paulId', lang: 'fr' } })
      const { clear } = useSelectedMember()

      clear()

      await vi.waitFor(() => expect(useRoute().query).toEqual({ lang: 'fr' }))
    })

    it('should do nothing when no member is selected', async () => {
      await useRouter().push({ query: { lang: 'fr' } })
      const { clear } = useSelectedMember()

      clear()
      await nextTick()

      expect(useRoute().query).toEqual({ lang: 'fr' })
    })
  })

  describe('memberLocation', () => {
    it('should build a location targeting the member', () => {
      const { memberLocation } = useSelectedMember()

      expect(memberLocation('paulId')).toEqual({ query: { member: 'paulId' } })
    })

    it('should keep the other query params', async () => {
      await useRouter().push({ query: { lang: 'fr', member: 'paulId' } })
      const { memberLocation } = useSelectedMember()

      expect(memberLocation('leaId')).toEqual({ query: { lang: 'fr', member: 'leaId' } })
    })

    it('should not navigate', async () => {
      await useRouter().push({ query: { member: 'paulId' } })
      const { memberLocation } = useSelectedMember()

      memberLocation('leaId')

      expect(useRoute().query).toEqual({ member: 'paulId' })
    })
  })
})
