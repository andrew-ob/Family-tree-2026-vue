import type { FamilyData, Person, Sibling } from '../types/family'
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

export function getMother(data: FamilyData, personId: string): Person | undefined {
  const person = getPersonById(data, personId)
  return person?.motherId ? getPersonById(data, person.motherId) : undefined
}

export function getParents(data: FamilyData, personId: string): Person[] {
  return [getFather(data, personId), getMother(data, personId)].filter((p): p is Person => !!p)
}

export function getChildren(data: FamilyData, personId: string): Person[] {
  return data.persons.filter(
    p => p.fatherId === personId || p.motherId === personId,
  )
}

export function getSiblings(data: FamilyData, personId: string): Sibling[] {
  const me = getPersonById(data, personId)
  if (!me) return []

  const siblings: Sibling[] = []

  for (const other of data.persons) {
    if (other.id === me.id) continue

    const sameFather = me.fatherId !== undefined && me.fatherId === other.fatherId
    const sameMother = me.motherId !== undefined && me.motherId === other.motherId

    if (sameFather && sameMother) siblings.push({ person: other, kind: 'full' })
    else if (sameFather || sameMother) siblings.push({ person: other, kind: 'half' })
  }

  return siblings
}

/**
 * Returns every descendant of a person (children, grandchildren, ...), generation by generation.
 * The person itself is never included, and each descendant appears only once.
 * Returns an empty array when the person does not exist.
 */
export function getDescendants(data: FamilyData, personId: string): Person[] {
  if (!getPersonById(data, personId)) return []

  const descendants: Person[] = []
  const visited = new Set<string>([personId]) // protects against duplicates and cycles in the data
  let currentGeneration = [personId]

  while (currentGeneration.length > 0) {
    const nextGeneration: string[] = []

    for (const parentId of currentGeneration) {
      for (const child of getChildren(data, parentId)) {
        if (visited.has(child.id)) continue

        visited.add(child.id)
        descendants.push(child)
        nextGeneration.push(child.id)
      }
    }

    currentGeneration = nextGeneration
  }

  return descendants
}
