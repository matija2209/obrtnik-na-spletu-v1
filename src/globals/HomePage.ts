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
              name: 'heroHideSection',
              label: 'Skrij sekcijo',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Če je označeno, ta sekcija ne bo prikazana na spletni strani.',
                width: '30%',
              }
            },
            {
              name: 'heroTitle',
              type: 'text',
              label: 'Naslov',
              required: false,
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.heroHideSection,
              },
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              label: 'Podnaslov',
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.heroHideSection,
              },
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
                condition: (data, siblingData) => !siblingData?.heroHideSection,
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Slika ozadja',
              required: false,
              admin: {
                condition: (data, siblingData) => !siblingData?.heroHideSection,
              },
            },
            {
              name: 'heroFeatures',
              type: 'array',
              required:false,
              label: 'Značilnosti',
              admin: {
                condition: (data, siblingData) => !siblingData?.heroHideSection,
              },
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
                  required: false,
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
              name: 'servicesHideSection',
              label: 'Skrij sekcijo',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Če je označeno, ta sekcija ne bo prikazana na spletni strani.',
                width: '30%',
              }
            },
            {
              name: 'servicesTitle',
              type: 'text',
              label: 'Naslov sekcije storitev',
              required: false,
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.servicesHideSection,
              },
            },
            {
              name: 'servicesDescription',
              type: 'textarea',
              label: 'Opis sekcije storitev',
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.servicesHideSection,
              },
            },
            {
              name: 'selectedServices',
              type: 'relationship',
              relationTo: 'services' as CollectionSlug, // Use string literal
              hasMany: true,
              label: 'Izbrane storitve',
              required: false,
              admin: {
                description: 'Izberite storitve, ki se prikažejo na domači strani. Vrstni red je pomemben.',
                condition: (data, siblingData) => !siblingData?.servicesHideSection,
              },
            },
            {
              name: 'servicesCta',
              type: 'relationship',
              relationTo: 'ctas' as CollectionSlug,
              hasMany: false,
              required: false,
              label: 'CTA gumb sekcije storitev',
              admin: {
                description: 'Izberite CTA gumb za sekcijo Storitve (neobvezno).',
                condition: (data, siblingData) => !siblingData?.servicesHideSection,
              },
            }
          ]
        },
        // --- Machinery Section Tab ---
        {
          label: 'Strojni park',
          fields: [
            {
              name: 'machineryHideSection',
              label: 'Skrij sekcijo',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Če je označeno, ta sekcija ne bo prikazana na spletni strani.',
                width: '30%',
              }
            },
            {
              name: 'machineryTitle',
              type: 'text',
              label: 'Naslov sekcije strojnega parka',
              required: false,
              localized: true,
              defaultValue: 'Naš Vozni Park',
              admin: {
                condition: (data, siblingData) => !siblingData?.machineryHideSection,
              },
            },
            {
              name: 'machineryDescription',
              type: 'textarea',
              label: 'Opis sekcije strojnega parka (neobvezno)',
              localized: true,
              defaultValue: 'Ponudba gradbene mehanizacije za najem',
              admin: {
                condition: (data, siblingData) => !siblingData?.machineryHideSection,
              },
            },
            {
              name: 'selectedMachinery',
              type: 'relationship',
              relationTo: 'machinery',
              hasMany: true,
              label: 'Izbrani stroji za prikaz',
              required: false,
              admin: {
                description: 'Izberite stroje, ki se prikažejo na domači strani. Vrstni red je pomemben.',
                condition: (data, siblingData) => !siblingData?.machineryHideSection,
              },
            }
          ]
        },
        // --- Product Highlights Tab ---
        {
          label: 'Projekti',
          fields: [
            {
              name: 'projectsHideSection',
              label: 'Skrij sekcijo',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Če je označeno, ta sekcija ne bo prikazana na spletni strani.',
                width: '30%',
              }
            },
            {
              name: 'projectHighlightsTitle',
              type: 'text',
              label: 'Naslov sekcije projektov',
              required: false,
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.projectsHideSection,
              },
            },
            {
              name: 'projectHighlightsDescription',
              type: 'textarea',
              label: 'Opis sekcije projektov',
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.projectsHideSection,
              },
            },
            {
              name: 'projectHighlightsButtonText',
              type: 'text',
              label: 'Besedilo gumba (npr. Vsi projekti)',
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.projectsHideSection,
              },
            },
            {
              name: 'projectHighlightsButtonHref',
              type: 'text',
              label: 'Povezava gumba (npr. /projekti)',
              defaultValue: '/projekti',
              admin: {
                condition: (data, siblingData) => !siblingData?.projectsHideSection,
              },
            },
            {
              name: 'highlightedProjects',
              type: 'relationship',
              relationTo: 'projects', // Keep as string if Projects collection isn't imported
              hasMany: true,
              label: 'Poudarjeni projekti',
              required: false,
              admin: {
                description: 'Izberite projekte, ki se prikažejo na domači strani. Priporočljivo 3-4 projekte.',
                condition: (data, siblingData) => !siblingData?.projectsHideSection,
              },
            },
          ]
        },
         // --- About Me Section Tab ---
        {
          label: 'O nas',
          fields: [
            {
              name: 'aboutHideSection',
              label: 'Skrij sekcijo',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Če je označeno, ta sekcija ne bo prikazana na spletni strani.',
                width: '30%',
              }
            },
            {
              name: 'aboutTitle',
              type: 'text',
              label: 'Naslov sekcije o nas',
              required: false,
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.aboutHideSection,
              },
            },
            {
              name: 'aboutDescription',
              type: 'textarea',
              label: 'Opis sekcije o nas',
              required: false,
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.aboutHideSection,
              },
            },
            {
              name: 'aboutImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: 'Slika sekcije o nas',
              admin: {
                condition: (data, siblingData) => !siblingData?.aboutHideSection,
              },
            },
            {
              name: 'aboutBenefits',
              type: 'array',
              label: 'Seznam prednosti',
              admin: {
                condition: (data, siblingData) => !siblingData?.aboutHideSection,
              },
              fields: [
                  {
                  name: 'benefitId',
                  type: 'text',
                  label: 'Unikatni ID (npr. certificirani)',
                  required: false,
                   admin: {
                     description: 'Interni ID, mora biti unikaten.'
                  }
                },
                 {
                  name: 'title',
                  type: 'text',
                  required: false,
                  localized: true,
                },
                 {
                  name: 'description',
                  type: 'textarea',
                  required: false,
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
                condition: (data, siblingData) => !siblingData?.aboutHideSection,
              },
            }
          ]
        },
         // --- Testimonials Section Tab ---
        {
          label: 'Mnenja strank',
          fields: [
            {
              name: 'testimonialsHideSection',
              label: 'Skrij sekcijo',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Če je označeno, ta sekcija ne bo prikazana na spletni strani.',
                width: '30%',
              }
            },
            {
              name: 'testimonialsTitle',
              type: 'text',
              label: 'Naslov sekcije mnenj',
              required: false,
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.testimonialsHideSection,
              },
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
                condition: (data, siblingData) => !siblingData?.testimonialsHideSection,
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
                condition: (data, siblingData) => !siblingData?.testimonialsHideSection,
              },
            }
          ]
        },
         // --- Gallery Section Tab ---
        {
          label: 'Galerija',
          fields: [
             {
              name: 'galleryHideSection',
              label: 'Skrij sekcijo',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Če je označeno, ta sekcija ne bo prikazana na spletni strani.',
                width: '30%',
              }
            },
            {
              name: 'galleryTitle',
              type: 'text',
              label: 'Naslov sekcije galerije',
              required: false,
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.galleryHideSection,
              },
            },
            {
              name: 'galleryDescription',
              type: 'textarea',
              label: 'Opis sekcije galerije',
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.galleryHideSection,
              },
            },
            {
              name: 'galleryButtonText',
              type: 'text',
              label: 'Besedilo gumba galerije',
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.galleryHideSection,
              },
            },
            {
              name: 'galleryCta',
              type: 'relationship',
              relationTo: 'ctas' as CollectionSlug,
              hasMany: false,
              required: false,
              label: 'CTA gumb galerije',
              admin: {
                description: 'Izberite CTA gumb za galerijo (neobvezno).',
                 condition: (data, siblingData) => !siblingData?.galleryHideSection,
              },
            },
            {
              name: 'galleryImages',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              label: 'Izbor slik za galerijo',
              required: false,
              admin: {
                description: 'Izberite slike iz medijske knjižnice, ki se prikažejo v galeriji na domači strani. Vrstni red je pomemben.',
                allowCreate: true,
                condition: (data, siblingData) => !siblingData?.galleryHideSection,
              }
            }
          ]
        },
        // --- Service Area Section Tab ---
        {
          label: 'Območje storitev',
          fields: [
            {
              name: 'serviceAreaHideSection',
              label: 'Skrij sekcijo',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Če je označeno, ta sekcija ne bo prikazana na spletni strani.',
                width: '30%',
              }
            },
            {
              name: 'serviceAreaTitle',
              type: 'text',
              label: 'Naslov območja storitev',
              required: false,
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.serviceAreaHideSection,
              },
            },
            {
              name: 'serviceAreaDescription',
              type: 'textarea',
              label: 'Opis območja storitev (uporabite ** za krepko)',
              required: false,
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.serviceAreaHideSection,
              },
            },
            {
              name: 'showMap',
              type: 'checkbox',
              label: 'Prikaži zemljevid lokacije?',
              defaultValue: true,
              required: false,
              admin: {
                description: 'Če je označeno, bo prikazan zemljevid. Preverite, ali so \'Koordinate sedeža\' pravilno nastavljene v splošnih nastavitvah strani.',
                condition: (data, siblingData) => !siblingData?.serviceAreaHideSection,
              },
            },
            {
              name: 'serviceAreaLocations',
              type: 'array',
              label: 'Seznam lokacij storitev',
              admin: {
                condition: (data, siblingData) => !siblingData?.serviceAreaHideSection,
              },
              fields: [
                 {
                  name: 'name',
                  type: 'text',
                  required: false,
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
              admin: {
                condition: (data, siblingData) => !siblingData?.serviceAreaHideSection,
              },
            },
            {
              name: 'contactCta',
              type: 'relationship',
              relationTo: 'ctas' as CollectionSlug,
              hasMany: false,
              required: false,
              label: 'CTA gumb kontaktne sekcije',
              admin: {
                description: 'Izberite CTA gumb za kontaktno sekcijo (neobvezno).',
                condition: (data, siblingData) => !siblingData?.serviceAreaHideSection,
              },
            }
          ]
        },
         // --- Contact Section Tab ---
        {
          label: 'Kontakt',
          fields: [
            {
              name: 'contactHideSection',
              label: 'Skrij sekcijo',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Če je označeno, ta sekcija ne bo prikazana na spletni strani.',
                width: '30%',
              }
            },
            {
              name: 'contactTitle',
              type: 'text',
              label: 'Naslov kontaktne sekcije',
              required: false,
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.contactHideSection,
              },
            },
            {
              name: 'contactDescription',
              type: 'textarea',
              label: 'Opis kontaktne sekcije',
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.contactHideSection,
              },
            },
            {
              name: 'contactWorkingHours',
              type: 'array',
              label: 'Delovni čas',
              admin: {
                condition: (data, siblingData) => !siblingData?.contactHideSection,
              },
              fields: [
                {
                  name: 'day',
                  type: 'text',
                  required: false,
                  label: 'Dan v tednu'
                },
                {
                  name: 'hours',
                  type: 'text',
                  required: false,
                  label: 'Ure (npr. 09:00 - 18:00 ali Zaprto)'
                }
              ]
            },
            {
              name: 'contactPhoneNumber',
              type: 'text',
              required: false,
              label: 'Kontaktna telefonska številka',
              admin: {
                condition: (data, siblingData) => !siblingData?.contactHideSection,
              },
            },
            {
              name: 'contactAddress',
              type: 'text',
              required: false,
              label: 'Kontaktni naslov',
              admin: {
                condition: (data, siblingData) => !siblingData?.contactHideSection,
              },
            }
          ]
        },
        // --- FAQ Section Tab ---
        {
          label: 'Pogosta vprašanja',
          fields: [
            {
              name: 'faqHideSection',
              label: 'Skrij sekcijo',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Če je označeno, ta sekcija ne bo prikazana na spletni strani.',
                width: '30%',
              }
            },
            {
              name: 'faqTitle',
              type: 'text',
              label: 'Naslov FAQ',
              required: false,
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.faqHideSection,
              },
            },
            {
              name: 'faqDescription',
              type: 'textarea',
              label: 'Opis FAQ sekcije',
              localized: true,
              admin: {
                condition: (data, siblingData) => !siblingData?.faqHideSection,
              },
            },
             {
              name: 'faqDefaultOpenItem',
              type: 'relationship',
              relationTo: 'faq-items', // Use string literal
              label: 'Privzeto odprto FAQ vprašanje (neobvezno)',
              required: false,
              admin: {
                condition: (data, siblingData) => !siblingData?.faqHideSection,
              },
            },
             {
              name: 'selectedFaqItems',
              type: 'relationship',
              relationTo: 'faq-items', // Use string literal
              hasMany: true,
              required: false,
              label: 'Izbor FAQ za prikaz',
              admin: {
                description: 'Izberite pogosta vprašanja, ki se prikažejo na domači strani. Vrstni red je pomemben.',
                condition: (data, siblingData) => !siblingData?.faqHideSection,
              },
            }
          ]
        },
      ]
    }
  ],
}; 