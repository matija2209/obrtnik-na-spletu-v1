import React from 'react'
import { Product, ProductVariant } from '@payload-types'
import { getVariantAttributes } from '@/lib/variants'
import { Badge } from '@/components/ui/badge'

interface VariantOptionsDisplayProps {
  product: Product
  variants: ProductVariant[]
  className?: string
}

export function VariantOptionsDisplay({ 
  product, 
  variants, 
  className 
}: VariantOptionsDisplayProps) {
  if (!variants.length || !product.hasVariants) {
    return null
  }

  const attributes = getVariantAttributes(variants, product)
  
  if (attributes.length === 0) {
    return null
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {attributes.map((attr, attrIndex) => (
        <div key={attr.name} className="flex flex-wrap items-center gap-1">
          <span className="text-xs font-medium text-gray-600 mr-2">
            {attr.label}:
          </span>
          {attr.values.map((value, valueIndex) => (
            <Badge 
              key={`${attr.name}-${valueIndex}`}
              variant="outline" 
              className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-medium px-2 py-1"
            >
              {value}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  )
}