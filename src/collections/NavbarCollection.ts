import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import type { CollectionConfig } from 'payload';

export const NavbarCollection: CollectionConfig = {
  slug: 'navbar', // Using the same slug
  labels: {
    singular: 'Navigacija',
    plural: 'Navigacija',
  },
  access: {
    create: superAdminOrTenantAdminAccess,
    read: superAdminOrTenantAdminAccess, // Changed from anyone to tenant-specific
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  admin: {
    description: 'Nastavitve navigacijske vrstice za vsakega najemnika.',
    group: 'Struktura', // Keeping original group

  },
  fields: [
   
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Splošne nastavitve',
          fields: [
            {
              name: 'showLogoImage',
              type: 'checkbox',
              label: 'Prikaži sliko logotipa?',
              defaultValue: true,
              admin: {
                description: 'Ali naj se v navigaciji prikaže slika logotipa?',
              },
            },
            {
              name: 'showLogoText',
              type: 'checkbox',
              label: 'Prikaži besedilo logotipa?',
              defaultValue: true,
              admin: {
                description: 'Ali naj se v navigaciji prikaže besedilni naslov (če je logotip onemogočen ali ni naložen)?',
              },
            },
            {
              name: 'isTransparent',
              type: 'checkbox',
              label: 'Prosojna navigacija?',
              defaultValue: false,
              admin: {
                description: 'Ali naj bo ozadje navigacije prozorno (običajno na vrhu strani)?',
              },
            },
            {
              name: 'isFixed',
              type: 'checkbox',
              label: 'Fiksna navigacija?',
              defaultValue: true,
              admin: {
                description: 'Ali naj bo navigacija pripeta na vrh zaslona med drsenjem?',
              },
            },
          ],
        },
        {
          label: 'Meni in CTA',
          fields: [
            {
                name: 'mainMenu',
                label: 'Glavni Meni',
                type: 'relationship',
                relationTo: 'menus',
                required: true,
                admin: {
                  description: 'Izberite meni, ki bo uporabljen za glavno navigacijo.',
                }
            },
            {
                name: 'mainCta',
                label: 'Glavni CTA Gumb (v navigaciji)',
                type: 'relationship',
                relationTo: 'ctas',
                required: false,
                admin: {
                  description: 'Izberite CTA gumb, ki bo prikazan v navigaciji.',
                }
            }
          ],
        },
      ],
    },
  ],
}; 