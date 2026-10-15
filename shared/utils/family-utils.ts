import type { FamilyData, Person } from '../types/family'
import { normalizeText } from './normalize-text'

export function getPersonById(data: FamilyData, personId: string): Person | undefined {
  return data.persons.find(p => p.id === personId)
}

export function getPersonsByName(data: FamilyData, firstName: string, lastName: string): Person[] {
  const firstNameNormalized = normalizeText(firstName)
  const lastNameNormalized = normalizeText(lastName)

  return data.persons.filter(p => normalizeText(p.firstName) === firstNameNormalized && normalizeText(p.lastName) === lastNameNormalized)
}

export function getFather(data: FamilyData, personId: string): Person | undefined {
  const person = getPersonById(data, personId)
  return person?.fatherId ? getPersonById(data, person.fatherId) : undefined
}

