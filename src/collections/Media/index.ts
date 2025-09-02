import { CollectionConfig, Access } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';

import generateBase64Preview from './hooks/generateBase64Preview';
import { revalidateMediaCache, revalidateMediaCacheDelete } from './hooks/revalidateCache';


export const Media: CollectionConfig = {
    slug: 'media',
    labels:{
        singular: {
            en: 'Image',
            sl: 'Slika',
            de: 'Bild',
        },
        plural: {
            en: 'Images',
            sl: 'Slike',
            de: 'Bilder',
        },
    },
    admin: {
        description: {
            sl: 'Naložite in upravljajte slike ter druge medijske datoteke.',
            de: 'Laden Sie Bilder und andere Medien-Dateien hoch und verwalten Sie sie.',
            en: 'Upload and manage images and other media files.',
        },
        // components:{
        //   views:{
        //     list: {
        //       Component: "/components/admin/collections/media/media-list.tsx",
        //     }
        //   }
        // },
        group: {
          sl: 'Vsebina',
          de: 'Inhalt',
          en: 'Content',
        },
    },
    access: {
      read: () => true,
      create: superAdminOrTenantAdminAccess,
      update: superAdminOrTenantAdminAccess,
      delete: superAdminOrTenantAdminAccess
    },
    hooks: {
      afterChange: [ generateBase64Preview, revalidateMediaCache],
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
            label: {
                sl: 'Nadomestno besedilo',
                de: 'Alternativer Text',
                en: 'Alternative Text',
            },
            required: false,
            // admin: {
            //   components: {
            //     Cell: '@/components/admin/collections/media/ThumbnailCell',
            //   }
            // }
        },
        {
            name: 'base64Preview',
            label: 'Base64 Preview',
            type: 'text',
            admin: {
                readOnly: true,
                description: 'A small, blurred Base64 representation of the image for placeholders.',
            },
            // You might want to hide it from the API unless specifically requested
            // access: {
            //   read: () => false, // Or some specific access control
            //   update: () => false,
            // },
        },
        {
            name: 'width',
            type: 'number',
              label: {
                sl: 'Širina',
                de: 'Breite',
                en: 'Width',
            },
            admin: {
                description: {
                    sl: 'Originalna širina slike v pikslih',
                    de: 'Originalbreite der Bilddatei in Pixel',
                    en: 'Original width of the image in pixels',
                },
                readOnly: true,
            },
        },
        {
            name: 'height',
            type: 'number',
            label: {
                sl: 'Višina',
                de: 'Höhe',
                en: 'Height',
            },
            admin: {
                description: {
                    sl: 'Originalna višina slike v pikslih',
                    de: 'Originalhöhe der Bilddatei in Pixel',
                    en: 'Original height of the image in pixels',
                },
                readOnly: true,
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
                {
                    label: {
                        sl: 'Ročno nalaganje',
                        de: 'Manuelles Hochladen',
                        en: 'Manual Upload',
                    },
                    value: 'manual',
                },
                {
                    label: {
                        sl: 'Facebook',
                        de: 'Facebook',
                        en: 'Facebook',
                    },
                    value: 'facebook',
                },
            ],
            defaultValue: 'manual',
            admin: {
                description: {
                    sl: 'Vir medijske datoteke',
                    de: 'Quelle der Medien-Datei',
                    en: 'Source of the media file',
                },
                readOnly: true,
            },
        },
        {
            name: 'facebookId',
            type: 'text',
              label: {
                sl: 'Facebook ID',
                de: 'Facebook-ID',
                en: 'Facebook ID',
            },
            required: false,
            admin: {
                description: {
                    sl: 'Facebook attachment ID (if imported from Facebook)',
                    de: 'Facebook-Anhäng-ID (wenn aus Facebook importiert)',
                    en: 'Facebook attachment ID (if imported from Facebook)',
                },
                readOnly: true,
                condition: (data) => data.source === 'facebook',
            },
        },
    ],
}; 