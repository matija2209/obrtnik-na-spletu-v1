import React from 'react';
import { Product } from '@payload-types';

interface OrderSummaryProps {
  product: Product;
  quantity: number;
}

export function OrderSummary({ product, quantity }: OrderSummaryProps) {
  const totalPrice = (product.price ? product.price * quantity : 0).toFixed(2);
  
  return (
    <div className="bg-gray-50 p-4 rounded-md space-y-2">
      <div className="flex justify-between text-sm">
        <span>Cena izdelka</span>
        <span>{product.price?.toFixed(2)} €</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Količina</span>
        <span>{quantity}x</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Dostava</span>
        <div>
          <span className="line-through text-gray-500 mr-2">40.00 €</span>
          <span className="font-medium text-green-600">0.00 €</span>
        </div>
      </div>
      <div className="flex justify-between font-semibold mt-3 pt-3 border-t">
        <span>Skupaj</span>
        <span>{totalPrice} €</span>
      </div>
      <div className="text-xs text-gray-500 text-center pt-1">
        (Vključuje 9.5% DDV)
      </div>
      <div className="text-xs text-gray-600 space-y-0.5 pt-2 text-center border-t mt-2">
        <div>Cena je fiksna.</div>
        <div>{product.mountingIncluded ? 'Osnovna montaža vključena.' : 'Montaža ni vključena.'}</div>
        <div>Brezplačna poštnina.</div>
      </div>
    </div>
  );
} 