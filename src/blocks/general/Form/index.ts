import type { Block } from 'payload'

import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import backgroundColour from '@/fields/backgroundColour'
import isTransparent from '@/fields/isTransperant'

export const FormBlock: Block = {
  slug: 'formBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] })]
        },
      }),
      label: 'Intro Content',
    },
    backgroundColour(),
    {
      name: 'colourScheme',
      label: 'Barvna shema',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primarno (Privzeto)', value: 'primary' },
        { label: 'Primarno 30%', value: 'primary-30' },
        { label: 'Primarno 50%', value: 'primary-50' },
        { label: 'Primarno 80%', value: 'primary-80' },
        { label: 'Sekundarno', value: 'secondary' },
        { label: 'Sekundarno 30%', value: 'secondary-30' },
        { label: 'Sekundarno 50%', value: 'secondary-50' },
        { label: 'Sekundarno 80%', value: 'secondary-80' },
        { label: 'Poudarek', value: 'accent' },
        { label: 'Poudarek 30%', value: 'accent-30' },
        { label: 'Priglušeno', value: 'muted' },
        { label: 'Priglušeno 50%', value: 'muted-50' },
        { label: 'Opozorilo', value: 'destructive' },
        { label: 'Opozorilo 30%', value: 'destructive-30' },
        { label: 'Svetlo', value: 'light' },
        { label: 'Svetlo 50%', value: 'light-50' },
        { label: 'Temno', value: 'dark' },
        { label: 'Temno 80%', value: 'dark-80' },
      ],
      admin: {
        description: 'Izberite barvno shemo za ta odsek. Vpliva na ozadje, besedilo in gumbove.',
      }
    },
    isTransparent(),
    {
      name:"idHref",
      type:"text",
      defaultValue:"form"
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Obrazci odseki (Splošni)',
    singular: 'Obrazec odsek (Splošni)',
  },
}