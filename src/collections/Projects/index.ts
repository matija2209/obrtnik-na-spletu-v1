import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig } from 'payload';
import { slugField } from '@/fields/slug';


export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: {
      en: 'Project',
      sl: 'Projekt',
      de: 'Projekt',
    },
    plural: {
      en: 'Projects',
      sl: 'Projekti',
      de: 'Projekte',
    },
  },
  access: {
    read: () => true,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  admin: {
    useAsTitle: 'title',
    hidden: true,
    description: 'Predstavite zaključene projekte ali reference.',
    group: {
      sl: 'Dejavnost',
      de: 'Projekte',
      en: 'Projects',
    },
    defaultColumns: ['title', 'projectStatus', 'location', 'updatedAt'],
    // components:{
    //   views:{
    //     list: {
    //       Component: "/components/admin/collections/projects/projects-list.tsx",
    //     }
    //   }
    // }
  },
  hooks: {
    afterChange: [],
  },
  fields: [
    slugField('title', {
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
      name: 'title',
      type: 'text',
      label: {
        sl: 'Naslov',
        de: 'Titel',
        en: 'Title',
      },
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      label: {
        sl: 'Opis',
        de: 'Beschreibung',
        en: 'Description',
      },
      admin: {
        description: {
          sl: 'Detajlni opis projekta',
          de: 'Detaillierte Beschreibung des Projekts',
          en: 'Detailed description of the project',
        },
      },
    },
    {
      name: 'excerpt',
      type: 'text',
      label: {
        sl: 'Kratek opis',
        de: 'Kurze Beschreibung',
        en: 'Excerpt',
      },
      admin: {
        description: {
          sl: 'Kratek opis projekta, ki se bo prikazal na strani projekta',
          de: 'Kurze Beschreibung des Projekts, die auf der Projektseite angezeigt wird',
          en: 'Short description of the project, which will be displayed on the project page',
        },
      },
    },
    {
      name: 'projectStatus',
      type: 'select',
      label: {
        sl: 'Status projekta',
        de: 'Projektstatus',
        en: 'Project Status',
      },
      options: [
        { label: {
          sl: 'Načrtovano',
          de: 'Geplant',
          en: 'Planned',
        }, value: 'planned' },
        { label: {
          sl: 'V izvajanju',
          de: 'In Arbeit',
          en: 'In Progress',
        }, value: 'in-progress' },
        { label: {
          sl: 'Zaključeno',
          de: 'Abgeschlossen',
          en: 'Completed',
        }, value: 'completed' },
      ],
      defaultValue: 'completed',
    },
    {
      name: 'location',
      type: 'text',
      label: {
        sl: 'Lokacija',
        de: 'Standort',
        en: 'Location',
      },
    },
    {
      name: 'metadata',
      type: 'group',
      label: {
        sl: 'Metapodatki projekta',
        de: 'Metadaten des Projekts',
        en: 'Project Metadata',
      },
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: {
            sl: 'Datum začetka',
            de: 'Startdatum',
            en: 'Start Date',
          },
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'completionDate',
          type: 'date',
          label: {
            sl: 'Datum zaključka',
            de: 'Enddatum',
            en: 'Completion Date',
          },
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
            condition: (data) => data?.projectStatus === 'completed',
          },
        },
        {
          name: 'client',
          type: 'text',
          label: {
            sl: 'Ime naročnika',
            de: 'Kundenname',
            en: 'Client Name',
          },
        },
        {
          name: 'budget',
          type: 'text',
          label: {
            sl: 'Proračun projekta',
            de: 'Projektkosten',
            en: 'Project Budget',
          },
          admin: {
            description: {
              sl: 'Optionaler Proračun für das Projekt',
              de: 'Optionaler Projektkostenrahmen',
              en: 'Optional budget for the project',
            },
          },
        },
      ],
    },
    {
      name: 'projectImages',
      type: 'array',
      label: {
        sl: 'Slike projekta / Pari',
        de: 'Projektbilder / Paare',
        en: 'Project Images / Pairs',
      },
      minRows: 1,
      fields: [
        {
          name: 'image1',
          label: {
            sl: 'Slika 1 (ali pred posegom)',
            de: 'Bild 1 (oder vor der Arbeit)',
            en: 'Image 1 (or before work)',
          },
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'altText1',
          type: 'text',
          label: {
            sl: 'Nadomestno besedilo za sliko 1',
            de: 'Alternativer Text für Bild 1',
            en: 'Alternative text for image 1',
          },
        },
        {
          name: 'image2',
          label: {
            sl: 'Slika 2 (ali po posegu) (Izbirno)',
            de: 'Bild 2 (oder nach der Arbeit) (optional)',
            en: 'Image 2 (or after work) (optional)',
          },
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            condition: (_, siblingData) => !!siblingData.image1,
          }
        },
        {
          name: 'altText2',
          type: 'text',
          label: {
            sl: 'Nadomestno besedilo za sliko 2',
            de: 'Alternativer Text für Bild 2',
            en: 'Alternative text for image 2',
          },
          admin: {
            condition: (_, siblingData) => !!siblingData.image2,
          },
        },
        {
          name: 'pairDescription',
          type: 'richText',
            label: {
            sl: 'Opis slike/para (Izbirno)',
            de: 'Bildbeschreibung / Vergleich (optional)',
            en: 'Image description / pair (optional)',
          },
          admin: {
            description: {
              sl: 'Beschreibe dieses Bild oder den Vergleich vor/nach',
              de: 'Besch  reibe dieses Bild oder den Vergleich vor/nach',
              en: 'Describe this image or the before/after comparison',
            },
            condition: (_, siblingData) => !!siblingData.image2,
          }
        },
      ],
    },
    {
      name: 'tags',
      type: 'text',
      label: {
        sl: 'Oznake projekta',
        de: 'Projekt-Tags',
        en: 'Project Tags',
      },
      hasMany: true,
      admin: {
        description: {
          sl: 'Füge relevante Tags hinzu, um dieses Projekt zu kategorisieren',
          de: 'Füge relevante Tags hinzu, um dieses Projekt zu kategorisieren',
          en: 'Add relevant tags to categorize this project',
        },
        position: "sidebar",
      },
    },
    {
      name: 'servicesPerformed',
      label: {
        sl: 'Izvedene storitve (Izbirno)',
        de: 'Durchgeführte Dienstleistungen (optional)',
        en: 'Performed Services (optional)',
      },
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        position: "sidebar",
        description: {
          sl: 'Wähle die Dienstleistungen, die zu diesem Projekt gehören',
          de: 'Wähle die Dienstleistungen, die zu diesem Projekt gehören',
          en: 'Select the services that were part of this project',
        },
      },
    },
    {
      name: 'relatedTestimonials',
      label: {
        sl: 'Povezane ocene (Izbirno)',
        de: 'Verknüpfte Bewertungen (optional)',
        en: 'Related Testimonials (optional)',
      },
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: {
        position: "sidebar",
        description: {
          sl: 'Verknüpfe Bewertungen, die spezifisch zu diesem Projekt gehören',
          de: 'Verknüpfe Bewertungen, die spezifisch zu diesem Projekt gehören',
          en: 'Link any testimonials specifically related to this project',
        },
      },
    },
    {
      name: 'source',
      type: 'select',
        label: {
        sl: 'Vir',
        de: 'Quelle',
        en: 'Source',
      },
      options: [
        { label: {
          sl: 'Ročno',
          de: 'Manuell',
          en: 'Manual',
        }, value: 'manual' },
        { label: {
          sl: 'Facebook',
          de: 'Facebook',
          en: 'Facebook',
        }, value: 'facebook' },
      ],
      defaultValue: 'manual',
      admin: {
        description: {
          sl: 'Vir projekta',
          de: 'Quelle des Projekts',
          en: 'Source of the project',
        },
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'facebookPostId',
      type: 'text',
      label: {
        sl: 'Facebook Post ID',
        de: 'Facebook-Post-ID',
        en: 'Facebook Post ID',
      },
      required: false,
      admin: {
        description: {
          sl: 'ID Facebook objave iz katere je bil projekt ustvarjen',
          de: 'ID der Facebook-Beitrag, aus dem das Projekt erstellt wurde',
          en: 'ID of the Facebook post from which the project was created',
        },
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data.source === 'facebook',
      },
    },
  ],
  timestamps: true,
};