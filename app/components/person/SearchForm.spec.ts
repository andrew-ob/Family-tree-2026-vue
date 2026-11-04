import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import PersonSearchForm from './SearchForm.vue'

describe('PersonSearchForm', () => {
  it('should show a first name and a last name field', async () => {
    const wrapper = await mountSuspended(PersonSearchForm)

    expect(wrapper.find('input[name="firstName"]').exists()).toBe(true)
    expect(wrapper.find('input[name="lastName"]').exists()).toBe(true)
  })

  it('should show the values it is given', async () => {
    const wrapper = await mountSuspended(PersonSearchForm, {
      props: { firstName: 'Léa', lastName: 'Dupont' },
    })

    expect((wrapper.find('input[name="firstName"]').element as HTMLInputElement).value).toBe('Léa')
    expect((wrapper.find('input[name="lastName"]').element as HTMLInputElement).value).toBe('Dupont')
  })

  it('should emit the first name typed', async () => {
    const wrapper = await mountSuspended(PersonSearchForm)

    await wrapper.find('input[name="firstName"]').setValue('Léa')

    expect(wrapper.emitted('update:firstName')?.[0]).toEqual(['Léa'])
  })

  it('should emit the last name typed', async () => {
    const wrapper = await mountSuspended(PersonSearchForm)

    await wrapper.find('input[name="lastName"]').setValue('Dupont')

    expect(wrapper.emitted('update:lastName')?.[0]).toEqual(['Dupont'])
  })

  it('should not reload the page when the form is submitted', async () => {
    const wrapper = await mountSuspended(PersonSearchForm)
    const submit = new Event('submit', { cancelable: true })

    wrapper.find('form').element.dispatchEvent(submit)

    expect(submit.defaultPrevented).toBe(true)
  })
})
