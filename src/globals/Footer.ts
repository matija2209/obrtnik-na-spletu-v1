import { GlobalConfig, Access, Block } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { Menus } from '../collections/Menus'; // Import Menus to ensure relationTo works

// Define access control - allowing anyone to read, admin to update
const anyone: Access = () => true;

// Define the Menu Section Block
const MenuSectionBlock: Block = {
  slug: 'menuSection',
  interfaceName: 'MenuSectionItem', // Payload interface name
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

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Noga strani',
  access: {
    read: anyone,
    update: superAdminOrTenantAdminAccess,
  },
  admin:{
    description: 'Podatki o podjetju',
    group: 'Konfiguracija',
    
  },
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
      name: 'menuSections',
      label: 'Sekcije Menijev v Nogi',
      type: 'blocks',
      minRows: 0,
      maxRows: 4,
      blocks: [MenuSectionBlock],
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
    {
      name: 'showContactInFooter',
      type: 'checkbox',
      label: 'Prikaži kontaktne podatke v nogi',
      defaultValue: true,
    },
  ],
};

export default Footer; 