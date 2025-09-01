import { Product, ProductVariant } from '@payload-types'
import React from 'react'
import { ColorClasses } from '@/utilities/getColorClasses'
import { cn } from '@/lib/utils'
import { Package } from 'lucide-react'
import { getOptimizedGridClasses } from '@/utilities/productDisplay'
import { ProductCard } from './product-card'

interface ProductGridProps {
  products: (Product & { slug?: string | null; variants?: ProductVariant[] })[];
  className?: string;
  colorClasses?: ColorClasses;
  variant?: 'default' | 'compact';
}

export function ProductGrid({ products, className, colorClasses, variant = 'default' }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">Ni najdenih izdelkov.</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-6",
      // Optimized responsive grid based on collection types
      getOptimizedGridClasses(products),

      // Adjust for smaller grids with fewer products
      products.length === 1 && "max-w-sm mx-auto",
      products.length === 2 && "max-w-4xl mx-auto grid-cols-1 sm:grid-cols-2",
      products.length === 3 && "max-w-4xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      className
    )}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          colorClasses={colorClasses}
          variant={variant}
        />
      ))}
    </div>
  );
}