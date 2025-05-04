import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { GlobalConfig, Access, FieldHook } from 'payload';

// Define access control - allowing anyone to read, admin to update
const anyone: Access = () => true;


// Available icons for dropdown items based on desktop-navbar.tsx
// These are now managed within the Menus collection
// const iconOptions = [
//   { label: 'Sparkles', value: 'Sparkles' },
//   { label: 'Zap', value: 'Zap' },
//   { label: 'Droplet (Drop)', value: 'Drop' },
//   { label: 'Hand (Hands)', value: 'Hands' },
//   { label: 'Footprints', value: 'Footprints' },
//   { label: 'Paintbrush', value: 'Paintbrush' },
// ];

// Define a type for the sibling data in navItems for better type safety
// This logic is now part of the Menus collection
// type NavItemSiblingData = {
//   hasChildren?: boolean;
//   // other fields if needed for condition logic
// };



export const Navbar: GlobalConfig = {
  slug: 'navbar',
  label: 'Navigacija',
  access: {
    read: anyone,
    update: superAdminOrTenantAdminAccess,
  },
  admin:{
    description: 'Navigacija',
    group: 'Konfiguracija',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Naslov (Interni)',
      required: false,
      admin: {
          description: 'Interni naslov za identifikacijo te globalne nastavitve navigacije (neobvezno).'
      }
    },
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
    // --- Main CTA Button ---
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
}; 