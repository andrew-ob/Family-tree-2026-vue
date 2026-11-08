import { beforeEach, describe, expect, it } from 'vitest'

import type { FamilyData } from '~~/shared/types/familyTypes'

import { useFamily } from './useFamily'

const fixture: FamilyData = {
  persons: [
    { id: 'pereId', firstName: 'Paul', lastName: 'Dupont', sex: 'male', isAlive: true },
    { id: 'mereId', firstName: 'Marie', lastName: 'Martin', sex: 'female', isAlive: true },
    { id: 'filleId', firstName: 'Léa', lastName: 'Dupont', sex: 'female', isAlive: true, fatherId: 'pereId', motherId: 'mereId' },
    { id: 'filsId', firstName: 'Tom', lastName: 'Dupont', sex: 'male', isAlive: true, fatherId: 'pereId', motherId: 'mereId' },
    { id: 'petiteFilleId', firstName: 'Zoé', lastName: 'Dupont', sex: 'female', isAlive: true, fatherId: 'filsId' },
  ],
  unions: [{ id: 'u1', partner1Id: 'pereId', partner2Id: 'mereId' }],
}

describe('useFamily', () => {
  beforeEach(() => {
    useFamily().family.value = structuredClone(fixture)
  })

  it('should wire every helper to the family data', () => {
    const f = useFamily()

    expect(f.getPersonById('filleId')?.id).toBe('filleId')
    expect(f.searchPersons({ firstName: 'Léa', lastName: 'Dupont' }).map(p => p.id)).toEqual(['filleId'])
    expect(f.getFather('filleId')?.id).toBe('pereId')
    expect(f.getMother('filleId')?.id).toBe('mereId')
    expect(f.getParents('filleId').father?.id).toBe('pereId')
    expect(f.getParents('filleId').mother?.id).toBe('mereId')
    expect(f.getChildren('pereId').map(p => p.id)).toEqual(['filleId', 'filsId'])
    expect(f.getSiblings('filleId').map(s => s.person.id)).toEqual(['filsId'])
    expect(f.getDescendants('pereId').map(p => p.id)).toEqual(['filleId', 'filsId', 'petiteFilleId'])
    expect(f.getAncestors('petiteFilleId').map(p => p.id)).toEqual(['filsId', 'pereId', 'mereId'])
    expect(f.getPartners('pereId').map(p => p.id)).toEqual(['mereId'])
  })

  it('should share its state between calls and read it on every call', () => {
    const a = useFamily()
    const b = useFamily()

    a.family.value = { persons: [], unions: [] }

    expect(b.getPersonById('pereId')).toBeUndefined()
  })
})
