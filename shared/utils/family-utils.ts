import type { FamilyData, Person } from '../types/family'

export function getPersonById(data: FamilyData, personId: string): Person | undefined {
  return data.persons.find(p => p.id === personId)
}
