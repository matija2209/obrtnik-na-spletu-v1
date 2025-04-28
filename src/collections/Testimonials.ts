import { CollectionConfig, Access } from 'payload';
import { User } from '../../payload-types'; // Import User type

// Define access control
const isAdminOrLoggedIn: Access = ({ req }) => !!req.user;
const anyone: Access = () => true;

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels:{
    singular: 'Mnenje',
    plural: 'Mnenja',
  },
  admin: {
    useAsTitle: 'name', // Use the person's name as the title in Admin UI
    defaultColumns: ['name', 'service', 'rating', 'createdAt'],
    description: 'Mnenja strank o naših storitvah.',
  },
  access: {
    read: anyone, // Anyone can read testimonials
    create: isAdminOrLoggedIn, // Only logged-in users can create
    update: isAdminOrLoggedIn, // Only logged-in users can update
    delete: isAdminOrLoggedIn, // Only logged-in users can delete
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Ime stranke',
    },
    {
      name: 'time', // E.g., "pred 1 mesecem", "2 weeks ago"
      type: 'text',
      label: 'Čas / Datum',
      admin: {
        description: 'Relativni čas ali specifični datum podaje mnenja.'
      }
    },
    {
      name: 'location',
      type: 'text',
      label: 'Lokacija (Neobvezno)',
    },
    {
      name: 'service', // Service received, e.g., "Montaža klime"
      type: 'text',
      label: 'Prejeta storitev (Neobvezno)',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Vsebina mnenja',
      localized: true, // Content might need translation
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      label: 'Ocena (1-5)',
      admin: {
        step: 1,
        description: 'Ocena stranke od 1 do 5 zvezdic.'
      }
    },
    // Optional: Add a field to link to the specific product/service if applicable
    // {
    //   name: 'relatedProduct',
    //   type: 'relationship',
    //   relationTo: 'products', 
    //   label: 'Povezan izdelek/storitev (Neobvezno)',
    // },
  ],
}; 