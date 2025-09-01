'use client'

import React, { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { submitOrder } from '@/actions/order';

// Import smaller components
import { ProductImage } from './ProductImage';
import { ProductInfo } from './ProductInfo';
import { ProductSpecifications } from './ProductSpecifications';
import { QuantitySelector } from './QuantitySelector';
import { ContactForm } from './ContactForm';
import { AddressForm } from './AddressForm';
import { OrderSummary } from './OrderSummary';
import { StatusMessage } from './StatusMessage';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@payload-types';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Card } from '@/components/ui/card';

// Define the initial state for useActionState
const initialState: any = {
  success: false,
  message: '',
  errors: undefined,
};

export default function OrderForm({ product,variantSku }: { product: Product,variantSku?:String }) {
  // Local state for controlled inputs
  const [formState, setFormState] = useState<any>({
    quantity: 1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    postalCode: '',
    town: '',
    message: '',
    productId: product.id.toString(),
  });

  // useActionState hook
  const [state, formAction, isPending] = useActionState(submitOrder, initialState);
  
  const router = useRouter();

  // Effect to handle redirection on successful submission
  useEffect(() => {
    if (state.success) {
        router.push('/hvala');
    }
  }, [state.success, router]);

  // Handle changes in local form state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prevState: any) => ({ 
        ...prevState, 
        [name]: name === 'quantity' ? parseInt(value, 10) || 1 : value 
    }));
  };

  // Handle quantity changes specifically
  const handleQuantityChange = (value: number) => {
    setFormState((prev: any) => ({
      ...prev,
      quantity: value
    }));
  };

  return (

      <div className="grid lg:grid-cols-3 gap-0">
        {/* Product Image - Smaller Section */}
        <div className="lg:col-span-1">
          <ProductImage product={product} />
        </div>

        {/* Order Form Section - Larger Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
            <ProductInfo product={product} />

              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-6">

            {/* Pass formAction to the form */}
            <form action={formAction} className="space-y-6">
              {/* Hidden inputs for product data - passed via FormData */}
              <input type="hidden" name="productId" value={String(product.id)} />
              <input type="hidden" name="productTitle" value={product.title || 'Neznan izdelek'} />

              {/* Product Specifications */}
              <ProductSpecifications product={product} />

              {/* Quantity Selector */}
              <QuantitySelector 
                quantity={formState.quantity} 
                onChange={handleQuantityChange} 
                isPending={isPending} 
                errors={state.errors}
              />

              {/* Contact Information */}
              <ContactForm 
                firstName={formState.firstName}
                lastName={formState.lastName}
                email={formState.email}
                phone={formState.phone}
                onChange={handleChange}
                isPending={isPending}
                errors={state.errors}
              />

              {/* Address Information */}
              <AddressForm 
                streetAddress={formState.streetAddress}
                postalCode={formState.postalCode}
                town={formState.town}
                onChange={handleChange}
                isPending={isPending}
                errors={state.errors}
              />

              {/* Add Message Textarea */}
              <div className="space-y-1">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Sporočilo
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Dodatne informacije ali vprašanja..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
                  disabled={isPending}
                  aria-disabled={isPending}
                />
                {state.errors?.message && (
                  <p className="text-xs text-red-600">{state.errors.message}</p>
                )}
              </div>

              {/* Status Message Display */}
              {state.message && !state.success && (
                <StatusMessage message={state.message} success={false} />
              )}

              {/* Order Summary */}
              <OrderSummary product={product} quantity={formState.quantity} />

              {/* Submit Button */}
              <CardFooter>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full"
                  aria-disabled={isPending}
                >
                  {isPending ? 'Oddajam...' : 'Oddaj povpraševanje'}
                </Button>

              </CardFooter>
            </form>
          </div>
            </CardContent>
          </Card>
          
        </div>
      </div>

  );
}