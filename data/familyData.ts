// data/family.ts
import type { FamilyData } from '../shared/types/family'

export const family: FamilyData = {
  persons: [
    // Les adultes
    {
      id: 'paul', firstName: 'Paul', lastName: 'Martin', sex: 'male', birthDate: '1958-04-12',
    },
    {
      id: 'marie', firstName: 'Marie', lastName: 'Durand', sex: 'female', birthDate: '1960-09-03',
    },
    {
      id: 'claire', firstName: 'Claire', lastName: 'Bernard', sex: 'male', birthDate: '1965-02-21',
    },

    // Enfants de Paul et Marie (union u1)
    {
      id: 'lea', firstName: 'Léa', lastName: 'Martin', sex: 'female', birthDate: '1985-07-14', parentUnionId: 'u1',
    },
    {
      id: 'tom', firstName: 'Tom', lastName: 'Martin', sex: 'male', birthDate: '1988-11-30', parentUnionId: 'u1',
    },

    // Enfants de Paul et Claire (union u2)
    {
      id: 'hugo', firstName: 'Hugo', lastName: 'Martin', sex: 'male', birthDate: '1996-03-08', parentUnionId: 'u2',
    },
    {
      id: 'emma', firstName: 'Emma', lastName: 'Martin', sex: 'female', birthDate: '1998-08-19', parentUnionId: 'u2',
    },
    {
      id: 'noe', firstName: 'Noé', lastName: 'Martin', sex: 'male', birthDate: '2002-01-25', parentUnionId: 'u2',
    },
  ],

  unions: [
    {
      id: 'u1',
      partner1Id: 'paul',
      partner2Id: 'marie',
      startDate: '1983-06-18',
      endDate: '1993-05-10',
      endReason: 'divorce',
    },
    {
      id: 'u2',
      partner1Id: 'paul',
      partner2Id: 'claire',
      startDate: '1994-09-24',
    },
  ],
}
