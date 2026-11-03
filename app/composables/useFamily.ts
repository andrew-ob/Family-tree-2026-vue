import { familyData } from '~~/data/familyData'
import type { FamilyData } from '~~/shared/types/familyTypes'

export function useFamily() {
  const family = useState<FamilyData>('family', () => familyData)

  return {
    family,
    getPersonById: (id: string) => getPersonById(family.value, id),
    searchPersons: (criteria: { firstName: string, lastName: string }) => searchPersons(family.value, criteria),
    getFather: (id: string) => getFather(family.value, id),
    getMother: (id: string) => getMother(family.value, id),
    getParents: (id: string) => getParents(family.value, id),
    getChildren: (id: string) => getChildren(family.value, id),
    getSiblings: (id: string) => getSiblings(family.value, id),
    getDescendants: (id: string) => getDescendants(family.value, id),
    getAncestors: (id: string) => getAncestors(family.value, id),
    getPartners: (id: string) => getPartners(family.value, id),
    getPersonDetails: (id: string) => getPersonDetails(family.value, id),
  }
}
