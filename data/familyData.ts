// data/familyData.ts
import type { FamilyData } from '../shared/types/familyTypes'

export const familyData: FamilyData = {
  persons: [
    // Marie has 3 children with 3 different fathers
    { id: 'marieId', firstName: 'Marie', lastName: 'Martin', sex: 'female', isAlive: false, birth: { date: '1948', place: 'Lyon' }, death: { date: '1996', place: 'Paris' } },
    { id: 'paulId', firstName: 'Paul', lastName: 'Dupont', sex: 'male', isAlive: true },
    { id: 'jeanId', firstName: 'Jean', lastName: 'Blanc', sex: 'male', isAlive: false, birth: { date: '1947', place: 'Marseille' }, death: { date: '2021' } },
    { id: 'lucId', firstName: 'Luc', lastName: 'Roux', sex: 'male', isAlive: true },

    // Marie's children
    { id: 'leaId', firstName: 'Léa', lastName: 'Dupont', sex: 'female', isAlive: true, birth: { date: '1970' }, fatherId: 'paulId', motherId: 'marieId' },
    { id: 'tomId', firstName: 'Tom', lastName: 'Blanc', sex: 'male', isAlive: true, birth: { date: '1972' }, fatherId: 'jeanId', motherId: 'marieId' },
    { id: 'zoeId', firstName: 'Zoé', lastName: 'Roux', sex: 'female', isAlive: false, birth: { date: '1973' }, death: { date: '1986' }, fatherId: 'lucId', motherId: 'marieId' },

    // Pierre has 2 children with 2 different mothers
    { id: 'pierreId', firstName: 'Pierre', lastName: 'Martin', sex: 'male', isAlive: true, birth: { date: '1971' } },
    { id: 'anneId', firstName: 'Anne', lastName: 'Fournier', sex: 'female', isAlive: true, birth: { date: '1970' } },
    { id: 'julieId', firstName: 'Julie', lastName: 'Moreau', sex: 'female', isAlive: true, birth: { date: '1975' } },

    // Chloé and the second Marie Martin are siblings, but have different mothers
    { id: 'chloeId', firstName: 'Chloé', lastName: 'Martin', sex: 'female', isAlive: true, birth: { date: '2000' }, fatherId: 'pierreId', motherId: 'anneId' },
    { id: 'marie2Id', firstName: 'Marie', lastName: 'Martin', sex: 'female', isAlive: true, fatherId: 'pierreId', motherId: 'julieId' },
  ],

  unions: [
    { id: 'u1', partner1Id: 'paulId', partner2Id: 'marieId', endReason: 'divorce' },
    { id: 'u2', partner1Id: 'jeanId', partner2Id: 'marieId', endReason: 'divorce' },
    { id: 'u3', partner1Id: 'lucId', partner2Id: 'marieId' },
    { id: 'u4', partner1Id: 'pierreId', partner2Id: 'anneId', endReason: 'death' },
    { id: 'u5', partner1Id: 'pierreId', partner2Id: 'julieId' },
  ],
}
