import { describe, expect, it } from 'vitest'

import type { FamilyData } from '../types/family'
import { getPersonById, getPersonsByName } from './family-utils'

const data: FamilyData = {
  persons: [
    { id: 'tom', firstName: 'Tom', lastName: 'Martin', sex: 'male' },
    { id: 'lea', firstName: 'Léa', lastName: 'Martin', sex: 'female' },
    {
      id: 'hugo', firstName: 'Hugo', lastName: 'Martin', sex: 'male', birthDate: '1996-03-08', parentUnionId: 'u2',
    },
    {
      id: 'emma', firstName: 'Emma', lastName: 'Martin', sex: 'female', birthDate: '1998-08-19', parentUnionId: 'u2',
    },
    {
      id: 'emma2', firstName: 'Emma', lastName: 'Martin', sex: 'female', birthDate: '1960-09-20',
    },
  ],
  unions: [],
}

describe('family-utils', () => {
  describe('getPersonById', () => {
    it ('should return the person with the given id', () => {
      const person = getPersonById(data, 'lea')
      expect(person).toEqual({ id: 'lea', firstName: 'Léa', lastName: 'Martin', sex: 'female' })
    })

    it ('should return undefined when the id doesn\'t exist', () => {
      const person = getPersonById(data, 'george')
      expect(person).toBeUndefined()
    })
  })

  describe('getPersonsByName', () => {
    it('should return the persons with the given name', () => {
      expect(getPersonsByName(data, 'Tom', 'Martin').map(p => p.id)).toEqual(['tom'])
    })

    it('should return every person sharing the same name', () => {
      expect(getPersonsByName(data, 'Emma', 'Martin').map(p => p.id)).toEqual(['emma', 'emma2'])
    })

    it.each([
      ['LÉA', 'MARTIN'],
      ['léa', 'martin'],
      ['lea', 'MARTIN'],
      ['  Léa ', ' Martin  '],
    ])('should ignore case, accents and spaces when searching "%s" "%s"', (firstName, lastName) => {
      expect(getPersonsByName(data, firstName, lastName).map(p => p.id)).toEqual(['lea'])
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
