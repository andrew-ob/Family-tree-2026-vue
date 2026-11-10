import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import UiAvatar from './Avatar.vue'

type Props = InstanceType<typeof UiAvatar>['$props']

const mountAvatar = (props: Partial<Props> = {}) =>
  mountSuspended(UiAvatar, { props: { person: { firstName: 'Léa', lastName: 'Dupont' }, ...props } })

describe('UiAvatar', () => {
  it.each<[string, Props['person'], string]>([
    ['a first and a last name', { firstName: 'Léa', lastName: 'Dupont' }, 'LD'],
    ['lowercase names', { firstName: 'léa', lastName: 'dupont' }, 'LD'],
    ['surrounding spaces', { firstName: '  Léa ', lastName: ' Dupont' }, 'LD'],
    ['an accented first letter', { firstName: 'Émile', lastName: 'Zola' }, 'ÉZ'],
    ['only a first name', { firstName: 'Léa' }, 'L'],
    ['only a last name', { lastName: 'Dupont' }, 'D'],
    ['an empty last name', { firstName: 'Léa', lastName: '' }, 'L'],
    ['an empty first name', { firstName: '', lastName: 'Dupont' }, 'D'],
  ])('should show the initials when the person has %s', async (_case, person, expected) => {
    const wrapper = await mountAvatar({ person })

    expect(wrapper.text()).toBe(expected)
  })

  it.each<[string, Props['person']]>([
    ['no name', {}],
    ['empty names', { firstName: '', lastName: '' }],
    ['blank names', { firstName: '  ', lastName: ' ' }],
  ])('should show a question mark when the person has %s', async (_case, person) => {
    const wrapper = await mountAvatar({ person })

    expect(wrapper.text()).toBe('?')
  })

  it.each<[NonNullable<Props['sex']>, string]>([
    ['female', 'bg-person-female-bg'],
    ['male', 'bg-person-male-bg'],
    ['unknown', 'bg-person-unknown-bg'],
  ])('should use the matching color when the sex is %s', async (sex, color) => {
    const wrapper = await mountAvatar({ sex })

    expect(wrapper.classes()).toContain(color)
  })

  it('should use the unknown color by default', async () => {
    const wrapper = await mountAvatar()

    expect(wrapper.classes()).toContain('bg-person-unknown-bg')
  })

  it('should use the unknown color when showSex is false', async () => {
    const wrapper = await mountAvatar({ sex: 'female', showSex: false })

    expect(wrapper.classes()).toContain('bg-person-unknown-bg')
    expect(wrapper.classes()).not.toContain('bg-person-female-bg')
  })

  it.each<[NonNullable<Props['size']>, string]>([
    ['list', 'size-[40px]'],
    ['relations', 'size-[32px]'],
    ['tree', 'size-[42px]'],
    ['fan', 'size-[34px]'],
  ])('should apply the matching size when size is %s', async (size, cls) => {
    const wrapper = await mountAvatar({ size })

    expect(wrapper.classes()).toContain(cls)
  })

  it('should use the list size by default', async () => {
    const wrapper = await mountAvatar()

    expect(wrapper.classes()).toContain('size-[40px]')
  })

  it('should use the focus style instead of the sex color when onFocus is true', async () => {
    const wrapper = await mountAvatar({ sex: 'male', onFocus: true })

    expect(wrapper.classes()).toContain('bg-bg/24')
    expect(wrapper.classes()).not.toContain('bg-person-male-bg')
  })
})
