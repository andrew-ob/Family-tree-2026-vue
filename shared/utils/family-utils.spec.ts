import { describe, expect, it } from 'vitest'

import type { FamilyData } from '../types/family'
import { getPersonById, getPersonsByName } from './family-utils'

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

    // Chloe and Maxime are siblings, but have different mothers
    { id: 'chloeId', firstName: 'Chloé', lastName: 'Martin', sex: 'female', fatherId: 'pierreId', motherId: 'anneId' },
    { id: 'marie2Id', firstName: 'Marie', lastName: 'Martin', sex: 'female', fatherId: 'pierreId', motherId: 'julieId' },

    // Sophie has a father that is not in the family data, and an unknown mother
    { id: 'sophieId', firstName: 'Sophie', lastName: 'Martin', sex: 'female', fatherId: 'marcId' },

    // Sam has an unknown father and a mother that is not in the family data
    { id: 'samId', firstName: 'Sam', lastName: 'Martin', sex: 'male', motherId: 'liliId' },
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
    it ('should return the person with the given id', () => {
      expect(getPersonById(data, 'leaId')?.firstName).toBe('Léa')
    })

    it ('should return undefined when the id doesn\'t exist', () => {
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
  })
})
