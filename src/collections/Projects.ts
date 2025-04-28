import { CollectionConfig } from 'payload';

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels:{
    singular: 'Projekt',
    plural: 'Projekti',
  },
  
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'updatedAt'],
    description: 'Projekti za prikaz na spletni strani.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Product ${operation}d: ${doc.title}. Triggering Vercel build...`);
          try {
            const response = await fetch('https://api.vercel.com/v1/integrations/deploy/prj_0YGxAZLtYVrGeyhpXRI7RPpXlDpB/Xgkc2A820Q', {
              method: 'POST',
            });
            const data = await response.json();
            if (response.ok && data.job && data.job.id) {
              console.log(`Vercel build triggered successfully. Job ID: ${data.job.id}`);
            } else {
              console.error('Failed to trigger Vercel build:', response.status, response.statusText, data);
            }
          } catch (error) {
            console.error('Error triggering Vercel build:', error);
          }
        }
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: 'Naslov projekta',
      type: 'text',
      required: true,
      defaultValue: '',
    },
    {
      name: 'description',
      label: 'Opis projekta',
      type: 'textarea',
      required: false,
      defaultValue: '',
    },
    {
      name: 'location',
      label: 'Lokacija projekta',
      type: 'text',
      required: false,
      defaultValue: '',
    },
    {
      name: 'images',
      label: 'Slike projekta',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'image',
          label: 'Slika',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'altText',
          label: 'Nadomestno besedilo',
          type: 'text',
          required: false,
          defaultValue: '',
        },
      ],
    },
  ],
}; 