import { ProductVariant, Product } from "@payload-types"

// Generic variant attribute interface
export interface VariantAttribute {
  name: string
  label: string
  values: string[]
  required?: boolean
}

// Generic variant selection interface
export interface VariantSelection {
  [attributeName: string]: string | undefined
}

// Get variant attribute value from the new dynamic structure
function getVariantAttributeValue(variant: ProductVariant, attributeName: string): string | null | undefined {
  console.log(`[variants] Getting attribute '${attributeName}' from variant:`, { 
    variantSku: variant.variantSku, 
    hasVariantOptions: !!variant.variantOptions 
  })
  
  // Get value from variantOptions array
  if (variant.variantOptions && Array.isArray(variant.variantOptions)) {
    const option = variant.variantOptions.find(opt => opt.name === attributeName)
    const value = option?.value
    console.log(`[variants] Found value '${value}' for attribute '${attributeName}'`)
    return value || null
  }
  
  console.log(`[variants] No variantOptions array found or attribute '${attributeName}' not found`)
  return null
}

/**
 * Extract unique values for a specific variant attribute
 */
export function getUniqueValuesForAttribute(
  variants: ProductVariant[], 
  attributeName: string
): string[] {
  console.log(`[variants] Extracting unique values for attribute '${attributeName}' from ${variants.length} variants`)
  
  const values = variants
    .map(variant => {
      const value = getVariantAttributeValue(variant, attributeName)
      return value
    })
    .filter((value): value is string => Boolean(value && typeof value === 'string' && value.trim()))
  
  const uniqueValues = [...new Set(values)]
  console.log(`[variants] Found ${uniqueValues.length} unique values for '${attributeName}':`, uniqueValues)
  
  return uniqueValues
}

/**
 * Get all variant attributes with their possible values using parent product's variantOptionTypes
 */
export function getVariantAttributes(variants: ProductVariant[], product: Product): VariantAttribute[] {
  console.log(`[variants] Getting variant attributes from ${variants.length} variants using product variantOptionTypes`)
  
  if (!variants.length) {
    console.log(`[variants] No variants provided, returning empty attributes`)
    return []
  }

  if (!product.variantOptionTypes || !Array.isArray(product.variantOptionTypes)) {
    console.warn(`[variants] Product has no variantOptionTypes defined, returning empty attributes`)
    return []
  }

  const attributes: VariantAttribute[] = []

  // For each defined variant option type in the parent product
  product.variantOptionTypes.forEach(optionType => {
    if (!optionType.name) {
      console.warn(`[variants] Variant option type missing name, skipping`)
      return
    }

    // Collect all unique values for this attribute from variants
    const valuesSet = new Set<string>()
    
    variants.forEach(variant => {
      if (variant.variantOptions && Array.isArray(variant.variantOptions)) {
        const option = variant.variantOptions.find(opt => opt.name === optionType.name)
        if (option && option.value && option.value.trim()) {
          valuesSet.add(option.value.trim())
        }
      }
    })

    const values = Array.from(valuesSet).sort()
    
    if (values.length > 0) {
      console.log(`[variants] Found attribute '${optionType.name}' with ${values.length} values:`, values)
      
      attributes.push({
        name: optionType.name,
        label: optionType.label || optionType.name, // Use label from product, fallback to name
        values,
      })
    } else {
      console.log(`[variants] No values found for attribute '${optionType.name}', skipping`)
    }
  })

  console.log(`[variants] Found ${attributes.length} total attributes`)
  return attributes
}

/**
 * Find variant by generic attribute selection
 */
export function findVariantByAttributes(
  variants: ProductVariant[],
  selection: VariantSelection
): ProductVariant | null {
  console.log(`[variants] Finding variant by attributes:`, selection)
  
  if (!variants.length || Object.keys(selection).length === 0) {
    console.log(`[variants] No variants or empty selection, returning null`)
    return null
  }

  const variant = variants.find(variant => {
    const matches = Object.entries(selection).every(([attributeName, selectedValue]) => {
      if (!selectedValue) {
        console.log(`[variants] Skipping empty selection for '${attributeName}'`)
        return true // Skip undefined/empty selections
      }
      
      const variantValue = getVariantAttributeValue(variant, attributeName)
      const isMatch = variantValue === selectedValue
      
      console.log(`[variants] Checking '${attributeName}': variant='${variantValue}', selected='${selectedValue}', match=${isMatch}`)
      return isMatch
    })
    
    if (matches) {
      console.log(`[variants] Found matching variant:`, variant.variantSku)
    }
    
    return matches
  })

  const result = variant || null
  console.log(`[variants] Search result:`, result ? result.variantSku : 'null')
  return result
}

