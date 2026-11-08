import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import type { Person } from '~~/shared/types/familyTypes'

import PersonHeader from './Header.vue'

const base: Person = { id: 'x', firstName: 'Léa', lastName: 'Dupont', sex: 'female', isAlive: true }

const mountHeader = (overrides: Partial<Person> = {}) =>
  mountSuspended(PersonHeader, { props: { person: { ...base, ...overrides } } })

describe('PersonHeader', () => {
  it('should show the full name as the page title', async () => {
    const wrapper = await mountHeader()

    expect(wrapper.find('h1').text()).toBe('Léa Dupont')
  })

  it.each([
    ['male', 'Né en 1970', 'Décédé en 2020'],
    ['female', 'Née en 1970', 'Décédée en 2020'],
    ['unknown', 'Né(e) en 1970', 'Décédé(e) en 2020'],
  ] as const)('should agree the life date labels with the sex when it is %s', async (sex, birth, death) => {
    const wrapper = await mountHeader({ sex, isAlive: false, birth: { date: '1970' }, death: { date: '2020' } })

    expect(wrapper.text()).toContain(birth)
    expect(wrapper.text()).toContain(death)
  })

  it('should only show the birth date when the death date is missing', async () => {
    const wrapper = await mountHeader({ birth: { date: '1945' } })

    expect(wrapper.text()).toContain('Née en 1945')
    expect(wrapper.text()).not.toContain('Décédée')
  })

  it('should only show the death date when the birth date is missing', async () => {
    const wrapper = await mountHeader({ isAlive: false, death: { date: '2001' } })

    expect(wrapper.text()).toContain('Décédée en 2001')
    expect(wrapper.text()).not.toContain('Née')
  })

  it('should not show any life date when both are missing', async () => {
    const wrapper = await mountHeader()

    expect(wrapper.text()).not.toContain('Née')
    expect(wrapper.text()).not.toContain('Décédée')
  })

  it('should show the birth place after the birth date', async () => {
    const wrapper = await mountHeader({ birth: { date: '1970', place: 'Lyon' } })

    expect(wrapper.text()).toContain('Née en 1970 à Lyon')
  })

  it('should show the death place after the death date', async () => {
    const wrapper = await mountHeader({ isAlive: false, death: { date: '2020', place: 'Paris' } })

    expect(wrapper.text()).toContain('Décédée en 2020 à Paris')
  })

  it('should show a place even when the date is missing', async () => {
    const wrapper = await mountHeader({ isAlive: false, birth: { place: 'Lyon' }, death: { place: 'Paris' } })

    expect(wrapper.text()).toContain('Née à Lyon')
    expect(wrapper.text()).toContain('Décédée à Paris')
  })

  it('should show the person as deceased even when no death detail is known', async () => {
    const wrapper = await mountHeader({ isAlive: false, death: {} })

    expect(wrapper.text()).toContain('Décédée')
    expect(wrapper.text()).not.toContain('Décédée en')
  })

  it('should not show the death line when the person is alive', async () => {
    const wrapper = await mountHeader({ isAlive: true, death: { date: '2020' } })

    expect(wrapper.text()).not.toContain('Décédée')
  })
})
