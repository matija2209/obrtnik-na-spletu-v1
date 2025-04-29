import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { GlobalConfig, Access, CollectionSlug } from 'payload';

// import { Testimonials } from '../collections/Testimonials'; // No longer needed for slug
// import { FaqItems } from '../collections/FaqItems'; // No longer needed for slug
// import { Services } from '../collections/Services'; // No longer needed for slug

// Define access control - allowing anyone to read, admin to update
const anyone: Access = () => true;


export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Vsebina domače strani',
  access: {
    read: anyone,
    update: superAdminOrTenantAdminAccess, // Only admins can update home page settings
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // --- Hero Section Tab ---
        {
          label: 'Naslovna',
          fields: [
            {
              name: 'heroTitle',
              type: 'text',
              label: 'Naslov',
              required: true,
              localized: true,
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              label: 'Podnaslov',
              localized: true,
            },
            {
              name: 'heroCtas',
              type: 'relationship',
              relationTo: 'ctas' as CollectionSlug,
              hasMany: true,
              required: false,
              label: 'CTA gumbe',
              minRows: 0,
              maxRows: 2,
              admin: {
                description: 'Izberite CTA gumbe za naslovno sekcijo. Vrstni red je pomemben.',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Slika ozadja',
            },
            {
              name: 'heroFeatures',
              type: 'array',
              required:false,
              label: 'Značilnosti',
              fields: [
                {
                  name: 'iconText',
                  type: 'text',
                  label: 'Ikona ali besedilo (npr. 10+, ✓)',
                },
                {
                  name: 'text',
                  type: 'text',
                  label: 'Besedilo značilnosti',
                  required: true,
                  localized: true,
                }
              ]
            },
          ]
        },
        // --- Services Section Tab ---
        {
          label: 'Storitve',
          fields: [
            {
              name: 'servicesTitle',
              type: 'text',
              label: 'Naslov sekcije storitev',
              required: true,
              localized: true,
            },
            {
              name: 'servicesDescription',
              type: 'textarea',
              label: 'Opis sekcije storitev',
              localized: true,
            },
            {
              name: 'selectedServices',
              type: 'relationship',
              relationTo: 'services' as CollectionSlug, // Use string literal
              hasMany: true,
              label: 'Izbrane storitve',
              admin: {
                description: 'Izberite storitve, ki se prikažejo na domači strani. Vrstni red je pomemben.',
              },
            }
          ]
        },
        // --- Machinery Section Tab ---
        {
          label: 'Strojni park',
          fields: [
            {
              name: 'machineryTitle',
              type: 'text',
              label: 'Naslov sekcije strojnega parka',
              required: true,
              localized: true,
              defaultValue: 'Naš Vozni Park'
            },
            {
              name: 'machineryDescription',
              type: 'textarea',
              label: 'Opis sekcije strojnega parka (neobvezno)',
              localized: true,
              defaultValue: 'Ponudba gradbene mehanizacije za najem'
            },
            {
              name: 'selectedMachinery',
              type: 'relationship',
              relationTo: 'machinery',
              hasMany: true,
              label: 'Izbrani stroji za prikaz',
              admin: {
                description: 'Izberite stroje, ki se prikažejo na domači strani. Vrstni red je pomemben.',
              },
            }
          ]
        },
        // --- Product Highlights Tab ---
        {
          label: 'Projekti',
          fields: [
            {
              name: 'projectHighlightsTitle',
              type: 'text',
              label: 'Naslov sekcije projektov',
              required: true,
              localized: true,
            },
            {
              name: 'projectHighlightsDescription',
              type: 'textarea',
              label: 'Opis sekcije projektov',
              localized: true,
            },
            {
              name: 'projectHighlightsButtonText',
              type: 'text',
              label: 'Besedilo gumba (npr. Vsi projekti)',
              localized: true,
            },
            {
              name: 'projectHighlightsButtonHref',
              type: 'text',
              label: 'Povezava gumba (npr. /projekti)',
              defaultValue: '/projekti',
            },
            {
              name: 'highlightedProjects',
              type: 'relationship',
              relationTo: 'projects', // Keep as string if Projects collection isn't imported
              hasMany: true,
              label: 'Poudarjeni projekti',
              admin: {
                description: 'Izberite projekte, ki se prikažejo na domači strani. Priporočljivo 3-4 projekte.',
              },
            },
          ]
        },
         // --- About Me Section Tab ---
        {
          label: 'O nas',
          fields: [
            {
              name: 'aboutTitle',
              type: 'text',
              label: 'Naslov sekcije o nas',
              required: true,
              localized: true,
            },
            {
              name: 'aboutDescription',
              type: 'textarea',
              label: 'Opis sekcije o nas',
              required: true,
              localized: true,
            },
            {
              name: 'aboutImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slika sekcije o nas'
            },
            {
              name: 'aboutBenefits',
              type: 'array',
              label: 'Seznam prednosti',
              fields: [
                  {
                  name: 'benefitId',
                  type: 'text',
                  label: 'Unikatni ID (npr. certificirani)',
                  required: true,
                   admin: {
                     description: 'Interni ID, mora biti unikaten.'
                  }
                },
                 {
                  name: 'title',
                  type: 'text',
                  required: true,
                  localized: true,
                },
                 {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  localized: true,
                },
              ]
            },
            {
              name: 'aboutCta',
              type: 'relationship',
              relationTo: 'ctas' as CollectionSlug,
              hasMany: false,
              label: 'CTA gumb',
              required: false,
              admin: {
                description: 'Izberite CTA gumb za sekcijo O nas (neobvezno).',
              },
            }
          ]
        },
         // --- Testimonials Section Tab ---
        {
          label: 'Mnenja strank',
          fields: [
            {
              name: 'testimonialsTitle',
              type: 'text',
              label: 'Naslov sekcije mnenj',
              required: true,
              localized: true,
            },
            {
              name: 'selectedTestimonials',
              type: 'relationship',
              relationTo: 'testimonials',// Use string literal
              hasMany: true,
              label: 'Izbor mnenj za prikaz',
               filterOptions: () => {
                  return {
                    // status: { equals: 'published' },
                  };
                },
              admin: {
                description: 'Izberite mnenja, ki se prikažejo na domači strani. Vrstni red je pomemben.',
              },
            },
            {
              name: 'testimonialsCta',
              type: 'relationship',
              relationTo: 'ctas', // Reference the Ctas collection slug
              hasMany: false,
              required: false,
              label: 'CTA gumb sekcije mnenj',
              admin: {
                description: 'Izberite CTA gumb za sekcijo Mnenja strank (neobvezno).',
              },
            }
          ]
        },
         // --- Gallery Section Tab ---
        {
          label: 'Galerija',
          fields: [
             {
              name: 'galleryTitle',
              type: 'text',
              label: 'Naslov sekcije galerije',
              required: true,
              localized: true,
            },
            {
              name: 'galleryDescription',
              type: 'textarea',
              label: 'Opis sekcije galerije',
              localized: true,
            },
            {
              name: 'galleryButtonText',
              type: 'text',
              label: 'Besedilo gumba galerije',
              localized: true,
            },
            {
              name: 'galleryButtonHref',
              type: 'text',
              label: 'Povezava gumba galerije',
              defaultValue: '/galerija',
            },
            {
              name: 'galleryImages',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              label: 'Izbor slik za galerijo',
              admin: {
                description: 'Izberite slike iz medijske knjižnice, ki se prikažejo v galeriji na domači strani. Vrstni red je pomemben.',
                allowCreate: true,
              }
            }
          ]
        },
        // --- Service Area Section Tab ---
        {
          label: 'Območje storitev',
          fields: [
            {
              name: 'serviceAreaTitle',
              type: 'text',
              label: 'Naslov območja storitev',
              required: true,
              localized: true,
            },
            {
              name: 'serviceAreaDescription',
              type: 'textarea',
              label: 'Opis območja storitev (uporabite ** za krepko)',
              required: true,
              localized: true,
            },
            {
              name: 'serviceAreaMapImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slika zemljevida'
            },
            {
              name: 'serviceAreaLocations',
              type: 'array',
              label: 'Seznam lokacij storitev',
              fields: [
                 {
                  name: 'name',
                  type: 'text',
                  required: true,
                  localized: true, 
                  label: 'Ime lokacije'
                },
              ]
            },
             {
              name: 'serviceAreaAdditionalInfo',
              type: 'textarea',
              label: 'Dodatne informacije (uporabite ** za krepko)',
              localized: true,
            },
          ]
        },
         // --- Contact Section Tab ---
        {
          label: 'Kontakt',
          fields: [
            {
              name: 'contactTitle',
              type: 'text',
              label: 'Naslov kontaktne sekcije',
              required: true,
              localized: true,
            },
            {
              name: 'contactDescription',
              type: 'textarea',
              label: 'Opis kontaktne sekcije',
              localized: true,
            },
            {
              name: 'contactWorkingHours',
              type: 'array',
              label: 'Delovni čas',
              fields: [
                {
                  name: 'day',
                  type: 'text',
                  required: true,
                  label: 'Dan v tednu'
                },
                {
                  name: 'hours',
                  type: 'text',
                  required: true,
                  label: 'Ure (npr. 09:00 - 18:00 ali Zaprto)'
                }
              ]
            },
            {
              name: 'contactPhoneNumber',
              type: 'text',
              required: true,
              label: 'Kontaktna telefonska številka'
            },
            {
              name: 'contactAddress',
              type: 'text',
              required: true,
              label: 'Kontaktni naslov'
            }
          ]
        },
        // --- FAQ Section Tab ---
        {
          label: 'Pogosta vprašanja',
          fields: [
            {
              name: 'faqTitle',
              type: 'text',
              label: 'Naslov FAQ',
              required: true,
              localized: true,
            },
            {
              name: 'faqDescription',
              type: 'textarea',
              label: 'Opis FAQ sekcije',
              localized: true,
            },
             {
              name: 'faqDefaultOpenItem', 
              type: 'relationship',
              relationTo: 'faq-items', // Use string literal
              label: 'Privzeto odprto FAQ vprašanje (neobvezno)',
            },
             {
              name: 'selectedFaqItems',
              type: 'relationship',
              relationTo: 'faq-items', // Use string literal
              hasMany: true,
              required: true, 
              label: 'Izbor FAQ za prikaz',
              admin: {
                description: 'Izberite pogosta vprašanja, ki se prikažejo na domači strani. Vrstni red je pomemben.',
              },
            }
          ]
        },
      ]
    }
  ],
}; 