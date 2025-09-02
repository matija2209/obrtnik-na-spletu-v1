import { CollectionConfig } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { revalidateMediaCache, revalidateMediaCacheDelete } from './hooks/revalidateCache';

export const HighQualityMedia: CollectionConfig = {
  slug: 'highQualityMedia',
  labels: {
    singular: {
      en: 'High Quality Image',
      sl: 'Visoko kakovostna slika',
      de: 'Hochqualitätsbild',
    },
    plural: {
      en: 'High Quality Images',
      sl: 'Visoko kakovostne slike',
      de: 'Hochqualitätsbilder',
    },
  },
  admin: {
    description: {
      sl: 'Naložite visoko ločljivostne slike za hero bannerje in celozaslonske prikaze.',
      de: 'Laden Sie hochauflösende Bilder für Hero-Banner und Vollbildanzeigen hoch.',
      en: 'Upload high-resolution images for hero banners and full-screen displays.',
    },
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
    delete: superAdminOrTenantAdminAccess,
  },
  hooks:{
    afterChange: [revalidateMediaCache],
    afterDelete: [revalidateMediaCacheDelete],
  },
  upload: {
    bulkUpload: true,
    crop: false, // No cropping for high-quality images
    
    imageSizes: [

      {
        name: 'hero-desktop',
        width: 1920,
        height: 1080, // Optional: define a standard crop aspect ratio
        crop: 'center', // Default crop position
        formatOptions: {
          format: 'webp',
          options:{
            quality:80
          }
        },
      },
      { 
        name: 'hero-desktop-narrow',
        width: 1920,
        height: 620,
        crop: 'center',
        formatOptions: {
          format: 'webp',
          options:{
            quality:80
          }
        },
      },
      {
        name: 'hero-tablet',
        width: 1024,
        height: 576,
        crop: 'center',
        formatOptions: {
          format: 'webp',
          options:{
            quality:80
          }
        },
      },
      {
        name: 'hero-mobile',
        width: 768,
        height: 1024, // Portrait ratio (3:4)
        crop: 'center',
        formatOptions: {
          format: 'webp',
          options:{
            quality:80
          }
        },
      }
      
    ],
    adminThumbnail: 'hero',
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    formatOptions: {
      format: 'webp',
      options: {
        quality:90, // Slightly higher quality for hero images
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
      required: true, // Make alt text required for hero images
    }
  ],
};