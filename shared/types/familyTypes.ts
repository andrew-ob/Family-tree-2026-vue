export type BirthInfo = {
  date?: string
  place?: string
}

export type DeathInfo = {
  date?: string
  place?: string
  cause?: string
}

export type Person = {
  id: string
  firstName: string
  lastName: string
  sex: 'male' | 'female' | 'unknown'
  isAlive: boolean
  birth?: BirthInfo
  /** Only meaningful when `isAlive` is false. `{}` means "deceased, no details known". */
  death?: DeathInfo
  fatherId?: string
  motherId?: string
}

export type Union = {
  id: string
  partner1Id: string
  partner2Id?: string
  startDate?: string
  endDate?: string
  endReason?: 'divorce' | 'death' | 'separation'
}

export type SiblingKind = 'full' | 'half'

export type Sibling = {
  person: Person
  kind: SiblingKind
}

export type FamilyData = {
  persons: Person[]
  unions: Union[]
}

export type Parents = {
  father?: Person
  mother?: Person
}

export type PersonDetails = {
  person: Person
  parents: Person[]
  children: Person[]
  siblings: Sibling[]
  partners: Person[]
}

export type PersonSearchCriteria = {
  firstName: string
  lastName: string
}
