import { describe, expect, it } from 'vitest'

import type { FamilyData, Person } from '../types/family'
import { getChildren, getDescendants, getFather, getMother, getParents, getPersonById, getPersonsByName, getSiblings } from './family-utils'

/** Builds a person; only the fields that matter for a test need to be given. */
const person = (overrides: Partial<Person> & { id: string }): Person => ({
  firstName: 'Prénom',
  lastName: 'Nom',
  sex: 'unknown',
  ...overrides,
})

/** Builds a family from persons only (no unions), for tests with their own specific data. */
const family = (...persons: Person[]): FamilyData => ({ persons, unions: [] })

/** General data, shared by the basic cases. Specific cases define their own data inside the test. */
const data: FamilyData = {
  persons: [
    // Marie has 3 children with 3 different fathers
    person({ id: 'marieId', firstName: 'Marie', lastName: 'Martin', sex: 'female' }),
    person({ id: 'paulId', firstName: 'Paul', lastName: 'Dupont', sex: 'male' }),
    person({ id: 'jeanId', firstName: 'Jean', lastName: 'Blanc', sex: 'male' }),
    person({ id: 'lucId', firstName: 'Luc', lastName: 'Roux', sex: 'male' }),

    // Marie's children
    person({ id: 'leaId', firstName: 'Léa', lastName: 'Dupont', sex: 'female', fatherId: 'paulId', motherId: 'marieId' }),
    person({ id: 'tomId', firstName: 'Tom', lastName: 'Blanc', sex: 'male', fatherId: 'jeanId', motherId: 'marieId' }),
    person({ id: 'zoeId', firstName: 'Zoé', lastName: 'Roux', sex: 'female', fatherId: 'lucId', motherId: 'marieId' }),

    // Pierre has 2 children with 2 different mothers
    person({ id: 'pierreId', firstName: 'Pierre', lastName: 'Martin', sex: 'male' }),
    person({ id: 'anneId', firstName: 'Anne', lastName: 'Fournier', sex: 'female' }),
    person({ id: 'julieId', firstName: 'Julie', lastName: 'Moreau', sex: 'female' }),

    // Chloé and the second Marie Martin are siblings, but have different mothers
    person({ id: 'chloeId', firstName: 'Chloé', lastName: 'Martin', sex: 'female', fatherId: 'pierreId', motherId: 'anneId' }),
    person({ id: 'marie2Id', firstName: 'Marie', lastName: 'Martin', sex: 'female', fatherId: 'pierreId', motherId: 'julieId' }),
  ],

  unions: [
    { id: 'u1', partner1Id: 'paulId', partner2Id: 'marieId', endReason: 'divorce' },
    { id: 'u2', partner1Id: 'jeanId', partner2Id: 'marieId', endReason: 'divorce' },
    { id: 'u3', partner1Id: 'lucId', partner2Id: 'marieId' },
    { id: 'u4', partner1Id: 'pierreId', partner2Id: 'anneId', endReason: 'death' },
    { id: 'u5', partner1Id: 'pierreId', partner2Id: 'julieId' },
  ],
}

