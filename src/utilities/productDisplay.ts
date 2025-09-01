import { Product, ProductVariant, Collection } from '@payload-types'
import { getVariantAttributes } from '@/lib/variants'

export type CollectionType = 'tlakovci' | 'cistilne-naprave' | 'other'

/**
 * Determine collection type from product
 */
export function getCollectionType(product: Product): CollectionType {
  const collection = product.collection as Collection
  if (!collection?.slug) return 'other'
  
  switch (collection.slug) {
    case 'tlakovci':
      return 'tlakovci'
    case 'cistilne-naprave':
      return 'cistilne-naprave'
    default:
      return 'other'
  }
}

/**
 * Check if product is tlakovci type
 */
export function isTlakovciProduct(product: Product): boolean {
  return getCollectionType(product) === 'tlakovci'
}

/**
 * Check if product is cistilne-naprave type
 */
export function isCistilneNapraveProduct(product: Product): boolean {
  return getCollectionType(product) === 'cistilne-naprave'
}

/**
 * Format variant options display for tlakovci products
 */
export function formatVariantOptionsDisplay(
  variants: ProductVariant[], 
  product: Product
): string | null {
  if (!variants.length || !product.hasVariants) {
    return null
  }

  const attributes = getVariantAttributes(variants, product)
  
  if (attributes.length === 0) {
    return null
  }

  // Format as "Available in: Color: Red, Blue, Green | Size: 10×10, 20×20" etc.
  const optionStrings = attributes.map(attr => 
    `${attr.label}: ${attr.values.join(', ')}`
  )
  
  return `Available in: ${optionStrings.join(' | ')}`
}

/**
 * Get collection-specific CTA text
 */
export function getCtaText(product: Product): string {
  const collectionType = getCollectionType(product)
  
  switch (collectionType) {
    case 'tlakovci':
      return product.hasVariants ? 'Izberite varianto' : 'Oglej izdelek'
    case 'cistilne-naprave':
      return 'Oglej izdelek'
    default:
      return 'Oglej izdelek'
  }
}

/**
 * Get collection-specific icon name for badges
 */
export function getCollectionIcon(product: Product): string | null {
  const collectionType = getCollectionType(product)
  
  switch (collectionType) {
    case 'tlakovci':
      return 'Package'
    case 'cistilne-naprave':
      return 'Wrench'
    default:
      return null
  }
}

/**
 * Get most relevant technical specs for display based on collection type
 */
export function getRelevantTechnicalSpecs(product: Product, maxCount: number = 3): Array<{label: string, value: string}> {
  if (!product.technicalSpecs || !Array.isArray(product.technicalSpecs)) {
    return []
  }

  const collectionType = getCollectionType(product)
  
  // Define priority specs for each collection type
  const prioritySpecs: Record<CollectionType, string[]> = {
    'tlakovci': ['dimenzije', 'dimensions', 'velikost', 'size', 'material', 'barva', 'color', 'debelina', 'thickness'],
    'cistilne-naprave': ['moč', 'power', 'kapaciteta', 'capacity', 'tlak', 'pressure', 'pretok', 'flow', 'dimenzije', 'dimensions'],
    'other': []
  }

  const priorities = prioritySpecs[collectionType] || []
  
  // Sort specs by priority, then take first maxCount
  const sortedSpecs = product.technicalSpecs.sort((a, b) => {
    const aIndex = priorities.findIndex(p => a.label?.toLowerCase().includes(p.toLowerCase()))
    const bIndex = priorities.findIndex(p => b.label?.toLowerCase().includes(p.toLowerCase()))
    
    // If both found in priorities, sort by priority order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }
    
    // If only one found in priorities, prioritize it
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    
    // If neither found in priorities, maintain original order
    return 0
  })

  return sortedSpecs
    .slice(0, maxCount)
    .filter(spec => spec.label && spec.value)
    .map(spec => ({
      label: spec.label!,
      value: spec.value!
    }))
}

/**
 * Get optimized grid classes based on product collection distribution
 */
export function getOptimizedGridClasses(products: Product[]): string {
  if (!products.length) return "grid-cols-1"
  
  const collectionCounts = products.reduce((acc, product) => {
    const collectionType = getCollectionType(product)
    acc[collectionType] = (acc[collectionType] || 0) + 1
    return acc
  }, {} as Record<CollectionType, number>)

  const totalCount = products.length
  const tlakovciCount = collectionCounts.tlakovci || 0
  const cistilneCount = collectionCounts['cistilne-naprave'] || 0

  // If mostly tlakovci (9 products), optimize for 3-column layout
  if (tlakovciCount >= 6 && totalCount >= 9) {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
  }
  
  // If mostly cistilne-naprave (4 products), optimize for 2-column layout
  if (cistilneCount >= 3 && totalCount <= 6) {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
  }
  
  // Mixed or other scenarios - use adaptive layout
  if (totalCount >= 4) {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
  } else if (totalCount === 3) {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  } else {
    return "grid-cols-1 sm:grid-cols-2"
  }
}

/**
 * Get collection-specific badge color scheme
 */
export function getCollectionBadgeColor(product: Product): string {
  const collectionType = getCollectionType(product)
  
  switch (collectionType) {
    case 'tlakovci':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'cistilne-naprave':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}