import { CollectionConfig, Access } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { syncGalleryBlocks } from './hooks/syncGalleryBlocks';
import { revalidateMediaCache, revalidateMediaCacheDelete } from './hooks/revalidateMediaCache';

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
    hooks: {
      afterChange: [syncGalleryBlocks, revalidateMediaCache],
      afterDelete: [revalidateMediaCacheDelete],
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
      formatOptions: {
        format: 'webp',
        options: {
          quality: 80,
        },
      },
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
        {
            name: 'width',
            type: 'number',
            label: 'Širina',
            admin: {
                description: 'Originalna širina slike v pikslih',
                readOnly: true,
            },
        },
        {
            name: 'height',
            type: 'number',
            label: 'Višina',
            admin: {
                description: 'Originalna višina slike v pikslih',
                readOnly: true,
            },
        },
        {
            name: 'source',
            type: 'select',
            label: 'Vir',
            options: [
                {
                    label: 'Manual Upload',
                    value: 'manual',
                },
                {
                    label: 'Facebook',
                    value: 'facebook',
                },
            ],
            defaultValue: 'manual',
            admin: {
                description: 'Vir medijske datoteke',
                readOnly: true,
            },
        },
        {
            name: 'facebookId',
            type: 'text',
            label: 'Facebook ID',
            required: false,
            admin: {
                description: 'Facebook attachment ID (if imported from Facebook)',
                readOnly: true,
                condition: (data) => data.source === 'facebook',
            },
        },
    ],
}; 