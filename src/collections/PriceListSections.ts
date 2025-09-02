import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import type { CollectionConfig, Access } from 'payload';

const anyone: Access = () => true;

export const PriceListSections: CollectionConfig = {
  slug: 'price-list-sections',
  labels: {
    singular: {
      en: 'Price List Section',
      sl: 'Sekcija Cenika',
      de: 'Preislistensektion',
    },
    plural: {
      en: 'Price List Sections',
      sl: 'Sekcije Cenikov',
      de: 'Preislistenabschnitte',
    }
  },
  admin: {
    useAsTitle: 'name',
    hidden: true,
    defaultColumns: ['name', 'displayOrder', 'updatedAt'],
    description: 'Kategorije ali sekcije znotraj cenika (npr. Predjedi, Vrtanje).',
    group: {
      sl: 'Ceniki',
      de: 'Preislisten',
      en: 'Price Lists',
    }, // Group related collections in admin UI

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
      label: 'Ime Sekcije',
      required: true,
      
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis Sekcije (Neobvezno)',
      
    },
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Vrstni red prikaza',
      admin: {
        description: 'Nižja številka pomeni prikaz višje na seznamu.',
        step: 1,
      },
    },
  ],
}; 