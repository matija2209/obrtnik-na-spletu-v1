import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import backgroundColour from '@/fields/backgroundColour';
import buttonVariantField from '@/fields/buttonVariantField';
import iconField from '@/fields/iconsField';
import { slugField } from '@/fields/slug';
import textColour from '@/fields/textColour';
import { CollectionConfig, Access } from 'payload';
import priorityField from "@/fields/priorityField"
// Define access control
const anyone: Access = () => true;

export const Ctas: CollectionConfig = {
  slug: 'ctas',
  labels: {
    singular: {
      en: 'CTA',
      sl: 'Poziv k dejanju (CTA)',
      de: 'CTA',
    },
    plural: {
      en: 'CTAs',
      sl: 'Pozivi k dejanju (CTA)',
      de: 'CTAs',
    },
  },
  admin: {
    useAsTitle: 'ctaText', // Use ctaText as the title in the admin UI
    defaultColumns: ['ctaText', 'link.type', 'ctaType', 'updatedAt'],
    description: {
      sl: 'Upravljajte pozive k dejanju, ki jih lahko vključite na različnih mestih.',
      de: 'Verwalten Sie Aktionen, die Sie auf verschiedenen Plätzen einsetzen können.',
      en: 'Manage actions that you can include on various places.',
    },
    group: {
      sl: 'Vsebina',
      de: 'Inhalt',
      en: 'Content',
    },
  },
  access: {
    read: anyone,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    slugField('ctaText', {
      label: {
        sl: 'Pot / Unikatni ID',
        de: 'Pfad / Eindeutige ID',
        en: 'Path / Unique ID',
      },
      unique: true,
      index: true,
      admin: {
        description: {
          sl: 'ID se generira samodejno iz naslova.',
          de: 'ID wird automatisch aus dem Titel generiert.',
          en: 'ID is automatically generated from the title.',
        },
        readOnly: false,
        position: 'sidebar',
      }
    }),
    {
      name: 'ctaText',
      type: 'text',
      label: {
        sl: 'Besedilo gumba',
        de: 'Text des Buttons',
        en: 'Button Text',
      },
      required: false,
      
      admin: {
        description: {
          sl: 'Besedilo, ki bo prikazano na gumbu.',
          de: 'Text, der auf dem Button angezeigt wird.',
          en: 'Text that will be displayed on the button.',
        }
      }
    },
    {
      name: 'link',
      type: 'group',
      label: {
        sl: 'Povezava gumba',
        de: 'Button-Link',
        en: 'Button Link',
      },
      fields: [
        {
          name: 'url',
          label: {
            sl: 'Vnesi URL',
            de: 'URL eingeben',
            en: 'Enter URL',
          },
          type: 'text',
          required: false,
        },
        {
          name: 'newTab',
          label: {
            sl: 'Odpri v novem zavihku?',
            de: 'In neuem Tab öffnen?',
            en: 'Open in new tab?',
          },
          type: 'checkbox',
          defaultValue: false,
        }
      ]
    },
    textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),
    backgroundColour(),
    iconField(),
    buttonVariantField(),
    priorityField()
  ],
}; 