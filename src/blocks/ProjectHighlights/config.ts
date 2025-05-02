import type { Block } from 'payload';


const ProjectHighlights: Block = {
  slug: 'projectHighlights',
  interfaceName: 'ProjectHighlightsBlock',
  labels: {
    singular: 'Project Highlights Block',
    plural: 'Project Highlights Blocks',
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
        // Add more template options here
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Naslov sekcije projektov',
      required: false,
      localized: true,
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis sekcije projektov',
      localized: true,
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Besedilo gumba (npr. Vsi projekti)',
      localized: true,
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'buttonHref',
      type: 'text',
      label: 'Povezava gumba (npr. /projekti)',
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'highlightedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      label: 'Izbrani projekti za prikaz',
      required: false,
      admin: {
        description: 'Izberite projekte za prikaz na domači strani. Vrstni red je pomemben.',
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    }
  ]
};

export default ProjectHighlights; 