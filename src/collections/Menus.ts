import { slugField } from '@/fields/slug';
import { superAdminOrTenantAdminAccess } from '../access/superAdminOrTenantAdmin';


import { Access, CollectionConfig, FieldHook } from 'payload';
import iconField from '@/fields/iconsField';

// Define access control - allowing anyone to read, admin to create/update/delete
const anyone: Access = () => true;

// Available icons for dropdown items (reusing from Navbar definition)


// Define a type for the sibling data in menuItems for better type safety
type MenuItemSiblingData = {
  hasChildren?: boolean;
  // other fields if needed for condition logic
};

export const Menus: CollectionConfig = {
  slug: 'menus',
  labels: {
    singular: {
      en: 'Menu',
      sl: 'Meni',
      de: 'Menü',
    },
    plural: {
      en: 'Menus',
      sl: 'Meniji',
      de: 'Menüs',
    },
  },
  admin: {
    useAsTitle: 'title',
    hidden: true,
    description: {
      sl: 'Upravljajte navigacijske menije za uporabo v glavi, nogi ali drugje.',
      de: 'Verwalten Sie Navigationsmenüs für Verwendung in Kopf, Fuß oder anderswo.',
      en: 'Manage navigation menus for use in header, footer or elsewhere.',
    },
  
    group: {
      sl: 'Struktura',
      de: 'Struktur',
      en: 'Structure',
    }, // Grouping in admin UI
  },
  access: {
    read: anyone, // Anyone can read menus (needed for frontend)
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    slugField('title', {
      label: {
        sl: 'Pot / Unikatni ID',
        de: 'Pfad / Eindeutige ID',
        en: 'Path / Unique ID',
      },
      unique: true,
      index: true,
      admin: {
        description: {
          sl: 'ID se generira samodejno iz naslova.',
          de: 'ID wird automatisch aus dem Titel generiert.',
          en: 'ID is generated automatically from the title.',
        },
        readOnly: false,
        position: 'sidebar',
      }
    }),
    {
      name: 'title',
      type: 'text',
      label: {
        sl: 'Ime menija (za administracijo)',
        de: 'Menüname (für Administration)',
        en: 'Menu Name (for Administration)',
      },
      required: true,
      admin: {
        position:"sidebar",
        description: {
          sl: 'Interno ime za lažje prepoznavanje menija (npr. Glavni meni, Meni za nogo).',
          de: 'Interner Name für einfachere Identifizierung des Menüs (z.B. Hauptmenü, Fußmenü).',
          en: 'Internal name for easier menu identification (e.g. Main Menu, Footer Menu).',
        },
      },
    },

    {
      name: 'menuItems',
      label: {
        sl: 'Elementi menija',
        de: 'Menüelemente',
        en: 'Menu Items',
      },
      type: 'array',
      minRows: 1,
      labels: {
          singular: {
          sl: 'Element menija',
          de: 'Menüelement',
          en: 'Menu Item',
        },
        plural: {
          sl: 'Elementi menija',
          de: 'Menüelemente',
          en: 'Menu Items',
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: {
            sl: 'Naslov',
            de: 'Titel',
            en: 'Title',
          },
          required: true,
          
        },
        {
          name: 'hasChildren',
          type: 'checkbox',
          label: {
            sl: 'Ima spustni meni?',
            de: 'Hat ein Dropdown-Menü?',
            en: 'Has a dropdown menu?',
          },
          defaultValue: false,
        },
        // Conditionally shown fields for parent items
        {
          name: 'href',
          type: 'text',
          label: {
            sl: 'Povezava (za elemente brez spustnega menija)',
            de: 'Link (für Elemente ohne Dropdown-Menü)',
            en: 'Link (for elements without dropdown menu)',
          },
          required: true,
          admin: {
            condition: (_: any, siblingData: MenuItemSiblingData) => !(siblingData.hasChildren ?? false),
            description: {
              sl: 'Vnesite ciljno pot, npr. /o-nas ali #kontakt.',
              de: 'Geben Sie die Ziel-Pfad ein, z.B. /o-nas oder #kontakt.',
              en: 'Enter the target path, e.g. /o-nas or #contact.',
            },
          },
        },
        // Conditionally shown fields for dropdown items
        {
          name: 'children',
          type: 'array',
          label: {
            sl: 'Elementi spustnega menija',
            de: 'Dropdown-Menüelemente',
            en: 'Dropdown Menu Items',
          },
          minRows: 1,
          admin: {
            condition: (_: any, siblingData: MenuItemSiblingData) => siblingData.hasChildren ?? false,
            description: {
              sl: 'Dodajte elemente za spustni meni.',
              de: 'Fügen Sie Elemente für das Dropdown-Menü hinzu.',
              en: 'Add elements for the dropdown menu.',
            },
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: {
                sl: 'Naslov elementa',
                de: 'Element-Titel',
                en: 'Element Title',
              },
              required: true,
              
            },
            {
              name: 'href',
              type: 'text',
                label: {
                sl: 'Povezava elementa',
                de: 'Element-Link',
                en: 'Element Link',
              },
              required: true,
               admin: {
                 description: {
                  sl: 'Vnesite ciljno pot, npr. /storitve/rezanje-betona.',
                  de: 'Geben Sie die Ziel-Pfad ein, z.B. /storitve/rezanje-betona.',
                  en: 'Enter the target path, e.g. /services/rezanje-betona.',
                 },
               }
            },
            {
              name: 'description',
              type: 'textarea',
              label: {
                sl: 'Opis elementa',
                de: 'Element-Beschreibung',
                en: 'Element Description',
              },
              required: false,
              
              admin: {
                description: {
                  sl: 'Kratek opis, ki se prikaže v spustnem meniju (neobvezno).',
                  de: 'Kurze Beschreibung, die im Dropdown-Menü angezeigt wird (optional).',
                  en: 'Short description that appears in the dropdown menu (optional).',
                },
              }
            },
            iconField()
          ],
        },
      ],
    },
  ],
}; 