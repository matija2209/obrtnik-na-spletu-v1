import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import type { CollectionConfig, Access } from 'payload';

const anyone: Access = () => true;

export const PriceListItems: CollectionConfig = {
  slug: 'price-list-items',
  labels: {
    singular: {
      en: 'Price List Item',
      sl: 'Element Cenika',
      de: 'Preislistenelement',
    },
    plural: {
      en: 'Price List Items',
      sl: 'Elementi Cenika',
      de: 'Preislistenelemente',
    },
  },
  admin: {
    useAsTitle: 'name',
    hidden: true,
    defaultColumns: ['name', 'price', 'section', 'displayOrder', 'updatedAt'],
    description: 'Posamezne postavke na ceniku (npr. Goveja juha, Vrtanje 10cm luknje).',
    group: {
      sl: 'Ceniki',
      de: 'Preislisten',
      en: 'Price Lists',
    },

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
      label: {
        sl: 'Ime Elementa/Storitve',
        de: 'Name des Elements/Dienstes',
        en: 'Name of the Element/Service',
      },
      required: true,
      
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        sl: 'Opis (Neobvezno)',
        de: 'Beschreibung (Optional)',
        en: 'Description (Optional)',
      },
      
    },
    {
      name: 'price',
      type: 'text', // Use text for flexibility (e.g., "€10", "From €50/hr", "€8 / €12")
      label: {
        sl: 'Cena',
        de: 'Preis',
        en: 'Price',
      },
      required: true,
      
    },
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'price-list-sections',
      required: true,
      label: {
        sl: 'Pripadajoča Sekcija',
        de: 'Zugehörige Sektion',
        en: 'Related Section',
      },
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
      label: {
        sl: 'Vrstni red prikaza (znotraj sekcije)',
        de: 'Anzeigereihenfolge (innerhalb der Sektion)',
        en: 'Display Order (within section)',
      },
      admin: {
        step: 1,
      },
    },
  ],
}; 