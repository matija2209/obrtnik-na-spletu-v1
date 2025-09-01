import backgroundColour from '@/fields/backgroundColour';
import colourSchema from '@/fields/colourSchema';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';


const ProjectHighlightsBlock: Block = {
  slug: 'projectHighlights',
  interfaceName: 'ProjectHighlightsBlock',
  labels: {
    singular: 'Projekti odsek (Splošni)',
    plural: 'Projekti odseki (Splošni)',
  },
  fields: [
    {
      name: 'template',
      label: 'Template',
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        {
          label: 'Default Layout',
          value: 'default',
        },
        {
          label: 'Variant 1',
          value: 'variant1',
        },
        {
          label: 'Variant 2',
          value: 'variant2',
        },

        // Add more template options here
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Naslov sekcije projektov',
      required: false,
      localized: true,
      defaultValue: '',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis sekcije projektov',
      localized: true,
      defaultValue: '',
    },
    backgroundColour(),
    colourSchema(),
    isTransparent(),
    
    {
      name:"cta",
      relationTo:"ctas",
      hasMany:true,
      label:"CTA",
      required:false,
      type:"relationship",
    },
    {
      name: 'highlightedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      label: 'Izbrani projekti za prikaz',
      required: false,
    },
    {
      name: 'autoSyncProjects',
      type: 'checkbox',
      label: 'Samodejno dodaj nove projekte',
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