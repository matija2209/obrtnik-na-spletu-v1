import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: {
      en: 'Order',
      sl: 'Naročilo',
      de: 'Bestellung',
    },
    plural: {
      en: 'Orders',
      sl: 'Naročila',
      de: 'Bestellungen',
    },
  },
  
  admin: {
    useAsTitle: 'orderNumber',
    hidden: true,
    defaultColumns: ['orderNumber', 'customer', 'product', 'total', 'status', 'createdAt'],
    description: {
      sl: 'Naročila kupcev za čistilne naprave.',
      de: 'Bestellungen von Kunden für Reinigungsmaschinen.',
      en: 'Orders from customers for cleaning machines.',
    },
    group: {
      sl: 'Prodaja',
      de: 'Verkauf',
      en: 'Sales',
    },
    listSearchableFields: ['orderNumber'],
  },
  
  access: {
    read: superAdminOrTenantAdminAccess,
    create: () => true, // Allow public form submissions
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Generate order number for new orders
        if (operation === 'create' && !data.orderNumber) {
          const latestOrder = await req.payload.find({
            collection: 'orders',
            sort: 'createdAt',
            limit: 1,
          });
          const latestOrderNumber = latestOrder.docs[0]?.orderNumber || 'NAROCILO-0';
          const latestOrderNumberInt = parseInt(latestOrderNumber.replace('NAROCILO-', ''));
          const newOrderNumber = `NAROCILO-${latestOrderNumberInt + 1}`;
          data.orderNumber = newOrderNumber;
        }
        
        // Handle customer creation/lookup for form submissions
        if (operation === 'create' && data.customerData) {
          try {
            // First try to find existing customer by email
            const existingCustomer = await req.payload.find({
              collection: 'customers',
              where: {
                email: {
                  equals: data.customerData.email,
                },
              },
              limit: 1,
            });
            
            if (existingCustomer.docs.length > 0) {
              // Use existing customer
              data.customer = existingCustomer.docs[0].id;

            } else {
              // Create new customer
              const newCustomer = await req.payload.create({
                collection: 'customers',
                data: {
                  firstName: data.customerData.firstName,
                  lastName: data.customerData.lastName,
                  email: data.customerData.email,
                  phone: data.customerData.phone,
                  address: {
                    streetAddress: data.customerData.streetAddress,
                    postalCode: data.customerData.postalCode,
                    town: data.customerData.town,
                    country: 'Slovenija',
                  },
                  customerNotes: data.customerData.message,
                  gdprConsent: true, // Assume consent if submitting order
                },
              });
              data.customer = newCustomer.id;
            }
            
            // Clean up temporary customerData
            delete data.customerData;
          } catch (error) {
            // Don't let the order creation continue if customer creation fails
            const errorMessage = error instanceof Error ? error.message : 'Neznana napaka';
            throw new Error(`Napaka pri ustvarjanju stranke: ${errorMessage}`);
          }
        }
        
        // Calculate total if product and quantity are set
        if (data.product && data.quantity && operation === 'create') {
          try {
            const product = await req.payload.findByID({
              collection: 'products',
              id: data.product,
            });
            
            if (product && product.price) {
              data.total = product.price * data.quantity;
            }
          } catch (error) {
            console.error('Error calculating total:', error);
          }
        }
        
        return data;
      },
    ],
    
    // afterChange: [
    //   async ({ doc, operation, req }) => {
    //     if (operation === 'create') {
    //       // Update customer statistics
    //       try {
    //         const customer = await req.payload.findByID({
    //           collection: 'customers',
    //           id: doc.customer,
    //         });
            
    //         if (customer) {
    //           const customerOrders = await req.payload.find({
    //             collection: 'orders',
    //             where: {
    //               customer: {
    //                 equals: doc.customer,
    //               },
    //             },
    //           });
              
    //           const totalSpent = customerOrders.docs.reduce((sum, order) => sum + (order.total || 0), 0);
              
    //           await req.payload.update({
    //             collection: 'customers',
    //             id: doc.customer,
    //             data: {
    //               totalOrders: customerOrders.totalDocs,
    //               totalSpent: totalSpent,
    //               lastOrderDate: doc.createdAt,
    //             },
    //           });
    //         }
    //       } catch (error) {
    //         console.error('Error updating customer stats:', error);
    //       }
          
    //       // Send notification email to admin
    //       console.log(`New order received: ${doc.orderNumber}`);
    //       // TODO: Implement email notification
    //     }
    //   },
    // ],
  },
  
  fields: [
    // Hidden field for form submissions - will be processed in beforeChange hook
    {
      name: 'customerData',
      type: 'group',
      admin: {
        hidden: true,
      },
      fields: [
        { name: 'firstName', type: 'text' },
        { name: 'lastName', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'streetAddress', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'town', type: 'text' },
        { name: 'message', type: 'textarea' },
      ],
    },
    
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Povzetek naročila',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'orderNumber',
                  type: 'text',
                  label: {
                    sl: 'Številka naročila',
                    de: 'Bestellnummer',
                    en: 'Order Number',
                  },
                  required: true,
                  unique: true,
                  admin: {
                    width: '50%',
                    readOnly: true,
                    description: {
                      sl: 'Avtomatsko generirano',
                      de: 'Automatisch generiert',
                      en: 'Automatically generated',
                    },
                  },
                },
                {
                  name: 'status',
                  type: 'select',
                  label: {
                    sl: 'Status',
                    de: 'Status',
                    en: 'Status',
                  },
                  required: true,
                  defaultValue: 'pending',
                  options: [
                    { label: 'Novo naročilo', value: 'pending' },
                    { label: 'V obdelavi', value: 'processing' },
                    { label: 'Kontaktirano', value: 'contacted' },
                    { label: 'Ponudba poslana', value: 'quoted' },
                    { label: 'Potrjeno', value: 'confirmed' },
                    { label: 'Zaključeno', value: 'completed' },
                    { label: 'Preklicano', value: 'cancelled' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            
            {
              name: 'customer',
              type: 'relationship',
              label: 'Kupec',
              relationTo: 'customers',
              required: true,
              admin: {
                description: {
                  sl: 'Izberi obstoječega kupca ali bo ustvarjen avtomatsko iz spletne forme',
                  de: 'Wählen Sie einen bestehenden Kunden oder erstellen Sie einen aus der Webformular-Eingabe.',
                  en: 'Select an existing customer or create one from the web form input.',
                },
              },
            },
            
            {
              type: 'collapsible',
              label: 'Podatki o izdelku',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'product',
                      type: 'relationship',
                      label: {
                        sl: 'Izdelek',
                        de: 'Produkt',
                        en: 'Product',
                      },
                      relationTo: 'products',
                      required: true,
                      admin: {
                        width: '70%',
                      },
                    },
                    {
                      name: 'quantity',
                      type: 'number',
                      label: {
                        sl: 'Količina',
                        de: 'Menge',
                        en: 'Quantity',
                      },
                      required: true,
                      min: 1,
                      defaultValue: 1,
                      admin: {
                        width: '30%',
                        step: 1,
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'unitPrice',
                      type: 'number',
                        label: {
                        sl: 'Cena na enoto (EUR)',
                        de: 'Preis pro Einheit (EUR)',
                        en: 'Price per unit (EUR)',
                      },
                      admin: {
                        width: '50%',
                        step: 0.01,
                        description: {
                          sl: 'Avtomatsko iz izdelka ali ročno vnesi',
                          de: 'Preis pro Einheit (EUR)',
                          en: 'Price per unit (EUR)',
                        },
                      },
                    },
                    {
                      name: 'total',
                      type: 'number',
                      label: {
                        sl: 'Skupna cena (EUR)',
                        de: 'Gesamtkosten (EUR)',
                        en: 'Total price (EUR)',
                      },
                      admin: {
                        width: '50%',
                        step: 0.01,
                        description: {
                          sl: 'Količina × Cena na enoto',
                          de: 'Menge × Preis pro Einheit',
                          en: 'Quantity × Price per unit',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        
        {
          label: 'Sporočilo in opombe',
          fields: [
            {
              name: 'customerMessage',
              type: 'textarea',
              label: {
                sl: 'Sporočilo kupca',
                de: 'Kunden-Nachricht',
                en: 'Customer Message',
              },
              required: false,
              admin: {
                readOnly: true,
                description: {
                  sl: 'Sporočilo iz spletne forme',
                  de: 'Nachricht aus dem Webformular',
                  en: 'Message from the web form',
                },
                condition: (data) => !!data.customerMessage,
              },
            },
            {
              name: 'adminNotes',
              type: 'textarea',
              label: {
                sl: 'Opombe (interno)',
                de: 'Interne Notizen',
                en: 'Internal Notes',
              },
              required: false,
              admin: {
                description: {
                  sl: 'Interne opombe - ni vidno kupcu',
                  de: 'Interne Notizen - nicht für den Kunden sichtbar',
                  en: 'Internal notes - not visible to the customer',
                },
                placeholder: {
                  sl: 'Interne opombe za obdelavo naročila...',
                  de: 'Interne Notizen für die Bestellbearbeitung...',
                  en: 'Internal notes for order processing...',
                },
              },
            },
            {
              name: 'publicNotes',
              type: 'textarea',
              label: {
                sl: 'Javne opombe',
                de: 'Öffentliche Notizen',
                en: 'Public Notes',
              },
              required: false,
              admin: {
                description: {
                  sl: 'Opombe vidne kupcu (npr. v potrditvenem emailu)',
                  de: 'Öffentliche Notizen für den Kunden (z.B. im Bestätigungs-E-Mail)',
                  en: 'Public notes for the customer (e.g. in the confirmation email)',
                },
                placeholder: {
                  sl: 'Dodatne informacije za kupca...',
                  de: 'Zusätzliche Informationen für den Kunden...',
                  en: 'Additional information for the customer...',
                },
              },
            },
          ],
        },
        
        {
          label: 'Sledenje',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'createdAt',
                  type: 'date',
                  label: {
                    sl: 'Datum naročila',
                    de: 'Bestelldatum',
                    en: 'Order Date',
                  },
                  admin: {
                    width: '50%',
                    readOnly: true,
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
                {
                  name: 'updatedAt',
                  type: 'date',
                  label: {
                    sl: 'Zadnja sprememba',
                    de: 'Letzte Änderung',
                    en: 'Last Change',
                  },
                  admin: {
                    width: '50%',
                    readOnly: true,
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'source',
                  type: 'select',
                  label: {
                    sl: 'Vir naročila',
                    de: 'Bestellquelle',
                    en: 'Order Source',
                  },
                  defaultValue: 'website',
                  options: [
                    { label: 'Spletna stran', value: 'website' },
                    { label: 'Telefon', value: 'phone' },
                    { label: 'E-pošta', value: 'email' },
                    { label: 'Osebno', value: 'in-person' },
                    { label: 'Drugo', value: 'other' },
                  ],
                  admin: {
                    width: '50%',
                      description: {
                      sl: 'Od koder je prišlo naročilo',
                      de: 'Von wo die Bestellung kam',
                      en: 'From where the order came',
                    },
                  },
                },
              ],
            }
          ],
        },
      ],
    },
  ],
  
  timestamps: true,
};