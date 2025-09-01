import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '@payload-types';
    

export default function ProductInfo({ product }: { product: Product }) {
    return (
        <>
            {/* Reviews Section */}
            <div className="flex items-center gap-2 mt-2 mb-4">
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < (product.rating ?? 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                    ))}
                </div>
                {product.rating != null && (
                    <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                )}
                {product.ratingCount != null && (
                    <span className="text-sm text-gray-500">({product.ratingCount} ocen)</span>
                )}
                {/* Fallback if no ratings */}
                {(product.rating == null || product.ratingCount == null) && (
                    <span className="text-sm text-gray-500">Ocene niso na voljo</span>
                )}
            </div>
            {/* Short Description */}
            {product.shortDescription && (
                <p className="text-gray-600 mb-6">{product.shortDescription}</p>
            )}
        </>
    );
} 