describe('family-utils', () => {
  describe('getPersonById', () => {
    it('should return the person with the given id', () => {
      expect(getPersonById(data, 'leaId')?.firstName).toBe('Léa')
    })

    it('should return undefined when the id doesn\'t exist', () => {
      expect(getPersonById(data, 'georgeId')).toBeUndefined()
    })
  })

  describe('getPersonsByName', () => {
    it('should return the persons with the given name', () => {
      expect(getPersonsByName(data, 'Tom', 'Blanc').map(p => p.id)).toEqual(['tomId'])
    })

    it('should return every person sharing the same name', () => {
      expect(getPersonsByName(data, 'Marie', 'Martin').map(p => p.id)).toEqual(['marieId', 'marie2Id'])
    })

    it.each([
      ['LÉA', 'DUPONT'],
      ['léa', 'dupont'],
      ['lea', 'DUPONT'],
      ['  Léa ', ' Dupont  '],
    ])('should ignore case, accents and spaces when searching "%s" "%s"', (firstName, lastName) => {
      expect(getPersonsByName(data, firstName, lastName).map(p => p.id)).toEqual(['leaId'])
    })

    it('should return an empty array when no person has the given name', () => {
      expect(getPersonsByName(data, 'George', 'Martin')).toEqual([])
    })

    it('should not match when first and last names are swapped', () => {
      expect(getPersonsByName(data, 'Martin', 'Tom')).toEqual([])
    })

    it('should not match on a partial name', () => {
      expect(getPersonsByName(data, 'To', 'Martin')).toEqual([])
    })

    it('should return an empty array when the family is empty', () => {
      expect(getPersonsByName(family(), 'Tom', 'Martin')).toEqual([])
    })

    it.each([
      ['', ''],
      ['Tom', ''],
      ['', 'Blanc'],
      ['   ', '   '],
    ])('should return an empty array when searching empty name "%s" "%s"', (firstName, lastName) => {
      expect(getPersonsByName(data, firstName, lastName)).toEqual([])
    })
  })

  describe('compound names', () => {
    const compoundData = family(
      person({ id: 'annesophieId', firstName: 'Anne-Sophie', lastName: 'Le Gall', sex: 'female' }),
    )

    it.each([
      ['Anne-Sophie', 'Le Gall'],
      ['ANNE-SOPHIE', 'LE GALL'],
      ['anne-sophie', 'le gall'],
      ['  Anne-Sophie ', ' Le Gall  '],
    ])('should find a person with a compound name when searching "%s" "%s"', (firstName, lastName) => {
      expect(getPersonsByName(compoundData, firstName, lastName).map(p => p.id)).toEqual(['annesophieId'])
    })

    it.each([
      ['Anne Sophie', 'Le Gall'],
      ['AnneSophie', 'Le Gall'],
      ['Anne-Sophie', 'Le  Gall'],
      ['Anne-Sophie', 'LeGall'],
      ['Anne', 'Le Gall'],
      ['Anne-Sophie', 'Gall'],
    ])('should not match a compound name written differently: "%s" "%s"', (firstName, lastName) => {
      expect(getPersonsByName(compoundData, firstName, lastName)).toEqual([])
    })
  })

  describe('getFather', () => {
    it('should return the father of a person', () => {
      expect(getFather(data, 'leaId')?.id).toBe('paulId')
    })

    it('should return undefined when the father is unknown', () => {
      const specificData = family(
        person({ id: 'ninaId' }),
        person({ id: 'samId', motherId: 'ninaId' }),
      )

      expect(getFather(specificData, 'samId')).toBeUndefined()
    })

    it('should return undefined when the person does not exist', () => {
      expect(getFather(data, 'nobodyId')).toBeUndefined()
    })

    it('should return undefined when fatherId points to a missing person', () => {
      const specificData = family(
        person({ id: 'sophieId', fatherId: 'marcId' }),
      )

      expect(getFather(specificData, 'sophieId')).toBeUndefined()
    })
  })

  describe('getMother', () => {
    it('should return the mother of a person', () => {
      expect(getMother(data, 'leaId')?.id).toBe('marieId')
    })

    it('should return undefined when no mother is recorded', () => {
      const specificData = family(
        person({ id: 'marcId' }),
        person({ id: 'sophieId', fatherId: 'marcId' }),
      )

      expect(getMother(specificData, 'sophieId')).toBeUndefined()
    })

    it('should return undefined when the person does not exist', () => {
      expect(getMother(data, 'nobodyId')).toBeUndefined()
    })

    it('should return undefined when motherId points to a missing person', () => {
      const specificData = family(
        person({ id: 'samId', motherId: 'liliId' }),
      )

      expect(getMother(specificData, 'samId')).toBeUndefined()
    })
  })

  describe('getParents', () => {
    it('should return the father then the mother', () => {
      expect(getParents(data, 'leaId').map(p => p.id)).toEqual(['paulId', 'marieId'])
    })

    it('should return only the mother when no father is recorded', () => {
      const specificData = family(
        person({ id: 'ninaId' }),
        person({ id: 'theoId', motherId: 'ninaId' }),
      )

      expect(getParents(specificData, 'theoId').map(p => p.id)).toEqual(['ninaId'])
    })

    it('should return only the father when no mother is recorded', () => {
      const specificData = family(
        person({ id: 'marcId' }),
        person({ id: 'sophieId', fatherId: 'marcId' }),
      )

      expect(getParents(specificData, 'sophieId').map(p => p.id)).toEqual(['marcId'])
    })

    it('should return an empty array when no parent is recorded', () => {
      expect(getParents(data, 'paulId')).toEqual([])
    })

    it('should return an empty array when the person does not exist', () => {
      expect(getParents(data, 'nobodyId')).toEqual([])
    })

    it('should ignore a parent id that points to a missing person', () => {
      const specificData = family(
        person({ id: 'sophieId', fatherId: 'marcId' }),
        person({ id: 'samId', motherId: 'liliId' }),
        person({ id: 'maxId', fatherId: 'marcId', motherId: 'liliId' }),
      )

      expect(getParents(specificData, 'sophieId')).toEqual([])
      expect(getParents(specificData, 'samId')).toEqual([])
      expect(getParents(specificData, 'maxId')).toEqual([])
    })
  })

  describe('getChildren', () => {
    it('should return the children of a mother', () => {
      expect(getChildren(data, 'marieId').map(p => p.id)).toEqual(['leaId', 'tomId', 'zoeId'])
    })

    it('should return the children of a father', () => {
      expect(getChildren(data, 'pierreId').map(p => p.id)).toEqual(['chloeId', 'marie2Id'])
    })

    it('should return only the children of that parent', () => {
      expect(getChildren(data, 'paulId').map(p => p.id)).toEqual(['leaId'])
    })

    it('should return an empty array when the person has no child', () => {
      expect(getChildren(data, 'leaId')).toEqual([])
    })

    it('should return an empty array when the person does not exist', () => {
      expect(getChildren(data, 'nobodyId')).toEqual([])
    })
  })

  describe('getSiblings', () => {
    it('should return half-siblings sharing only the mother', () => {
      const siblings = getSiblings(data, 'leaId')
      expect(siblings.map(s => [s.person.id, s.kind])).toEqual([
        ['tomId', 'half'],
        ['zoeId', 'half'],
      ])
    })

    it('should return half-siblings sharing only the father', () => {
      const siblings = getSiblings(data, 'chloeId')
      expect(siblings.map(s => [s.person.id, s.kind])).toEqual([['marie2Id', 'half']])
    })

    it('should return full siblings sharing both parents', () => {
      const specificData = family(
        person({ id: 'hugoId' }),
        person({ id: 'claraId' }),
        person({ id: 'emmaId', fatherId: 'hugoId', motherId: 'claraId' }),
        person({ id: 'noeId', fatherId: 'hugoId', motherId: 'claraId' }),
      )

      const siblings = getSiblings(specificData, 'emmaId')
      expect(siblings.map(s => [s.person.id, s.kind])).toEqual([['noeId', 'full']])
    })

    it('should not include the person itself', () => {
      expect(getSiblings(data, 'leaId').map(s => s.person.id)).not.toContain('leaId')
    })

    it('should not treat persons with unknown parents as siblings', () => {
      // paulId, marieId, jeanId... all have no recorded parent
      expect(getSiblings(data, 'paulId')).toEqual([])
    })

    it('should return an empty array when the person has no sibling', () => {
      const specificData = family(
        person({ id: 'ninaId' }),
        person({ id: 'theoId', motherId: 'ninaId' }),
        person({ id: 'lilyId', motherId: 'otherMotherId' }),
      )

      expect(getSiblings(specificData, 'theoId')).toEqual([])
    })

    it('should return an empty array when the person does not exist', () => {
      expect(getSiblings(data, 'nobodyId')).toEqual([])
    })
  })

  describe('getDescendants', () => {
    it('should return the children of a person', () => {
      expect(getDescendants(data, 'marieId').map(p => p.id)).toEqual(['leaId', 'tomId', 'zoeId'])
    })

    it('should return an empty array when the person has no descendant', () => {
      expect(getDescendants(data, 'leaId')).toEqual([])
    })

    it('should return an empty array when the person does not exist', () => {
      expect(getDescendants(data, 'nobodyId')).toEqual([])
    })

    it('should return descendants generation by generation, through fathers and mothers', () => {
      const specificData = family(
        person({ id: 'grandpaId' }),
        person({ id: 'aliceId', fatherId: 'grandpaId' }),
        person({ id: 'bobId', fatherId: 'grandpaId' }),
        person({ id: 'carolId', motherId: 'aliceId' }), // child of Alice, through the mother
        person({ id: 'danId', fatherId: 'bobId' }), // child of Bob, through the father
        person({ id: 'eveId', motherId: 'carolId' }), // great-grandchild
      )

      expect(getDescendants(specificData, 'grandpaId').map(p => p.id)).toEqual([
        'aliceId',
        'bobId',
        'carolId',
        'danId',
        'eveId',
      ])
    })

    it('should not include the person itself, its ancestors or its siblings', () => {
      const specificData = family(
        person({ id: 'grandpaId' }),
        person({ id: 'parentId', fatherId: 'grandpaId' }),
        person({ id: 'siblingId', fatherId: 'grandpaId' }),
        person({ id: 'childId', motherId: 'parentId' }),
      )

      expect(getDescendants(specificData, 'parentId').map(p => p.id)).toEqual(['childId'])
    })

    it('should return a descendant only once when it is reachable through both parents', () => {
      const specificData = family(
        person({ id: 'grandpaId' }),
        person({ id: 'aliceId', fatherId: 'grandpaId' }),
        person({ id: 'bobId', fatherId: 'grandpaId' }),
        person({ id: 'xId', fatherId: 'bobId', motherId: 'aliceId' }), // child of two cousins
      )

      expect(getDescendants(specificData, 'grandpaId').map(p => p.id)).toEqual(['aliceId', 'bobId', 'xId'])
    })

    it('should stop and not loop forever when the data contains a cycle', () => {
      const specificData = family(
        person({ id: 'aId', fatherId: 'bId' }),
        person({ id: 'bId', fatherId: 'aId' }),
      )

      expect(getDescendants(specificData, 'aId').map(p => p.id)).toEqual(['bId'])
    })

    it('should return an empty array when a person is recorded as its own parent', () => {
      const specificData = family(
        person({ id: 'aId', fatherId: 'aId' }),
      )

      expect(getDescendants(specificData, 'aId')).toEqual([])
    })

    it('should return an empty array when the person is only referenced as a parent but does not exist', () => {
      const specificData = family(
        person({ id: 'sophieId', fatherId: 'marcId' }),
      )

      expect(getDescendants(specificData, 'marcId')).toEqual([])
    })
  })
})
