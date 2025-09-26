import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig } from 'payload';

export const ProductVariants: CollectionConfig = {
  slug: 'product-variants',
  labels: {
    singular: 'Product Variant',
    plural: 'Product Variants',
  },
  admin: {
    useAsTitle: 'displayName',
    group:{
      en:"Sales",
      sl:"Prodaja",
      de:"Verkauf"
    },
    defaultColumns: ['displayName', 'variantSku', 'inStock'],
  },
  access: {
    read: () => true,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'displayName',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-generated from product name + color + size',
      },
    },
    {
      name: 'variantOptions',
      type: 'array',
      admin: {
        description: 'Variant option values - must match parent product variant types',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Must match a variant option type defined in parent product',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'The specific value for this variant (e.g., "Siva boja", "10×10")',
          },
        },
      ],
    },
    {
      name: 'variantSku',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique SKU for this specific variant',
      },
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
      admin: {
        step: 0.01,
        description: 'Variant-specific price override',
      },
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Variant-specific image (optional)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Auto-generate displayName from all variant attributes
        if (operation === 'create' || operation === 'update') {
          let productTitle = '';
          
          if (data.product) {
            try {
              const product = await req.payload.findByID({
                collection: 'products',
                id: typeof data.product === 'string' ? data.product : data.product.id,
              });
              productTitle = product.title || '';
            } catch (error:any) {
              console.error('Error fetching product for displayName:', error);
              // If product not found, this variant may be orphaned
              if (error.status === 404) {
                req.payload.logger.warn(`Variant ${data.variantSku || data.id} references non-existent product ${typeof data.product === 'string' ? data.product : data.product?.id}`);
              }
            }
          }
          
          const parts = [];
          if (productTitle) parts.push(productTitle);
          
          // Add variant option values from the new dynamic structure
          if (data.variantOptions && Array.isArray(data.variantOptions)) {
            data.variantOptions.forEach(option => {
              if (option.value && option.value.trim()) {
                parts.push(option.value);
              }
            });
          }
          
          data.displayName = parts.join(' - ');
        }
        return data;
      },
    ],
    beforeValidate: [
      async ({ data, operation, req, originalDoc }) => {
        // Validate SKU uniqueness across all collections
        if (data?.variantSku && (operation === 'create' || operation === 'update')) {
          try {
            // Check against other product variants
            const existingVariants = await req.payload.find({
              collection: 'product-variants',
              where: {
                and: [
                  {
                    variantSku: {
                      equals: data.variantSku,
                    },
                  },
                  ...(operation === 'update' && originalDoc?.id ? [{
                    id: {
                      not_equals: originalDoc.id,
                    },
                  }] : []),
                ],
              },
              limit: 1,
            });

            if (existingVariants.totalDocs > 0) {
              throw new Error(`Variant SKU "${data.variantSku}" already exists in another variant`);
            }

            // Check against main product SKUs
            const existingProducts = await req.payload.find({
              collection: 'products',
              where: {
                sku: {
                  equals: data.variantSku,
                },
              },
              limit: 1,
            });

            if (existingProducts.totalDocs > 0) {
              throw new Error(`SKU "${data.variantSku}" already exists as a product SKU`);
            }
          } catch (error) {
            if (error instanceof Error && error.message.includes('already exists')) {
              throw error;
            }
            console.error('Error validating variant SKU:', error);
          }
        }

        // Validate variant options against parent product's variant option types
        if (data?.variantOptions && data.product) {
          try {
            // Fetch parent product to validate option names
            const product = await req.payload.findByID({
              collection: 'products',
              id: typeof data.product === 'string' ? data.product : data.product.id,
            });

            const allowedOptionNames = product.variantOptionTypes?.map(t => t.name) || [];

            for (const option of data.variantOptions) {
              if (!allowedOptionNames.includes(option.name)) {
                throw new Error(`Invalid variant option "${option.name}". Allowed options for this product: ${allowedOptionNames.join(', ')}`);
              }
            }
          } catch (error:any) {
            if (error instanceof Error && error.message.includes('Invalid variant option')) {
              throw error;
            }
            // If product not found, log warning but don't fail validation (handles orphaned variants)
            if (error.status === 404) {
              req.payload.logger.warn(`Cannot validate variant options: Product ${typeof data.product === 'string' ? data.product : data.product?.id} not found`);
            } else {
              console.error('Error validating variant options:', error);
            }
          }
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Update parent product's hasVariants flag
        if (operation === 'create' || operation === 'update') {
          try {
            const productId = typeof doc.product === 'string' ? doc.product : doc.product.id;
            
            await req.payload.update({
              collection: 'products',
              id: productId,
              data: {
                hasVariants: true,
              },
            });
          } catch (error) {
            console.error('Error updating product hasVariants flag:', error);
          }
        }
        return doc;
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        // Check if parent product still has variants and update hasVariants flag
        try {
          const productId = typeof doc.product === 'string' ? doc.product : doc.product.id;
          
          const remainingVariants = await req.payload.find({
            collection: 'product-variants',
            where: {
              product: {
                equals: productId,
              },
            },
            limit: 1,
          });

          await req.payload.update({
            collection: 'products',
            id: productId,
            data: {
              hasVariants: remainingVariants.totalDocs > 0,
            },
          });
        } catch (error) {
          console.error('Error updating product hasVariants flag after variant deletion:', error);
        }
      },
    ],
  },
};