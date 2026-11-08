import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'

import type { FamilyData } from '~~/shared/types/familyTypes'

import { useFamily } from '../composables/useFamily'
import IndexPage from './index.vue'

const fixture: FamilyData = {
  persons: [
    { id: 'leaId', firstName: 'Léa', lastName: 'Dupont', sex: 'female', isAlive: true, birth: { date: '1970' } },
    { id: 'tomId', firstName: 'Tom', lastName: 'Blanc', sex: 'male', isAlive: false, death: { date: '2001' } },
    { id: 'noaId', firstName: 'Noa', lastName: 'Durand', sex: 'unknown', isAlive: true },
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

  it('should not filter the list while typing', async () => {
    const wrapper = await mountPage()

    await wrapper.find('input[name="firstName"]').setValue('lea')

    expect(wrapper.findAll('li')).toHaveLength(3)
  })

  it('should filter the list when the form is submitted', async () => {
    const wrapper = await mountPage()

    await wrapper.find('input[name="firstName"]').setValue('lea')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.findAll('li').map(li => li.find('p').text())).toEqual(['Léa Dupont'])
  })

  it('should show a message when no person matches after a search', async () => {
    const wrapper = await mountPage()

    await wrapper.find('input[name="lastName"]').setValue('blancj')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.findAll('li')).toHaveLength(0)
    expect(wrapper.text()).toContain('Aucune personne trouvée')
  })

  it('should show the whole family again after a reset', async () => {
    const wrapper = await mountPage()

    await wrapper.find('input[name="firstName"]').setValue('lea')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.findAll('li')).toHaveLength(1)

    await wrapper.find('form').trigger('reset')

    expect(wrapper.findAll('li')).toHaveLength(3)
  })

  it('should empty the fields after a reset', async () => {
    const wrapper = await mountPage()

    await wrapper.find('input[name="firstName"]').setValue('lea')
    await wrapper.find('input[name="lastName"]').setValue('dupont')
    await wrapper.find('form').trigger('reset')

    expect((wrapper.find('input[name="firstName"]').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('input[name="lastName"]').element as HTMLInputElement).value).toBe('')
  })

  it('should remove the no match message after a reset', async () => {
    const wrapper = await mountPage()

    await wrapper.find('input[name="lastName"]').setValue('blancj')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Aucune personne trouvée')

    await wrapper.find('form').trigger('reset')

    expect(wrapper.text()).not.toContain('Aucune personne trouvée')
    expect(wrapper.findAll('li')).toHaveLength(3)
  })
})
