export type Person = {
  id: string
  firstName: string
  lastName: string
  birthDate?: string
  deathDate?: string
  parentUnionId?: string
}

export type Union = {
  id: string
  partner1Id: string
  partner2Id: string
  startDate?: string
  endDate?: string
  endReason?: 'divorce' | 'death' | 'separation'
}

export type FamilyData = {
  persons: Person[]
  unions: Union[]
}
