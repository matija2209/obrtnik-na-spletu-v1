import { ProductPage } from "@payload-types";
import { CollectionBeforeChangeHook } from "payload";

const populateFromProduct: CollectionBeforeChangeHook<ProductPage> = async ({ 
    data, 
    operation, 
    originalDoc, 
    req 
  }) => {
    console.log('populateFromProduct beforeChange hook called', { operation, hasProducts: !!data.products });
    console.log(data);
    
    if (data.products === null || data.products === undefined) {
      console.log('No products found');
      return data;
    }
    
    // Auto-add ProductFormBlock for new documents
    if (operation === 'create' && (!data.layout || data.layout.length === 0)) {
      console.log('Auto-adding ProductFormBlock for new product page');
      
      const productFormBlock = {
        blockType: 'product_form' as const,
        product: data.products, // Use the same product from the parent document
        template: 'default' as const,
        colourScheme: 'primary' as const,
        showTitle: true,
        showSku: false,
        showManufacturer: true,
        showType: true,
        showShortDescription: true,
        showLongDescription: false,
        showPricing: true,
        showAvailability: true,
        showMountingInfo: true,
        showTechnicalSpecs: false,
        showHighlights: true,
        showMainImage: true,
        showGallery: false,
        showReviews: true,
        showRating: true,
        showOrderForm: true,
        ctaText: 'Pošljite povpraševanje',
        idHref: 'product-form',
        id: crypto.randomUUID(), // Generate a unique ID for the block
      };
      
      data.layout = [productFormBlock];
      console.log('Added ProductFormBlock to layout');
    }
    
    // Only run if products relationship exists
  
      try {
        // Check if we need to update (new document or product changed or missing title/slug)
        const shouldUpdate = operation === 'create' || 
                            !data.title || 
                            !data.slug || 
                            (originalDoc && originalDoc.products !== data.products);
        
        if (!shouldUpdate) {
          console.log('No update needed');
          return data;
        }
  
        // Extract product ID
        const productId = data.products as unknown as string
        
        if (!productId) {
          console.log('Could not extract product ID from:', data.products);
          return data;
        }
  
        console.log('Fetching product with ID:', productId);
  
        // Fetch the related product
        const product = await req.payload.findByID({
          collection: 'products',
          id: productId,
        });
  
        if (!product) {
          console.log('Product not found');
          return data;
        }
  
        console.log('Found product:', product.title, product.manufacturer);
        
        // Generate title and slug from product
        const generatedTitle = `${product.title}`;
        const generatedSlug = product.slug
        
        let finalSlug = generatedSlug;
  
        // Modify the data that will be saved
        data.title = generatedTitle;
        data.slug = finalSlug;
        console.log('Will save with title:', generatedTitle, 'and slug:', finalSlug);
        
        // Update product reference in auto-added ProductFormBlock if it exists and product changed
        if (data.layout && data.layout.length > 0 && data.layout[0].blockType === 'product_form') {
          data.layout[0].product = data.products;
          console.log('Updated product reference in auto-added ProductFormBlock');
        }
        
        return data;
      } catch (error) {
        console.error('Error populating title/slug from product:', error);
      }
    return data; // Return the modified data
  };
  

  export default populateFromProduct;