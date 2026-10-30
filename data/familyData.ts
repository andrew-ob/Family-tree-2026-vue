// data/familyData.ts
import type { FamilyData } from '../shared/types/familyTypes'

export const family: FamilyData = {
  persons: [
    // Marie has 3 children with 3 different fathers
    { id: 'marieId', firstName: 'Marie', lastName: 'Martin', sex: 'female', birthDate: '1948', deathDate: '1996' },
    { id: 'paulId', firstName: 'Paul', lastName: 'Dupont', sex: 'male' },
    { id: 'jeanId', firstName: 'Jean', lastName: 'Blanc', sex: 'male', birthDate: '1947', deathDate: '2021' },
    { id: 'lucId', firstName: 'Luc', lastName: 'Roux', sex: 'male' },

    // Marie's children
    { id: 'leaId', firstName: 'Léa', lastName: 'Dupont', sex: 'female', fatherId: 'paulId', motherId: 'marieId', birthDate: '1970' },
    { id: 'tomId', firstName: 'Tom', lastName: 'Blanc', sex: 'male', fatherId: 'jeanId', motherId: 'marieId', birthDate: '1972' },
    { id: 'zoeId', firstName: 'Zoé', lastName: 'Roux', sex: 'female', fatherId: 'lucId', motherId: 'marieId', birthDate: '1973', deathDate: '1986' },

    // Pierre has 2 children with 2 different mothers
    { id: 'pierreId', firstName: 'Pierre', lastName: 'Martin', sex: 'male', birthDate: '1971' },
    { id: 'anneId', firstName: 'Anne', lastName: 'Fournier', sex: 'female', birthDate: '1970' },
    { id: 'julieId', firstName: 'Julie', lastName: 'Moreau', sex: 'female', birthDate: '1975' },

    // Chloé and the second Marie Martin are siblings, but have different mothers
    { id: 'chloeId', firstName: 'Chloé', lastName: 'Martin', sex: 'female', fatherId: 'pierreId', motherId: 'anneId', birthDate: '2000' },
    { id: 'marie2Id', firstName: 'Marie', lastName: 'Martin', sex: 'female', fatherId: 'pierreId', motherId: 'julieId' },
  ],

  unions: [
    { id: 'u1', partner1Id: 'paulId', partner2Id: 'marieId', endReason: 'divorce' },
    { id: 'u2', partner1Id: 'jeanId', partner2Id: 'marieId', endReason: 'divorce' },
    { id: 'u3', partner1Id: 'lucId', partner2Id: 'marieId' },
    { id: 'u4', partner1Id: 'pierreId', partner2Id: 'anneId', endReason: 'death' },
    { id: 'u5', partner1Id: 'pierreId', partner2Id: 'julieId' },
  ],
}
