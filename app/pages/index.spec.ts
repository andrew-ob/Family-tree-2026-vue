import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'

import type { FamilyData } from '~~/shared/types/familyTypes'

import { useFamily } from '../composables/useFamily'
import IndexPage from './index.vue'

const fixture: FamilyData = {
  persons: [
    { id: 'leaId', firstName: 'Léa', lastName: 'Dupont', sex: 'female', birthDate: '1970' },
    { id: 'tomId', firstName: 'Tom', lastName: 'Blanc', sex: 'male', deathDate: '2001' },
    { id: 'noaId', firstName: 'Noa', lastName: 'Durand', sex: 'unknown' },
  ],
  unions: [],
}

const mountPage = () => mountSuspended(IndexPage)

describe('Index page', () => {
  beforeEach(() => {
    useFamily().family.value = structuredClone(fixture)
  })

  it('should show the page title', async () => {
    const wrapper = await mountPage()

    expect(wrapper.find('h1').text()).toBe('Family tree')
  })

  it('should show every person of the family', async () => {
    const wrapper = await mountPage()

    expect(wrapper.findAll('li').map(li => li.find('p').text())).toEqual(['Léa Dupont', 'Tom Blanc', 'Noa Durand'])
  })

  it('should link each person to their own page', async () => {
    const wrapper = await mountPage()

    expect(wrapper.findAll('a').map(a => a.attributes('href'))).toEqual(['/person/leaId', '/person/tomId', '/person/noaId'])
  })

  it('should keep the title and show no person when the family is empty', async () => {
    useFamily().family.value = { persons: [], unions: [] }
    const wrapper = await mountPage()

    expect(wrapper.find('h1').text()).toBe('Family tree')
    expect(wrapper.findAll('li')).toHaveLength(0)
  })
})
