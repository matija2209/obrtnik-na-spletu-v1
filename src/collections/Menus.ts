import { slugField } from '@/fields/slug';
import { superAdminOrTenantAdminAccess } from '../access/superAdminOrTenantAdmin';


import { Access, CollectionAfterChangeHook, CollectionConfig, FieldHook } from 'payload';
import iconField from '@/fields/iconsField';
import { revalidateTag } from 'next/cache';
import { TAGS } from '@/lib/payload/cache-keys';

// Define access control - allowing anyone to read, admin to create/update/delete
const anyone: Access = () => true;

// Available icons for dropdown items (reusing from Navbar definition)


const revalidateMenusCache: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation
}) => {
  revalidateTag(TAGS.FOOTER)
  revalidateTag(TAGS.NAVBAR)
}

// Define a type for the sibling data in menuItems for better type safety
type MenuItemSiblingData = {
  hasChildren?: boolean;
  // other fields if needed for condition logic
};

export const Menus: CollectionConfig = {
  slug: 'menus',
  labels: {
    singular: 'Meni',
    plural: 'Meniji',
  },
  admin: {
    useAsTitle: 'title',
    description: 'Upravljajte navigacijske menije za uporabo v glavi, nogi ali drugje.',
  
    group: 'Struktura', // Grouping in admin UI
  },
  hooks:{
    afterChange:[revalidateMenusCache],
  },
  access: {
    read: anyone, // Anyone can read menus (needed for frontend)
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    slugField('title', {
      label: 'Pot / Unikatni ID',
      unique: true,
      index: true,
      admin: {
        description: 'ID se generira samodejno iz naslova.',
        readOnly: false,
        position: 'sidebar',
      }
    }),
    {
      name: 'title',
      type: 'text',
      label: 'Ime menija (za administracijo)',
      required: true,
      admin: {
        position:"sidebar",
        description: 'Interno ime za lažje prepoznavanje menija (npr. Glavni meni, Meni za nogo).',
      },
    },

    {
      name: 'menuItems',
      label: 'Elementi menija',
      type: 'array',
      minRows: 1,
      labels: {
        singular: 'Element menija',
        plural: 'Elementi menija',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Naslov',
          required: true,
          localized: true,
        },
        {
          name: 'hasChildren',
          type: 'checkbox',
          label: 'Ima spustni meni?',
          defaultValue: false,
        },
        // Conditionally shown fields for parent items
        {
          name: 'href',
          type: 'text',
          label: 'Povezava (za elemente brez spustnega menija)',
          required: true,
          admin: {
            condition: (_: any, siblingData: MenuItemSiblingData) => !(siblingData.hasChildren ?? false),
            description: 'Vnesite ciljno pot, npr. /o-nas ali #kontakt.',
          },
        },
        // Conditionally shown fields for dropdown items
        {
          name: 'children',
          type: 'array',
          label: 'Elementi spustnega menija',
          minRows: 1,
          admin: {
            condition: (_: any, siblingData: MenuItemSiblingData) => siblingData.hasChildren ?? false,
            description: 'Dodajte elemente za spustni meni.',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Naslov elementa',
              required: true,
              localized: true,
            },
            {
              name: 'href',
              type: 'text',
              label: 'Povezava elementa',
              required: true,
               admin: {
                 description: 'Vnesite ciljno pot, npr. /storitve/rezanje-betona.',
               }
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Opis elementa',
              required: false,
              localized: true,
              admin: {
                description: 'Kratek opis, ki se prikaže v spustnem meniju (neobvezno).',
              }
            },
            iconField()
          ],
        },
      ],
    },
  ],
}; 