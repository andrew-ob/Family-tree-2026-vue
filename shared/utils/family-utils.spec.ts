import { describe, expect, it } from 'vitest'

import type { FamilyData } from '../types/family'
import { getChildren, getFather, getMother, getParents, getPersonById, getPersonsByName, getSiblings } from './family-utils'

const data: FamilyData = {
  persons: [
    // Marie has 3 children with 3 different fathers
    { id: 'marieId', firstName: 'Marie', lastName: 'Martin', sex: 'female' },
    { id: 'paulId', firstName: 'Paul', lastName: 'Dupont', sex: 'male' },
    { id: 'jeanId', firstName: 'Jean', lastName: 'Blanc', sex: 'male' },
    { id: 'lucId', firstName: 'Luc', lastName: 'Roux', sex: 'male' },

    // Marie's children
    { id: 'leaId', firstName: 'Léa', lastName: 'Dupont', sex: 'female', fatherId: 'paulId', motherId: 'marieId' },
    { id: 'tomId', firstName: 'Tom', lastName: 'Blanc', sex: 'male', fatherId: 'jeanId', motherId: 'marieId' },
    { id: 'zoeId', firstName: 'Zoé', lastName: 'Roux', sex: 'female', fatherId: 'lucId', motherId: 'marieId' },

    // Pierre has 2 children with 2 different mothers
    { id: 'pierreId', firstName: 'Pierre', lastName: 'Martin', sex: 'male' },
    { id: 'anneId', firstName: 'Anne', lastName: 'Fournier', sex: 'female' },
    { id: 'julieId', firstName: 'Julie', lastName: 'Moreau', sex: 'female' },

    // Chloe and Marie are siblings, but have different mothers
    { id: 'chloeId', firstName: 'Chloé', lastName: 'Martin', sex: 'female', fatherId: 'pierreId', motherId: 'anneId' },
    { id: 'marie2Id', firstName: 'Marie', lastName: 'Martin', sex: 'female', fatherId: 'pierreId', motherId: 'julieId' },

    // Sophie has a father that is not in the family data, and an unknown mother
    { id: 'sophieId', firstName: 'Sophie', lastName: 'Martin', sex: 'female', fatherId: 'marcId' },

    // Sam has an unknown father and a mother that is not in the family data
    { id: 'samId', firstName: 'Sam', lastName: 'Martin', sex: 'male', motherId: 'liliId' },

    // Théo has a known mother and no father recorded
    { id: 'ninaId', firstName: 'Nina', lastName: 'Petit', sex: 'female' },
    { id: 'theoId', firstName: 'Théo', lastName: 'Petit', sex: 'male', motherId: 'ninaId' },

    // Emma and Noé share both parents (full siblings)
    { id: 'hugoId', firstName: 'Hugo', lastName: 'Bernard', sex: 'male' },
    { id: 'claraId', firstName: 'Clara', lastName: 'Lambert', sex: 'female' },
    { id: 'emmaId', firstName: 'Emma', lastName: 'Bernard', sex: 'female', fatherId: 'hugoId', motherId: 'claraId' },
    { id: 'noeId', firstName: 'Noé', lastName: 'Bernard', sex: 'male', fatherId: 'hugoId', motherId: 'claraId' },

    // Anne-Sophie has a compound first name and a compound last name
    { id: 'annesophieId', firstName: 'Anne-Sophie', lastName: 'Le Gall', sex: 'female' },
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
      expect(getPersonsByName({ persons: [], unions: [] }, 'Tom', 'Martin')).toEqual([])
    })

    it.each([
      ['', ''],
      ['Tom', ''],
      ['', 'Blanc'],
      ['   ', '   '],
    ])('should return an empty array when searching empty name "%s" "%s"', (firstName, lastName) => {
      expect(getPersonsByName(data, firstName, lastName)).toEqual([])
    })

    it.each([
      ['Anne-Sophie', 'Le Gall'],
      ['ANNE-SOPHIE', 'LE GALL'],
      ['anne-sophie', 'le gall'],
      ['  Anne-Sophie ', ' Le Gall  '],
    ])('should find a person with a compound name when searching "%s" "%s"', (firstName, lastName) => {
      expect(getPersonsByName(data, firstName, lastName).map(p => p.id)).toEqual(['annesophieId'])
    })

    it.each([
      ['Anne Sophie', 'Le Gall'],
      ['AnneSophie', 'Le Gall'],
      ['Anne-Sophie', 'Le  Gall'],
      ['Anne-Sophie', 'LeGall'],
      ['Anne', 'Le Gall'],
      ['Anne-Sophie', 'Gall'],
    ])('should not match a compound name written differently: "%s" "%s"', (firstName, lastName) => {
      expect(getPersonsByName(data, firstName, lastName)).toEqual([])
    })
  })

  describe('getFather', () => {
    it('should return the father of a person', () => {
      expect(getFather(data, 'leaId')?.id).toBe('paulId')
    })

    it('should return undefined when the father is unknown', () => {
      expect(getFather(data, 'samId')).toBeUndefined()
    })

    it('should return undefined when the person does not exist', () => {
      expect(getFather(data, 'nobodyId')).toBeUndefined()
    })

    it('should return undefined when fatherId points to a missing person', () => {
      expect(getFather(data, 'sophieId')).toBeUndefined()
    })
  })

  describe('getMother', () => {
    it('should return the mother of a person', () => {
      expect(getMother(data, 'leaId')?.id).toBe('marieId')
    })

    it('should return undefined when no mother is recorded', () => {
      expect(getMother(data, 'sophieId')).toBeUndefined()
    })

    it('should return undefined when the person does not exist', () => {
      expect(getMother(data, 'nobodyId')).toBeUndefined()
    })

    it('should return undefined when motherId points to a missing person', () => {
      expect(getMother(data, 'samId')).toBeUndefined()
    })
  })

  describe('getParents', () => {
    it('should return the father then the mother', () => {
      expect(getParents(data, 'leaId').map(p => p.id)).toEqual(['paulId', 'marieId'])
    })

    it('should return only the mother when no father is recorded', () => {
      expect(getParents(data, 'theoId').map(p => p.id)).toEqual(['ninaId'])
    })

    it('should return an empty array when no parent is recorded', () => {
      expect(getParents(data, 'paulId')).toEqual([])
    })

    it('should return an empty array when the person does not exist', () => {
      expect(getParents(data, 'nobodyId')).toEqual([])
    })

    it('should ignore a parent id that points to a missing person', () => {
      expect(getParents(data, 'sophieId')).toEqual([])
      expect(getParents(data, 'samId')).toEqual([])
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
      expect(getChildren(data, 'sophieId')).toEqual([])
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
      const siblings = getSiblings(data, 'emmaId')
      expect(siblings.map(s => [s.person.id, s.kind])).toEqual([['noeId', 'full']])
    })

    it('should not include the person itself', () => {
      expect(getSiblings(data, 'leaId').map(s => s.person.id)).not.toContain('leaId')
    })

    it('should not treat persons with unknown parents as siblings', () => {
      expect(getSiblings(data, 'paulId')).toEqual([])
    })

    it('should return an empty array when the person has no sibling', () => {
      expect(getSiblings(data, 'theoId')).toEqual([])
    })

    it('should return an empty array when the person does not exist', () => {
      expect(getSiblings(data, 'nobodyId')).toEqual([])
    })
  })
})
