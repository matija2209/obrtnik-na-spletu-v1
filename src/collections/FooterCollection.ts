import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import type { CollectionConfig, Block } from 'payload';

// Define the Menu Section Block (moved from the old global)
const MenuSectionBlock: Block = {
  slug: 'menuSection',
  interfaceName: 'MenuSectionItem',
  labels: {
    singular: 'Sekcija Menija',
    plural: 'Sekcije Menijev',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Naslov Sekcije (neobvezno)',
      localized: true,
      required: false,
    },
    {
      name: 'menu',
      label: 'Izberi Meni',
      type: 'relationship',
      relationTo: 'menus',
      required: true,
    },
  ],
};

export const FooterCollection: CollectionConfig = {
  slug: 'footer', // Using the same slug
  labels: {
    singular: 'Noga',
    plural: 'Noga',
  },
  access: {
    create: superAdminOrTenantAdminAccess,
    read: superAdminOrTenantAdminAccess, // Changed from anyone to tenant-specific
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  admin: {
    description: 'Nastavitve podnožja strani za vsakega najemnika.',
    group: 'Struktura',

  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General Settings',
          fields: [
            {
              name: 'copyrightText',
              type: 'text',
              label: 'Besedilo avtorskih pravic',
              admin: {
                description: 'Besedilo avtorskih pravic, ki bo prikazano na dnu noge. Uporabite {{year}} za dinamično leto.',
              },
              defaultValue: '© {{year}} Vse pravice pridržane.',
            },
            {
              name: 'showLogoText',
              type: 'checkbox',
              label: 'Prikaži besedilo logotipa v nogi?',
              defaultValue: true,
              admin: {
                description: 'Ali naj se v nogi prikaže besedilni naslov?',
              },
            },
            {
              name: 'showContactInFooter',
              type: 'checkbox',
              label: 'Prikaži kontaktne podatke v nogi',
              defaultValue: true,
            },
          ],
        },
        {
          label: 'Meniji',
          fields: [
            {
              name: 'menuSections',
              label: 'Sekcije Menijev v Nogi',
              type: 'blocks',
              minRows: 0,
              maxRows: 4,
              blocks: [MenuSectionBlock], // Use the block defined above
              admin: {
                description: 'Dodajte eno ali več sekcij menijev, ki bodo prikazane v nogi.',
              }
            },
            {
              name: 'socialMenu',
              label: 'Meni za Družabna Omrežja',
              type: 'relationship',
              relationTo: 'menus',
              required: false,
              admin: {
                description: 'Izberite meni, ki vsebuje povezave do družabnih omrežij (neobvezno). Ustvarite nov meni v sekciji "Meniji", če ga še nimate.',
              }
            },
          ],
        },
      ],
    },
  ],
}; 