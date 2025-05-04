import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import type { CollectionConfig, Access } from 'payload';

const anyone: Access = () => true;

export const Pricelists: CollectionConfig = {
  slug: 'pricelists',
  labels: {
    singular: 'Cenik',
    plural: 'Ceniki',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    description: 'Upravljajte cenike za storitve ali izdelke.',
    group: 'Prodaja',
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
      label: 'Ime cenika',
      required: true,
      localized: true,
      admin: {
        description: 'Ime za celoten cenik (npr. Cenik Kosil, Cenik Vrtalnih Storitev 2024).',
      },
    },
    {
      name: 'priceListType',
      type: 'select',
      label: 'Tip Cenika',
      options: [
        { label: 'Gastronomija (Meni, Pijača)', value: 'gastronomy' },
        { label: 'Storitve', value: 'service' },
        { label: 'Drugo', value: 'other' }
      ],
      required: true,
      defaultValue: 'service',
      admin: {
        position: 'sidebar',
        description: 'Izberite tip cenika za lažjo organizacijo in prikaz.'
      }
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Uvodni Opis (Neobvezno)',
      localized: true,
      admin: {
        description: 'Opis, ki se prikaže na vrhu tega specifičnega cenika.'
      }
    },
    {
      name: 'sections',
      label: 'Sekcije v tem ceniku',
      type: 'relationship',
      relationTo: 'price-list-sections',
      hasMany: true,
      required: true,
      admin: {
        description: 'Izberite in uredite vrstni red sekcij, ki bodo vključene v ta cenik.'
      }
    },
    {
      name: 'callToAction',
      label: 'Call to Action na koncu (Neobvezno)',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false,
      required: false,
      admin: {
        description: 'Dodajte gumb \'call to action\' na dno cenika.'
      }
    },
  ],
}; 