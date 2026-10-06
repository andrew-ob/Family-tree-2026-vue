import { describe, expect, it } from 'vitest'

import type { FamilyData } from '../types/family'
import { getPersonById } from './family-utils'

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
})
