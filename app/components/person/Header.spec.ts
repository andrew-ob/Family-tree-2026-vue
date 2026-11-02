import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import type { Person } from '~~/shared/types/familyTypes'

import PersonHeader from './Header.vue'

const base: Person = { id: 'x', firstName: 'Léa', lastName: 'Dupont', sex: 'female' }

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
    const wrapper = await mountHeader({ sex, birthDate: '1970', deathDate: '2020' })

    expect(wrapper.text()).toContain(birth)
    expect(wrapper.text()).toContain(death)
  })

  it('should only show the birth date when the death date is missing', async () => {
    const wrapper = await mountHeader({ birthDate: '1945' })

    expect(wrapper.text()).toContain('Née en 1945')
    expect(wrapper.text()).not.toContain('Décédée')
  })

  it('should only show the death date when the birth date is missing', async () => {
    const wrapper = await mountHeader({ deathDate: '2001' })

    expect(wrapper.text()).toContain('Décédée en 2001')
    expect(wrapper.text()).not.toContain('Née')
  })

  it('should not show any life date when both are missing', async () => {
    const wrapper = await mountHeader()

    expect(wrapper.text()).not.toContain('Née')
    expect(wrapper.text()).not.toContain('Décédée')
  })
})
