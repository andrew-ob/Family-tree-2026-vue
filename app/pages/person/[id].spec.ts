import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'

import type { FamilyData } from '~~/shared/types/familyTypes'

import { useFamily } from '../../composables/useFamily'
import PersonPage from './[id].vue'

const fixture: FamilyData = {
  persons: [
    { id: 'pereId', firstName: 'Paul', lastName: 'Dupont', sex: 'male', birthDate: '1940', deathDate: '2010' },
    { id: 'mereId', firstName: 'Marie', lastName: 'Martin', sex: 'female', birthDate: '1945' },
    { id: 'leaId', firstName: 'Léa', lastName: 'Dupont', sex: 'female', birthDate: '1970', deathDate: '2020', fatherId: 'pereId', motherId: 'mereId' },
    { id: 'tomId', firstName: 'Tom', lastName: 'Dupont', sex: 'male', deathDate: '2001', fatherId: 'pereId', motherId: 'mereId' },
    { id: 'zoeId', firstName: 'Zoé', lastName: 'Dupont', sex: 'female', birthDate: '1972', deathDate: '1990', fatherId: 'pereId', motherId: 'mereId' },
    { id: 'evaId', firstName: 'Eva', lastName: 'Durand', sex: 'female', birthDate: '2000', deathDate: '2015', motherId: 'leaId' },
    { id: 'noaId', firstName: 'Noa', lastName: 'Durand', sex: 'unknown', motherId: 'leaId' },
    { id: 'ianId', firstName: 'Ian', lastName: 'Durand', sex: 'male', birthDate: '1968', deathDate: '2018' },
    { id: 'samId', firstName: 'Sam', lastName: 'Petit', sex: 'unknown' },
    { id: 'claireId', firstName: 'Claire', lastName: 'Roux', sex: 'female', birthDate: '1950', deathDate: '2000' },
    { id: 'ellaId', firstName: 'Ella', lastName: 'Roux', sex: 'female', motherId: 'claireId' },
    { id: 'sylvainId', firstName: 'Sylvain', lastName: 'Blanc', sex: 'male' },
    { id: 'maxId', firstName: 'Max', lastName: 'Blanc', sex: 'male', fatherId: 'sylvainId' },
    { id: 'soloId', firstName: 'Solo', lastName: 'Seul', sex: 'unknown' },
  ],
  unions: [
    { id: 'u1', partner1Id: 'leaId', partner2Id: 'ianId' },
    { id: 'u2', partner1Id: 'samId', partner2Id: 'leaId' },
  ],
}

const mountPage = (id: string) => mountSuspended(PersonPage, { route: `/person/${id}` })

type PageWrapper = Awaited<ReturnType<typeof mountPage>>

/** Text of the list item containing the given name, without any whitespace (undefined when there is no such item). */
const itemText = (wrapper: PageWrapper, name: string) =>
  wrapper.findAll('li').find(li => li.text().includes(name))?.text().replace(/\s+/g, '')

describe('Person page', () => {
  beforeEach(() => {
    useFamily().family.value = structuredClone(fixture)
  })

  describe('person', () => {
    it('should show the full name as the page title', async () => {
      const wrapper = await mountPage('leaId')

      expect(wrapper.find('h1').text()).toBe('Léa Dupont')
    })

    it('should show a not found message when the person does not exist', async () => {
      const wrapper = await mountPage('unknownId')

      expect(wrapper.text()).toContain('Personne introuvable')
      expect(wrapper.find('h1').exists()).toBe(false)
    })
  })

  describe('life dates of relatives', () => {
    it.each([
      ['parent', 'Paul Dupont', '1940-2010'],
      ['child', 'Eva Durand', '2000-2015'],
      ['sibling', 'Zoé Dupont', '1972-1990'],
      ['partner', 'Ian Durand', '1968-2018'],
    ])('should show a dash between the birth and death dates of a %s', async (_relative, name, lifeDates) => {
      const wrapper = await mountPage('leaId')

      expect(itemText(wrapper, name)).toContain(lifeDates)
    })

    it.each([
      ['mother with only a birth date', 'Marie Martin', '1945'],
      ['sibling with only a death date', 'Tom Dupont', '2001'],
      ['child without any date', 'Noa Durand', ''],
      ['partner without any date', 'Sam Petit', ''],
    ])('should not show a dash for a %s', async (_relative, name, lifeDates) => {
      const wrapper = await mountPage('leaId')
      const text = itemText(wrapper, name)

      expect(text).toBeDefined()
      expect(text).toContain(lifeDates)
      expect(text).not.toContain('-')
    })
  })

  describe('parents', () => {
    it('should show both parents', async () => {
      const wrapper = await mountPage('leaId')

      expect(itemText(wrapper, 'Paul Dupont')).toBeDefined()
      expect(itemText(wrapper, 'Marie Martin')).toBeDefined()
    })

    it('should only show the mother when the father is unknown', async () => {
      const wrapper = await mountPage('ellaId')

      expect(wrapper.findAll('li')).toHaveLength(1)
      expect(itemText(wrapper, 'Claire Roux')).toContain('1950-2000')
    })

    it('should only show the father when the mother is unknown', async () => {
      const wrapper = await mountPage('maxId')

      expect(wrapper.findAll('li')).toHaveLength(1)
      expect(itemText(wrapper, 'Sylvain Blanc')).not.toContain('-')
    })
  })

  describe('sections', () => {
    it('should show the parents, children, siblings and partners sections', async () => {
      const wrapper = await mountPage('leaId')

      expect(wrapper.findAll('h2').map(h2 => h2.text())).toEqual(['Parents', 'Enfants', 'Frères et soeurs', 'Partenaires'])
    })

    it('should hide the sections without data', async () => {
      const wrapper = await mountPage('samId')

      expect(wrapper.findAll('h2').map(h2 => h2.text())).toEqual(['Partenaires'])
    })

    it('should hide every section when the person has no relative', async () => {
      const wrapper = await mountPage('soloId')

      expect(wrapper.findAll('h2')).toHaveLength(0)
    })
  })

  describe('links', () => {
    it.each([
      ['father', 'pereId'],
      ['mother', 'mereId'],
      ['child', 'evaId'],
      ['sibling', 'tomId'],
      ['partner', 'ianId'],
    ])('should link the %s to their own page', async (_relative, id) => {
      const wrapper = await mountPage('leaId')

      expect(wrapper.find(`a[href="/person/${id}"]`).exists()).toBe(true)
    })
  })

  describe('missing data', () => {
    it.each(['leaId', 'tomId', 'mereId', 'samId', 'soloId', 'ellaId', 'maxId'])(
      'should not render undefined, null or NaN for %s',
      async (id) => {
        const wrapper = await mountPage(id)

        expect(wrapper.text()).not.toMatch(/undefined|null|NaN/)
      },
    )
  })
})