/**
 * Parse variant selection from searchParams using parent product's variantOptionTypes
 */
export function parseVariantSelectionFromSearchParams(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  product: Product
): VariantSelection {
  if (!searchParams) {
    return {}
  }

  if (!product.variantOptionTypes || !Array.isArray(product.variantOptionTypes)) {
    console.warn(`[variants] Product has no variantOptionTypes defined for search params parsing`)
    return {}
  }

  const selection: VariantSelection = {}

  product.variantOptionTypes.forEach(optionType => {
    if (optionType.name) {
      const paramValue = searchParams[optionType.name]
      if (paramValue) {
        selection[optionType.name] = Array.isArray(paramValue) ? paramValue[0] : paramValue
      }
    }
  })

  return selection
}

/**
 * Build URL query string from variant selection
 */
export function buildVariantQueryString(selection: VariantSelection): string {
  const params = new URLSearchParams()
  
  Object.entries(selection).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    }
  })
  
  return params.toString()
}

/**
 * Validate that variant selection matches parent product's available option types
 */
export function validateVariantSelection(
  selection: VariantSelection,
  product: Product
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!product.variantOptionTypes || !Array.isArray(product.variantOptionTypes)) {
    return {
      isValid: Object.keys(selection).length === 0,
      errors: Object.keys(selection).length > 0 ? ['Product has no variant option types defined'] : []
    }
  }

  const allowedOptionNames = product.variantOptionTypes.map(t => t.name).filter(Boolean)

  Object.keys(selection).forEach(selectedOptionName => {
    if (!allowedOptionNames.includes(selectedOptionName)) {
      errors.push(`Invalid variant option "${selectedOptionName}". Allowed options: ${allowedOptionNames.join(', ')}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}


/**
 * Parse selected variant from searchParams (legacy SKU-based method)
 */
export function parseSelectedVariant(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  variants: ProductVariant[]
): ProductVariant | null {
  if (!searchParams || !variants.length) {
    return null
  }

  // Use legacy SKU approach for backward URL compatibility
  const variantSku = searchParams.variantSku
  const skuValue = Array.isArray(variantSku) ? variantSku[0] : variantSku
  
  if (!skuValue || typeof skuValue !== 'string') {
    return null
  }

  const selectedVariant = variants.find(variant => variant.variantSku === skuValue)
  
  if (!selectedVariant) {
    console.warn(`Invalid variant SKU: ${skuValue}`)
    return null
  }

  return selectedVariant
}

/**
 * Merge variant data with base product data
 * Using generic type to maintain compatibility with existing Product types
 */
export function mergeVariantWithProduct<T>(
  baseProduct: T, 
  selectedVariant: ProductVariant | null
): T {
  console.log(`[variants] Merging variant with product:`, {
    hasVariant: !!selectedVariant,
    variantSku: selectedVariant?.variantSku
  })
  
  if (!selectedVariant) {
    console.log(`[variants] No variant selected, returning base product`)
    return baseProduct
  }

  // Handle variant image with proper type checking for union types
  const baseProductAny = baseProduct as any
  let variantImage = baseProductAny.image
  
  if (selectedVariant.image) {
    console.log(`[variants] Variant has image, checking type:`, typeof selectedVariant.image)
    
    // Handle Payload's union type: number | Media
    if (typeof selectedVariant.image === 'number') {
      console.log(`[variants] Variant image is ID (number):`, selectedVariant.image)
      // Keep the ID - the consuming code will need to handle this
      variantImage = selectedVariant.image
    } else if (typeof selectedVariant.image === 'object' && selectedVariant.image !== null) {
      // It's a populated Media object
      const mediaObject = selectedVariant.image as { url?: string }
      if (mediaObject.url) {
        console.log(`[variants] Variant image is populated Media object with URL`)
        variantImage = selectedVariant.image
      } else {
        console.log(`[variants] Variant image is object but no URL, keeping base image`)
      }
    }
  }

  const mergedProduct = {
    ...baseProduct,
    // Override with variant-specific data
    price: selectedVariant.price ?? baseProductAny.price,
    inStock: selectedVariant.inStock,
    sku: selectedVariant.variantSku,
    image: variantImage,
  } as T
  
  console.log(`[variants] Merged product created with variant data`)
  return mergedProduct
}