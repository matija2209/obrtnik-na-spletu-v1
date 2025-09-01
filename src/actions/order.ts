'use server'

import { z } from 'zod';
import { getPayloadHMR } from '@payloadcms/next/utilities'; // Import getPayloadHMR
import config from '../../payload.config'; // Correct Payload config path
import { getPayloadClient } from '@/lib/payload';


// Define the expected form data schema using Zod for validation
const OrderSchema = z.object({
  productId: z.string().min(1, "ID izdelka je obvezen."),
  // productTitle: z.string().min(1, "Naziv izdelka je obvezen."), // Title is not in Inquiries, removed for simplicity
  quantity: z.coerce.number().int().min(1, "Količina mora biti vsaj 1."),
  firstName: z.string().min(1, "Ime je obvezno."),
  lastName: z.string().min(1, "Priimek je obvezen."),
  email: z.string().email("Neveljaven e-poštni naslov."),
  phone: z.string().optional(), // Optional phone number
  streetAddress: z.string().min(1, "Naslov je obvezen."),
  postalCode: z.string().min(3, "Poštna številka je obvezna.").regex(/^\d{3,5}$/, "Poštna številka mora vsebovati 3-5 številk."),
  town: z.string().min(1, "Kraj je obvezen."),
  message: z.string().optional(), // Add optional message field
});

// Update the function signature for useActionState
export async function submitOrder(
    prevState: any, 
    formData: FormData
): Promise<any> {
  
  // Extract and validate data using Zod
  const validatedFields = OrderSchema.safeParse({
    productId: formData.get('productId'),
    // productTitle: formData.get('productTitle'),
    quantity: formData.get('quantity'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined, // Handle empty string for optional field
    streetAddress: formData.get('streetAddress'),
    postalCode: formData.get('postalCode'),
    town: formData.get('town'),
    message: formData.get('message') || undefined, // Extract message
  });

  // Return validation errors if any
  if (!validatedFields.success) {
    const fieldErrors: Record<string, string[]> = {};
    validatedFields.error.issues.forEach((error) => {
      const fieldName = error.path[0] as string;
      if (!fieldErrors[fieldName]) {
        fieldErrors[fieldName] = [];
      }
      fieldErrors[fieldName].push(error.message);
    });

    return {
      success: false,
      message: 'Prosimo, popravite napake v obrazcu.',
      errors: fieldErrors,
    };
  }
  console.log('validatedFields', validatedFields);
  
  const { 
    productId, 
    quantity, 
    firstName, 
    lastName, 
    email, 
    phone, 
    streetAddress, 
    postalCode, 
    town, 
    message 
  } = validatedFields.data;

  try {
    // Get Payload instance
    const payload = await getPayloadClient()

    // Verify that the product exists
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    });

    if (!product) {
      return {
        success: false,
        message: 'Izdelek ni bil najden.',
        errors: {},
      };
    }

    // Create the order with embedded customer data
    // The beforeChange hook will handle generating orderNumber and creating/finding customer
    
    const newOrder = await payload.create({
      collection: 'orders',
      data: {
        product: parseInt(productId, 10), // Convert string to number
        quantity: quantity,
        customerData: {
          firstName,
          lastName,
          email,
          phone,
          streetAddress,
          postalCode,
          town,
          message,
        },
        customerMessage: message,
        source: 'website',
        status: 'pending',
      } as any, // Use type assertion to bypass strict typing for fields handled by hooks
    });

    console.log('Order created successfully:', newOrder.orderNumber);

    return {
      success: true,
      message: 'Vaše povpraševanje je bilo uspešno poslano!',
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      errors: {},
    };

  } catch (error) {
    console.error('Error creating order:', error);
    
    return {
      success: false,
      message: 'Prišlo je do napake pri oddaji povpraševanja. Prosimo, poskusite znova.',
      errors: {},
    };
  }
} 