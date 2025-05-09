import { superAdminOrTenantAdminAccess } from '../access/superAdminOrTenantAdmin';


import { Access, CollectionConfig, FieldHook } from 'payload';

// Define access control - allowing anyone to read, admin to create/update/delete
const anyone: Access = () => true;

// Available icons for dropdown items (reusing from Navbar definition)
const iconOptions = [
  { label: 'Sparkles', value: 'Sparkles' },
  { label: 'Zap', value: 'Zap' },
  { label: 'Droplet (Drop)', value: 'Drop' },
  { label: 'Hand (Hands)', value: 'Hands' },
  { label: 'Footprints', value: 'Footprints' },
  { label: 'Paintbrush', value: 'Paintbrush' },
];

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
  access: {
    read: anyone, // Anyone can read menus (needed for frontend)
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Ime menija (za administracijo)',
      required: true,
      admin: {
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
              required: true, // Making description optional for flexibility
              localized: true,
              admin: {
                description: 'Kratek opis, ki se prikaže v spustnem meniju (neobvezno).',
              }
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Ikona elementa (neobvezno)',
              options: iconOptions,
              admin: {
                description: 'Izberite ikono, ki se prikaže ob elementu v spustnem meniju.',
              }
            },
          ],
        },
      ],
    },
  ],
}; 