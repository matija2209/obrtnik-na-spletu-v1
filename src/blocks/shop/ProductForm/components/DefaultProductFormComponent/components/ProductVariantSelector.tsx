"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { 
  getVariantAttributes, 
  findVariantByAttributes,
  buildVariantQueryString,
  type VariantSelection
} from '@/lib/variants'
import { ProductVariant, Product } from '@payload-types'

interface ProductVariantSelectorProps {
  variants: ProductVariant[]
  currentSelection: VariantSelection
  product: Product
}

export default function ProductVariantSelector({ 
  variants, 
  currentSelection,
  product
}: ProductVariantSelectorProps) {
  const router = useRouter()

  // Extract all available variant attributes dynamically using parent product
  const availableAttributes = getVariantAttributes(variants, product)

  const updateURL = (newSelection: VariantSelection) => {
    const currentPath = window.location.pathname
    const queryString = buildVariantQueryString(newSelection)
    const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath
    
    router.push(newUrl)
  }

  const handleAttributeChange = (attributeName: string, value: string) => {
    const newSelection = { ...currentSelection }
    
    if (value === '') {
      delete newSelection[attributeName]
    } else {
      newSelection[attributeName] = value
    }
    
    updateURL(newSelection)
  }

  // Check if current selection results in a valid variant
  const currentVariant = findVariantByAttributes(variants, currentSelection)
  const isValidCombination = currentVariant !== null
  const isOutOfStock = currentVariant && !currentVariant.inStock

  // Don't show selector if no variant attributes exist
  if (availableAttributes.length === 0) {
    // Show helpful message if product should have variants but no attributes are found
    if (product.hasVariants && variants.length > 0) {
      return (
        <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
          <p>This product has variants but no variant option types are configured.</p>
          <p className="text-xs mt-1">Please configure variant option types in the product settings.</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      {/* Dynamic Attribute Selectors */}
      {availableAttributes.map((attribute) => (
        <div key={attribute.name} className="space-y-2">
          <label className="text-sm font-medium">
            {attribute.label}:
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                aria-label={`Izberi ${attribute.label.toLowerCase()}`}
              >
                <span className="truncate">
                  {currentSelection[attribute.name] || `Izberi ${attribute.label.toLowerCase()}`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
              <DropdownMenuLabel>
                Dostopne {attribute.label.toLowerCase()}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuRadioGroup 
                value={currentSelection[attribute.name] || ""}
                onValueChange={(value) => handleAttributeChange(attribute.name, value)}
              >
                <DropdownMenuRadioItem value="">
                  Brez izbire
                </DropdownMenuRadioItem>
                
                {attribute.values.map((value) => (
                  <DropdownMenuRadioItem 
                    key={value} 
                    value={value}
                  >
                    {value}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}

      {/* Selection Status */}
      {Object.keys(currentSelection).length > 0 && (
        <div className="text-sm">
          {!isValidCombination && (
            <div className="text-muted-foreground bg-muted p-2 rounded">
              Ta kombinacija ni na voljo
            </div>
          )}
          {isValidCombination && isOutOfStock && (
            <div className="text-orange-600 bg-orange-50 p-2 rounded">
              Izbrana varianta trenutno ni na zalogi
            </div>
          )}
          {isValidCombination && !isOutOfStock && currentVariant && (
            <div className="text-green-600 bg-green-50 p-2 rounded">
              <div className="font-medium">
                Varianta: {currentVariant.displayName}
              </div>
              {currentVariant.price && (
                <div className="text-sm">
                  Cena: €{currentVariant.price.toFixed(2)}
                </div>
              )}
              <div className="text-xs text-green-700 mt-1">
                SKU: {currentVariant.variantSku}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="text-xs text-gray-500">
          <summary>Debug Info (dev only)</summary>
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <div><strong>Available Attributes:</strong></div>
            <pre>{JSON.stringify(availableAttributes, null, 2)}</pre>
            <div><strong>Current Selection:</strong></div>
            <pre>{JSON.stringify(currentSelection, null, 2)}</pre>
            <div><strong>Current Variant:</strong></div>
            <pre>{JSON.stringify(currentVariant, null, 2)}</pre>
          </div>
        </details>
      )}
    </div>
  )
}