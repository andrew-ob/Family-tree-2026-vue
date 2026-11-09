import { beforeEach, describe, expect, it } from 'vitest'

import type { FamilyData } from '~~/shared/types/familyTypes'

import { usePersonSearch } from './usePersonSearch'

const fixture: FamilyData = {
  persons: [
    { id: 'paulId', firstName: 'Paul', lastName: 'Dupont', sex: 'male', isAlive: true },
    { id: 'leaId', firstName: 'Léa', lastName: 'Dupont', sex: 'female', isAlive: true },
    { id: 'marieId', firstName: 'Marie', lastName: 'Martin', sex: 'female', isAlive: true },
  ],
  unions: [],
}

const ids = (persons: { id: string }[]) => persons.map(p => p.id)

describe('usePersonSearch', () => {
  beforeEach(() => {
    useFamily().family.value = structuredClone(fixture)
  })

  it('should list everyone while no search has been made', () => {
    const { results } = usePersonSearch()

    expect(ids(results.value)).toEqual(['paulId', 'leaId', 'marieId'])
  })

  it('should not filter while the criteria are only being typed', () => {
    const { criteria, results } = usePersonSearch()

    criteria.lastName = 'Martin'

    expect(ids(results.value)).toEqual(['paulId', 'leaId', 'marieId'])
  })

  it('should filter on the criteria once the search is applied', () => {
    const { criteria, results, search } = usePersonSearch()

    criteria.lastName = 'Dupont'
    search()

    expect(ids(results.value)).toEqual(['paulId', 'leaId'])
  })

  it('should combine first name and last name', () => {
    const { criteria, results, search } = usePersonSearch()

    criteria.firstName = 'Léa'
    criteria.lastName = 'Dupont'
    search()

    expect(ids(results.value)).toEqual(['leaId'])
  })

  it('should return nothing when no one matches', () => {
    const { criteria, results, search } = usePersonSearch()

    criteria.firstName = 'Inconnu'
    search()

    expect(results.value).toEqual([])
  })

  it('should clear the criteria and list everyone again on reset', () => {
    const { criteria, results, search, reset } = usePersonSearch()
    criteria.lastName = 'Dupont'
    search()

    reset()

    expect(criteria).toEqual({ firstName: '', lastName: '' })
    expect(ids(results.value)).toEqual(['paulId', 'leaId', 'marieId'])
  })

  it('should keep the search state separate between calls', () => {
    const a = usePersonSearch()
    const b = usePersonSearch()

    a.criteria.lastName = 'Martin'
    a.search()

    expect(ids(a.results.value)).toEqual(['marieId'])
    expect(ids(b.results.value)).toEqual(['paulId', 'leaId', 'marieId'])
  })
})
