import backgroundColour from '@/fields/backgroundColour';
import textColour from '@/fields/textColour';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';


const ProjectHighlightsBlock: Block = {
  slug: 'projectHighlights',
  interfaceName: 'ProjectHighlightsBlock',
  labels: {
    singular: {
      sl: 'Projekti odsek (Splošni)',
      de: 'Projekt Abschnitt (Allgemein)',
      en: 'Project Section (General)',
    },
    plural: {
      sl: 'Projekti odseki (Splošni)',
      de: 'Projekt Abschnitte (Allgemein)',
      en: 'Project Sections (General)',
    },
  },
  fields: [
    {
      name: 'template',
      label: {
        sl: 'Predloga',
        de: 'Vorlage',
        en: 'Template',
      },
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        {
          label: {
            sl: 'Privzeti način',
            de: 'Standard-Layout',
            en: 'Default Layout',
          },
          value: 'default',
        },
      ],
    },
    {
      name: 'kicker',
      type: 'text',
      label: {
        sl: 'Kicker',
        de: 'Kicker',
        en: 'Kicker',
      },
      defaultValue: '',
    },
    {
      name: 'title',
      type: 'text',
      label: {
        sl: 'Naslov sekcije projektov',
        de: 'Titel der Projektsektion',
        en: 'Title of project section',
      },
      required: false,
      
      defaultValue: '',
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        sl: 'Opis sekcije projektov',
        de: 'Beschreibung der Projektsektion',
        en: 'Description of project section',
      },
      
      defaultValue: '',
    },
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),

    
    isTransparent(),
    
    {
      name:"cta",
      relationTo:"ctas",
      hasMany:true,
      label: {
        sl: 'CTA',
        de: 'CTA',
        en: 'CTA',
      },
      required:false,
      type:"relationship",
    },
    {
      name: 'highlightedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      label: {
        sl: 'Izbrani projekti za prikaz',
        de: 'Ausgewählte Projekte für die Anzeige',
        en: 'Highlighted projects for display',
      },
      required: false,
    },
    {
      name: 'autoSyncProjects',
      type: 'checkbox',
      label: {
        sl: 'Samodejno dodaj nove projekte',
        de: 'Neue Projekte automatisch hinzufügen',
        en: 'Automatically add new projects',
      },
      defaultValue: false,
      admin: {
        description: 'Ko je omogočeno, se bodo nove naložene slike samodejno dodale v to galerijo',
      },
    },
    {
      name:"idHref",
      type:"text",
      defaultValue:"projekti"
    },
  ]
};

export default ProjectHighlightsBlock; 