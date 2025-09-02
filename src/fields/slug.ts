import deepMerge from '@/utilities/deepMerge'
import { formatSlug } from '@/utilities/formatSlug'
import type { Field } from 'payload'

type Slug = (fieldToUse?: string, overrides?: Partial<Field>) => Field

export const slugField: Slug = (fallbackField = 'title', overrides = {}) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug(fallbackField)],
      },
      required: true,
      index: true,
      label: 'Pot',
    },
    overrides,
  )