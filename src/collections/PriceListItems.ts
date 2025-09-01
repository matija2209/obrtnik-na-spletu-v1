import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import type { CollectionConfig, Access } from 'payload';

const anyone: Access = () => true;

export const PriceListItems: CollectionConfig = {
  slug: 'price-list-items',
  labels: {
    singular: 'Element Cenika',
    plural: 'Elementi Cenika',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'section', 'displayOrder', 'updatedAt'],
    description: 'Posamezne postavke na ceniku (npr. Goveja juha, Vrtanje 10cm luknje).',
    
    group: 'Ceniki',
    hidden: true,
  },
  access: {
    read: anyone,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Ime Elementa/Storitve',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis (Neobvezno)',
      localized: true,
    },
    {
      name: 'price',
      type: 'text', // Use text for flexibility (e.g., "€10", "From €50/hr", "€8 / €12")
      label: 'Cena',
      required: true,
      localized: true,
    },
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'price-list-sections',
      required: true,
      label: 'Pripadajoča Sekcija',
      admin: {
        position: 'sidebar',
      }
    },
    // Optional: Add dietary flags for restaurants
    // {
    //   name: 'dietaryFlags',
    //   type: 'select',
    //   hasMany: true,
    //   label: 'Dietne Oznake (Neobvezno)',
    //   options: [
    //     { label: 'Vegetarijansko (V)', value: 'vegetarian' },
    //     { label: 'Vegansko (VG)', value: 'vegan' },
    //     { label: 'Brez glutena (GF)', value: 'gluten_free' },
    //   ]
    // },
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Vrstni red prikaza (znotraj sekcije)',
      admin: {
        step: 1,
      },
    },
  ],
}; 