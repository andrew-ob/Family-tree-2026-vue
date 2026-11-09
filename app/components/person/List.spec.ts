import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import type { Person } from '~~/shared/types/familyTypes'

import PersonList from './List.vue'

const persons: Person[] = [
  { id: 'leaId', firstName: 'Léa', lastName: 'Dupont', sex: 'female', isAlive: true },
  { id: 'tomId', firstName: 'Tom', lastName: 'Blanc', sex: 'male', isAlive: true },
]

const mountList = (list: Person[] = persons) =>
  mountSuspended(PersonList, { props: { persons: list } })

describe('PersonList', () => {
  it('should show one item per person', async () => {
    const wrapper = await mountList()

    expect(wrapper.findAll('li')).toHaveLength(2)
  })

  it('should show the full name of each person in the given order', async () => {
    const wrapper = await mountList()

    expect(wrapper.findAll('li').map(li => li.find('p').text())).toEqual(['Léa Dupont', 'Tom Blanc'])
  })

  it('should link each person to their own page', async () => {
    const wrapper = await mountList()

    expect(wrapper.findAll('a').map(a => a.attributes('href'))).toEqual(['/?member=leaId', '/?member=tomId'])
  })

  it('should not show any item when there is no person', async () => {
    const wrapper = await mountList([])

    expect(wrapper.find('ul').exists()).toBe(true)
    expect(wrapper.findAll('li')).toHaveLength(0)
  })
})
