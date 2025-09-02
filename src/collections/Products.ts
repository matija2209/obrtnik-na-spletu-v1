import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { slugField } from '@/fields/slug';
import { CollectionConfig } from 'payload';


export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: {
      en: 'Product',
      sl: 'Izdelek',
      de: 'Produkt',
    },
    plural: {
      en: 'Products',
      sl: 'Izdelki',
      de: 'Produkte',
    },
  },
  
  admin: {
    useAsTitle: 'title',
    hidden: true,
    defaultColumns: ['title', 'sku', 'type', 'manufacturer'],
    description: {
      sl: 'Čistilne naprave za prikaz na spletni strani.',
      de: 'Reinigungsmaschinen für die Anzeige auf der Website.',
      en: 'Cleaning machines for display on the website.',
    },
    group: {
      sl: 'Prodaja',
      de: 'Verkauf',
      en: 'Sales',
    },
    listSearchableFields: ['title', 'sku', 'manufacturer', 'type'],
  },
  
  access: {
    read: () => true,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Update hasVariants based on existing variants
        if (operation === 'create' || operation === 'update') {
          try {
            const variants = await req.payload.find({
              collection: 'product-variants',
              where: {
                product: {
                  equals: doc.id,
                },
              },
              limit: 1,
            });

            const hasVariants = variants.totalDocs > 0;
            
            if (doc.hasVariants !== hasVariants) {
              await req.payload.update({
                collection: 'products',
                id: doc.id,
                data: {
                  hasVariants,
                },
              });
            }
          } catch (error) {
            console.error('Error updating hasVariants:', error);
          }
        }
        return doc;
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        // Delete all associated variants when product is deleted
        try {
          await req.payload.delete({
            collection: 'product-variants',
            where: {
              product: {
                equals: doc.id,
              },
            },
          });
        } catch (error) {
          console.error('Error deleting product variants:', error);
        }
      },
    ],
    // afterChange: [
    //   async ({ doc, operation }) => {
    //     if (operation === 'create' || operation === 'update') {
    //       console.log(`Product ${operation}d: ${doc.title}. Triggering Vercel build...`);
    //       try {
    //         const response = await fetch('https://api.vercel.com/v1/integrations/deploy/prj_0YGxAZLtYVrGeyhpXRI7RPpXlDpB/Xgkc2A820Q', {
    //           method: 'POST',
    //         });
    //         const data = await response.json();
    //         if (response.ok && data.job && data.job.id) {
    //           console.log(`Vercel build triggered successfully. Job ID: ${data.job.id}`);
    //         } else {
    //           console.error('Failed to trigger Vercel build:', response.status, response.statusText, data);
    //         }
    //       } catch (error) {
    //         console.error('Error triggering Vercel build:', error);
    //       }
    //     }
    //     return doc;
    //   },
    // ],
  },
  
  fields: [
    // Basic Product Information Tab
    slugField('title', {
      label: 'Pot / Unikatni ID',
      unique: true,
      index: true,
      admin: {
        description: 'ID se generira samodejno iz naslova, lahko pa ga definirate ročno. Uporabno pri uvažanju podatkov.',
        position: 'sidebar',
      }
    }),
    {
      name: 'collection',
      type: 'relationship',
      relationTo: 'collections',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Kolekcija, ki ji pripada ta produkt',
      },
    },
    {
      name: 'hasVariants',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Whether this product has variants in ProductVariants collection',
      },
    },
    {
      name: 'variantOptionTypes',
      type: 'array',
      admin: {
        description: 'Define what variant option types this product supports (e.g., Color, Size, Material)',
        condition: (data) => data.hasVariants === true,
        position: 'sidebar',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., color, size, material',
            description: 'Database field name (lowercase, no spaces)',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., Barva, Velikost, Material',
            description: 'User-friendly label shown in UI',
          },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Osnovne informacije',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Naziv izdelka',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'sku',
                  type: 'text',
                  label: 'SKU koda',
                  required: true,
                  unique: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'manufacturer',
                  type: 'text',
                  label: 'Proizvajalec',
                  required: false,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  label: 'Model',
                  required: false,
                  options: [
                    { label: 'Variant 1', value: 'variant1' },
                    { label: 'Variant 2', value: 'variant2' },
                    { label: 'Tlakovci', value: 'tlakovci' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Kratek opis',
              maxLength: 160,
              admin: {
                placeholder: 'Kratek opis za SEO in preglede (max. 160 znakov)',
              },
            },
            {
              name: 'longDescription',
              type: 'richText',
              label: 'Podroben opis',
            },
            {
              name: 'productVariants',
              type: 'join',
              collection: 'product-variants',
              on: 'product',
              admin: {
                description: 'Variante za ta izdelek - upravljajte jih v ProductVariants sekciji',
              },
            },
          ],
        },
        
        // Pricing & Availability Tab
        {
          label: 'Cene in dostopnost',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  label: 'Orientacijska cena (€)',
                  required: false,
                  min: 0,
                  admin: {
                    width: '50%',
                    step: 0.01,
                    description: 'Orientacijska cena - končna cena je odvisna od specifikacij',
                  },
                },
                {
                  name: 'inStock',
                  label: 'Na voljo',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'mountingIncluded',
              type: 'checkbox',
              label: 'Vključena montaža',
              defaultValue: true,
            },
          ],
        },
        
        // Technical Specifications Tab
        {
          label: 'Tehnične specifikacije',
          fields: [
            {
              name: 'technicalSpecs',
              type: 'array',
              label: 'Tehnične specifikacije',
              minRows: 0,
              maxRows: 20,
              admin: {
                description: 'Dodajte tehnične specifikacije kot ključ-vrednost pare',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Naziv specifikacije',
                      required: true,
                      admin: {
                        width: '40%',
                        placeholder: 'npr. Moč, Dimenzije, Teža...',
                      },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      label: 'Vrednost',
                      required: true,
                      admin: {
                        width: '60%',
                        placeholder: 'npr. 2.5 kW, 800x600x200 mm...',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        
        // Media & Marketing Tab
        {
          label: 'Slike in marketing',
          fields: [
            {
              name: 'image',
              type: 'upload',
              label: 'Glavna slika',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Glavna slika izdelka za prikaz v katalogu',
              },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
            {
              name: 'highlights',
              type: 'array',
              label: 'Ključne lastnosti',
              minRows: 0,
              maxRows: 6,
              admin: {
                description: 'Ključne lastnosti za prikaz na produktni strani',
              },
              fields: [
                {
                  name: 'highlight',
                  type: 'text',
                  label: 'Lastnost',
                  required: true,
                  maxLength: 100,
                },
              ],
            },
          ],
        },
        
        // Reviews & Analytics Tab
        {
          label: 'Ocene in analitika',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'rating',
                  type: 'number',
                  label: 'Povprečna ocena',
                  min: 0,
                  max: 5,
                  defaultValue: 0,
                  admin: {
                    width: '50%',
                    step: 0.1,
                    readOnly: true,
                    description: 'Avtomatsko izračunano iz ocen',
                  },
                },
                {
                  name: 'ratingCount',
                  type: 'number',
                  label: 'Število ocen',
                  min: 0,
                  defaultValue: 0,
                  admin: {
                    width: '50%',
                    step: 1,
                    readOnly: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};