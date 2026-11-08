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
    ['male', 'bg-blue-300', 'Homme'],
    ['female', 'bg-pink-300', 'Femme'],
    ['unknown', 'bg-gray-300', 'Sexe inconnu'],
  ])('should show the matching color and accessible label when the sex is %s', async (sex, color, label) => {
    const wrapper = await mountCard({ sex })
    const marker = wrapper.find('.rounded-2xl')

    expect(marker.classes().filter(c => c.startsWith('bg-'))).toEqual([color])
    expect(wrapper.find('.sr-only').text()).toBe(label)
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
})
