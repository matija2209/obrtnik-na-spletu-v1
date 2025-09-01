import React from 'react';
import PayloadImage from '@/components/ui/PayloadImage';
import { getImageUrl } from '@/utilities/images/getImageUrl';
import { Product } from '@payload-types';

interface ProductImageProps {
  product: Product;
}

export function ProductImage({ product }: ProductImageProps) {
  const imageUrl = getImageUrl(product.image) || '/api/placeholder/600/600';
  
  return (
    <div className="md:col-span-3 bg-gray-50 flex items-center justify-center p-4 min-h-[300px] md:min-h-[400px]">
      <div className="relative h-full w-full flex items-center justify-center">
        {product.image && typeof product.image === 'object' ? (
          <PayloadImage
            image={product.image}
            alt={product.title || 'Slika izdelka'}
            className="w-full h-auto max-w-[600px] max-h-[600px] object-contain rounded-md"
            context="card"
            priority
          />
        ) : (
          <img
            src={imageUrl}
            alt={product.title || 'Slika izdelka'}
            className="w-full h-auto max-w-[600px] max-h-[600px] object-contain rounded-md"
            loading="eager"
            decoding="async"
          />
        )}
      </div>
    </div>
  );
} 