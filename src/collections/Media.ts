import { CollectionConfig, Access } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';

export const Media: CollectionConfig = {
    slug: 'media',
    labels:{
        singular: 'Slika',
        plural: 'Slike',
    },
    admin: {
        description: 'Naložite in upravljajte slike ter druge medijske datoteke.',
        // components:{
        //   views:{
        //     list: {
        //       Component: "/components/admin/collections/media/media-list.tsx",
        //     }
        //   }
        // },
        group: 'Vsebina',
    },
    access: {
      read: () => true,
      create: superAdminOrTenantAdminAccess,
      update: superAdminOrTenantAdminAccess,
      delete: superAdminOrTenantAdminAccess
    },
    upload: {
      bulkUpload: true,
      crop: true,
      imageSizes: [
        {
          name: 'thumbnail',
          width: 300,
          height: 300,
          position: 'centre',
        },
        {
          name: 'card',
          width: 640,
          height: 480,
        },
        {
          name: 'tablet',
          width: 1024,
          height: undefined,
          position: 'centre',
        },
      ],
      adminThumbnail: 'thumbnail',
      mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    },
    fields: [
      
        {
            name: 'alt',
            type: 'text',
            label: 'Nadomestno besedilo',
            required: false,
            // admin: {
            //   components: {
            //     Cell: '@/components/admin/collections/media/ThumbnailCell',
            //   }
            // }
        },
    ],
}; 