import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import type { Person } from '~~/shared/types/familyTypes'

import UiAvatar from '../ui/Avatar.vue'
import PersonCardInfo from './CardInfo.vue'

const base: Person = { id: 'x', firstName: 'Léa', lastName: 'Dupont', sex: 'female', isAlive: true }

const mountCard = (overrides: Partial<Person> = {}) =>
  mountSuspended(PersonCardInfo, { props: { person: { ...base, ...overrides } } })

describe('PersonCardInfo', () => {
  it('should show the full name', async () => {
    const wrapper = await mountCard()

    expect(wrapper.findAll('p')[0]!.text()).toBe('Léa Dupont')
  })

  it.each<Person['sex']>(['male', 'female', 'unknown'])(
    'should give the avatar the person sex when the sex is %s',
    async (sex) => {
      const wrapper = await mountCard({ sex })
      const avatar = wrapper.findComponent(UiAvatar)

      expect(avatar.exists()).toBe(true)
      expect(avatar.props('sex')).toBe(sex)
    },
  )

  it('should give the avatar the person so it can compute the initials', async () => {
    const wrapper = await mountCard()

    expect(wrapper.findComponent(UiAvatar).text()).toBe('LD')
  })

  it('should show the avatar with the list size', async () => {
    const wrapper = await mountCard()

    expect(wrapper.findComponent(UiAvatar).props('size')).toBe('list')
  })

  it.each<[string, Partial<Person>, string]>([
    ['both a birth and a death date', { isAlive: false, birth: { date: '1970' }, death: { date: '2020' } }, '1970 - 2020'],
    ['only a birth date', { birth: { date: '1945' } }, '1945 - XXXX'],
    ['only a death date', { isAlive: false, death: { date: '2001' } }, 'XXXX - 2001'],
    ['no date', {}, 'XXXX - XXXX'],
  ])('should show the life dates when the person has %s', async (_case, dates, expected) => {
    const wrapper = await mountCard(dates)

    expect(wrapper.findAll('p')[1]!.text()).toBe(expected)
  })

  it.each<[string, Partial<Person>, string]>([
    ['both a birth and a death place', { isAlive: false, birth: { place: 'Paris' }, death: { place: 'Lyon' } }, 'Paris - Lyon'],
    ['only a birth place', { birth: { place: 'Paris' } }, 'Paris'],
    ['only a death place', { isAlive: false, death: { place: 'Lyon' } }, 'Lyon'],
    ['no place', {}, ''],
  ])('should show the places when the person has %s', async (_case, places, expected) => {
    const wrapper = await mountCard(places)

    expect(wrapper.findAll('p')[2]!.text().replace(/\s+/g, ' ')).toBe(expected)
  })
})
