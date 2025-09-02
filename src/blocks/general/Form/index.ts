import type { Block } from 'payload'

import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import backgroundColour from '@/fields/backgroundColour'
import isTransparent from '@/fields/isTransperant'
import textColour from '@/fields/textColour'

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
      label: {
        sl: 'Povlecite vsebino v vrh',
        de: 'Inhalt in den Kopf ziehen',
        en: 'Enable Intro Content',
      },
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
      label: {
        sl: 'Vsebina v vrh',
        de: 'Inhalt in den Kopf',
        en: 'Intro Content',
      },
    },
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),
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
    plural: {
      sl: 'Obrazci odseki (Splošni)',
      de: 'Form Abschnitte (Allgemein)',
      en: 'Form Sections (General)',
    },
    singular: {
      sl: 'Obrazec odsek (Splošni)',
      de: 'Form Abschnitt (Allgemein)',
      en: 'Form Section (General)',
    },
  },
}