import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import type { CollectionConfig, Access } from 'payload';

const anyone: Access = () => true;

export const PriceListSections: CollectionConfig = {
  slug: 'price-list-sections',
  labels: {
    singular: 'Sekcija Cenika',
    plural: 'Sekcije Cenikov',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'displayOrder', 'updatedAt'],
    description: 'Kategorije ali sekcije znotraj cenika (npr. Predjedi, Vrtanje).',
    group: 'Ceniki', // Group related collections in admin UI
    hidden: true, // Typically managed via Pricelist collection
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
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis Sekcije (Neobvezno)',
      localized: true,
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