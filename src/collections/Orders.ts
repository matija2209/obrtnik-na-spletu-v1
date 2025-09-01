import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Naročilo',
    plural: 'Naročila',
  },
  
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'product', 'total', 'status', 'createdAt'],
    description: 'Naročila kupcev za čistilne naprave.',
    group: 'Prodaja',
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
                  label: 'Številka naročila',
                  required: true,
                  unique: true,
                  admin: {
                    width: '50%',
                    readOnly: true,
                    description: 'Avtomatsko generirano',
                  },
                },
                {
                  name: 'status',
                  type: 'select',
                  label: 'Status',
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
                description: 'Izberi obstoječega kupca ali bo ustvarjen avtomatsko iz spletne forme',
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
                      label: 'Izdelek',
                      relationTo: 'products',
                      required: true,
                      admin: {
                        width: '70%',
                      },
                    },
                    {
                      name: 'quantity',
                      type: 'number',
                      label: 'Količina',
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
                      label: 'Cena na enoto (EUR)',
                      admin: {
                        width: '50%',
                        step: 0.01,
                        description: 'Avtomatsko iz izdelka ali ročno vnesi',
                      },
                    },
                    {
                      name: 'total',
                      type: 'number',
                      label: 'Skupna cena (EUR)',
                      admin: {
                        width: '50%',
                        step: 0.01,
                        description: 'Količina × Cena na enoto',
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
              label: 'Sporočilo kupca',
              required: false,
              admin: {
                readOnly: true,
                description: 'Sporočilo iz spletne forme',
                condition: (data) => !!data.customerMessage,
              },
            },
            {
              name: 'adminNotes',
              type: 'textarea',
              label: 'Opombe (interno)',
              required: false,
              admin: {
                description: 'Interne opombe - ni vidno kupcu',
                placeholder: 'Interne opombe za obdelavo naročila...',
              },
            },
            {
              name: 'publicNotes',
              type: 'textarea',
              label: 'Javne opombe',
              required: false,
              admin: {
                description: 'Opombe vidne kupcu (npr. v potrditvenem emailu)',
                placeholder: 'Dodatne informacije za kupca...',
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
                  label: 'Datum naročila',
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
                  label: 'Zadnja sprememba',
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
                  label: 'Vir naročila',
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
                    description: 'Od koder je prišlo naročilo',
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