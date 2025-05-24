import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig, Access } from 'payload';

import { slugField } from '@/fields/slug';

// Define access control - allowing anyone to read, admin to create/update/delete
const anyone: Access = () => true;


export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Storitev',
    plural: 'Storitve',
  },
  admin: {
    useAsTitle: 'title',
    description: 'Upravljajte seznam storitev, ki jih ponujate.',
    group: 'Dejavnost',
    defaultColumns: ['title', 'serviceId', 'updatedAt'],
    // components:{
    //   views:{
    //     list: {
    //       Component: "/components/admin/collections/services/services-list.tsx",
    //     }
    //   }
    // }
  },
  access: {
    read: anyone,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    slugField('title', {
      name: 'serviceId',
      label: 'Unikatni ID',
      unique: true,
      index: true,
      admin: {
        description: 'ID se generira samodejno iz naslova.',
        readOnly: true,
        position: 'sidebar',
      }
    }),
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
      required: true,
      localized: true,
    },
    {
      name: 'features',
      label: 'Značilnosti',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'featureText',
          type: 'text',
          label: 'Besedilo značilnosti',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'images',
      label: 'Slike',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Slika',
          required: true,
        },
      ],
    },
    {
      name: 'priceDisplay',
      type: 'text',
      label: 'Prikaz cene (Neobvezno)',
      localized: true, // Price display might differ by locale/market
      admin: {
        description: 'Primer: "€50", "Od €100", "€150 - €250", "Po dogovoru"',
      }
    },
    {
      name: 'relatedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      label: 'Povezani projekti (Neobvezno)',
      admin: {
        description: 'Prikaži projekte, kjer je bila ta storitev uporabljena.',
      }
    },
    {
      name: 'relatedTestimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      label: 'Povezana mnenja (Neobvezno)',
      admin: {
        description: 'Prikaži mnenja strank, ki se nanašajo na to storitev.',
      }
    },
    {
      name: 'dedicatedPage',
      label: 'Namenska stran (Neobvezno)',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: false,
      admin: {
        description: 'Poveži storitev z njeno namensko podstranjo, če obstaja.',
      }
    }
  ],
}; 