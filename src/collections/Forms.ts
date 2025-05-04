'use strict'

import { isSuperAdminAccess } from '@/access/isSuperAdminAccess'
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin'
import type { CollectionConfig } from 'payload'

const formFieldTypes = [
  { label: 'Text', value: 'text' },
  { label: 'Email', value: 'email' },
  { label: 'Text Area', value: 'textarea' },
  { label: 'Checkbox', value: 'checkbox' },
  // Radio and Select might need options defined within the field itself
  // Let's keep it simple for now, maybe add options later if needed.
  // { label: 'Radio', value: 'radio' },
  // { label: 'Select', value: 'select' },
]

const anyone = () => true

export const Forms: CollectionConfig = {
  slug: 'forms',
  labels: {
    singular: 'Obrazec',
    plural: 'Obrazci',
  },
  admin: {
    useAsTitle: 'title',
    description: 'Ustvarite in upravljajte obrazce za zbiranje podatkov.',
    group: 'Vsebina',
  },
  access: {
    read: anyone,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      type: 'text',
    },
    {
      name: 'label',
      label: 'Internal Label',
      type: 'text',
      required: true,
      admin: {
        description: 'A label for identifying this form in the admin panel.',
      },
    },
    {
      name: 'replyToEmail',
      label: 'Reply-To Email Address',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address where form submission notifications will be sent or replied from.',
      },
    },
    {
      name: 'redirectUrl',
      label: 'Redirect URL (Optional)',
      type: 'text',
      admin: {
        description: 'URL to redirect the user to after successful submission.',
      },
    },
    {
      name: 'fields',
      label: 'Form Fields',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'name',
          label: 'Field Name / ID',
          type: 'text',
          required: true,
          admin: {
            description: 'Unique identifier for this field (e.g., "firstName", "message"). Used internally and for submission data.',
          },
        },
        {
          name: 'label',
          label: 'Field Label',
          type: 'text',
          required: true,
          admin: {
            description: 'The label displayed to the user for this field.',
          },
        },
        {
          name: 'placeholder',
          label: 'Placeholder Text',
          type: 'text',
        },
        {
          name: 'type',
          label: 'Field Type',
          type: 'select',
          options: formFieldTypes,
          required: true,
        },
        {
          name: 'required',
          label: 'Required Field',
          type: 'checkbox',
          defaultValue: false,
        },
        // TODO: Add options for select/radio if needed in the future
      ],
    },
  ],
} 