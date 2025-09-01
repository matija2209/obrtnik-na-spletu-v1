import React from 'react';
import { Product } from '@payload-types';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
      {product.shortDescription && (
        <p className="mt-2 text-gray-600">{product.shortDescription}</p>
      )}
      <div className="mt-4 flex items-baseline">
        <span className="text-2xl font-semibold text-gray-900">{product.price?.toFixed(2)} €</span>
      </div>
    </div>
  );
} 