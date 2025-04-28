import { CollectionConfig, Access } from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../../payload-types'; // Import User type from generated types

// Derive __dirname if needed within this file, or rely on config context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define specific access control functions with proper typing
const isAdminOrLoggedIn: Access = ({ req }) => !!req.user;
const anyone: Access = () => true;

export const Media: CollectionConfig = {
    slug: 'media',
    labels:{
        singular: 'Slika',
        plural: 'Slike',
    },
    access: {
      read: () => true,
      create: ({ req: { user } }) => !!user,
      update: ({ req: { user } }) => !!user,
      delete: ({ req: { user } }) => !!user,
    },
    upload: {
      staticDir: path.resolve(__dirname, './public/media'),
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
        },
    ],
}; 