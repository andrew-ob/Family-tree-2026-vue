import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'

import type { FamilyData } from '~~/shared/types/familyTypes'

import { useFamily } from '../../composables/useFamily.js'
import MemberDetails from './MemberDetails.vue'

const fixture: FamilyData = {
  persons: [
    { id: 'pereId', firstName: 'Paul', lastName: 'Dupont', sex: 'male', isAlive: false, birth: { date: '1940' }, death: { date: '2010' } },
    { id: 'mereId', firstName: 'Marie', lastName: 'Martin', sex: 'female', isAlive: true, birth: { date: '1945' } },
    { id: 'leaId', firstName: 'Léa', lastName: 'Dupont', sex: 'female', isAlive: false, birth: { date: '1970', place: 'Lyon' }, death: { date: '2020', place: 'Paris' }, fatherId: 'pereId', motherId: 'mereId' },
    { id: 'tomId', firstName: 'Tom', lastName: 'Dupont', sex: 'male', isAlive: false, death: { date: '2001' }, fatherId: 'pereId', motherId: 'mereId' },
    { id: 'zoeId', firstName: 'Zoé', lastName: 'Dupont', sex: 'female', isAlive: false, birth: { date: '1972' }, death: { date: '1990' }, fatherId: 'pereId', motherId: 'mereId' },
    { id: 'evaId', firstName: 'Eva', lastName: 'Durand', sex: 'female', isAlive: false, birth: { date: '2000' }, death: { date: '2015' }, motherId: 'leaId' },
    { id: 'noaId', firstName: 'Noa', lastName: 'Durand', sex: 'unknown', isAlive: true, motherId: 'leaId' },
    { id: 'ianId', firstName: 'Ian', lastName: 'Durand', sex: 'male', isAlive: false, birth: { date: '1968' }, death: { date: '2018' } },
    { id: 'samId', firstName: 'Sam', lastName: 'Petit', sex: 'unknown', isAlive: true },
    { id: 'claireId', firstName: 'Claire', lastName: 'Roux', sex: 'female', isAlive: false, birth: { date: '1950' }, death: { date: '2000' } },
    { id: 'ellaId', firstName: 'Ella', lastName: 'Roux', sex: 'female', isAlive: true, motherId: 'claireId' },
    { id: 'sylvainId', firstName: 'Sylvain', lastName: 'Blanc', sex: 'male', isAlive: true },
    { id: 'maxId', firstName: 'Max', lastName: 'Blanc', sex: 'male', isAlive: true, fatherId: 'sylvainId' },
    { id: 'soloId', firstName: 'Solo', lastName: 'Seul', sex: 'unknown', isAlive: true },
  ],
  unions: [
    { id: 'u1', partner1Id: 'leaId', partner2Id: 'ianId' },
    { id: 'u2', partner1Id: 'samId', partner2Id: 'leaId' },
  ],
}

const mountDetails = (memberId: string) => mountSuspended(MemberDetails, { props: { memberId } })

type DetailsWrapper = Awaited<ReturnType<typeof mountDetails>>

/** Text of the list item containing the given name, without any whitespace (undefined when there is no such item). */
const itemText = (wrapper: DetailsWrapper, name: string) =>
  wrapper.findAll('li').find(li => li.text().includes(name))?.text().replace(/\s+/g, '')

describe('MemberDetails', () => {
  beforeEach(() => {
    useFamily().family.value = structuredClone(fixture)
  })

  describe('person', () => {
    it('should show the full name as the title', async () => {
      const wrapper = await mountDetails('leaId')

      expect(wrapper.find('h1').text()).toBe('Léa Dupont')
    })

    it('should show the birth and death places of the person', async () => {
      const wrapper = await mountDetails('leaId')

      expect(wrapper.text()).toContain('Née en 1970 à Lyon')
      expect(wrapper.text()).toContain('Décédée en 2020 à Paris')
    })

    it('should not show any death line for a person who is alive', async () => {
      const wrapper = await mountDetails('mereId')

      expect(wrapper.text()).toContain('Née en 1945')
      expect(wrapper.text()).not.toContain('Décédée')
    })

    it('should show a not found message when the person does not exist', async () => {
      const wrapper = await mountDetails('unknownId')

      expect(wrapper.text()).toContain('Personne introuvable')
      expect(wrapper.find('h1').exists()).toBe(false)
    })
  })

  describe('member change', () => {
    it('should update the displayed member when the member id changes', async () => {
      const wrapper = await mountDetails('leaId')

      await wrapper.setProps({ memberId: 'tomId' })

      expect(wrapper.find('h1').text()).toBe('Tom Dupont')
    })

    it('should show a not found message when the member id changes to an unknown id', async () => {
      const wrapper = await mountDetails('leaId')

      await wrapper.setProps({ memberId: 'unknownId' })

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
      const wrapper = await mountDetails('leaId')

      expect(itemText(wrapper, name)).toContain(lifeDates)
    })

    it.each([
      ['mother with only a birth date', 'Marie Martin', '1945'],
      ['sibling with only a death date', 'Tom Dupont', '2001'],
      ['child without any date', 'Noa Durand', ''],
      ['partner without any date', 'Sam Petit', ''],
    ])('should not show a dash for a %s', async (_relative, name, lifeDates) => {
      const wrapper = await mountDetails('leaId')
      const text = itemText(wrapper, name)

      expect(text).toBeDefined()
      expect(text).toContain(lifeDates)
      expect(text).not.toContain('-')
    })
  })

  describe('parents', () => {
    it('should show both parents', async () => {
      const wrapper = await mountDetails('leaId')

      expect(itemText(wrapper, 'Paul Dupont')).toBeDefined()
      expect(itemText(wrapper, 'Marie Martin')).toBeDefined()
    })

    it('should only show the mother when the father is unknown', async () => {
      const wrapper = await mountDetails('ellaId')

      expect(wrapper.findAll('li')).toHaveLength(1)
      expect(itemText(wrapper, 'Claire Roux')).toContain('1950-2000')
    })

    it('should only show the father when the mother is unknown', async () => {
      const wrapper = await mountDetails('maxId')

      expect(wrapper.findAll('li')).toHaveLength(1)
      expect(itemText(wrapper, 'Sylvain Blanc')).not.toContain('-')
    })
  })

  describe('sections', () => {
    it('should show the parents, children, siblings and partners sections', async () => {
      const wrapper = await mountDetails('leaId')

      expect(wrapper.findAll('h2').map(h2 => h2.text())).toEqual(['Parents', 'Enfants', 'Frères et soeurs', 'Partenaires'])
    })

    it('should hide the sections without data', async () => {
      const wrapper = await mountDetails('samId')

      expect(wrapper.findAll('h2').map(h2 => h2.text())).toEqual(['Partenaires'])
    })

    it('should hide every section when the person has no relative', async () => {
      const wrapper = await mountDetails('soloId')

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
      const wrapper = await mountDetails('leaId')

      expect(wrapper.find(`a[href="/?member=${id}"]`).exists()).toBe(true)
    })
  })

  describe('missing data', () => {
    it.each(['leaId', 'tomId', 'mereId', 'samId', 'soloId', 'ellaId', 'maxId'])(
      'should not render undefined, null or NaN for %s',
      async (id) => {
        const wrapper = await mountDetails(id)

        expect(wrapper.text()).not.toMatch(/undefined|null|NaN/)
      },
    )
  })
})
