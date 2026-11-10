import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import type { Person } from '~~/shared/types/familyTypes'

import PersonCardInfo from './CardInfo.vue'

const base: Person = { id: 'x', firstName: 'Léa', lastName: 'Dupont', sex: 'female', isAlive: true }

const mountCard = (overrides: Partial<Person> = {}) =>
  mountSuspended(PersonCardInfo, { props: { person: { ...base, ...overrides } } })

describe('PersonCardInfo', () => {
  it('should show the full name', async () => {
    const wrapper = await mountCard()

    expect(wrapper.findAll('p')[0]!.text()).toBe('Léa Dupont')
  })

  it.each<[Person['sex'], string, string]>([
    ['male', 'bg-person-male-bg', 'Homme'],
    ['female', 'bg-person-female-bg', 'Femme'],
    ['unknown', 'bg-person-unknown-bg', 'Sexe inconnu'],
  ])('should show the matching color and accessible label when the sex is %s', async (sex, color, label) => {
    const wrapper = await mountCard({ sex })
    const srLabel = wrapper.find('.sr-only')
    const marker = srLabel.element.parentElement!

    expect(srLabel.text()).toBe(label)
    expect([...marker.classList].filter(c => c.startsWith('bg-'))).toEqual([color])
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
