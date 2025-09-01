import { FeaturedProductsBlock, ProductVariant } from '@payload-types'
import React from 'react'
import { ContainedSection } from '@/components/layout/container-section'
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses'
import { cn } from '@/lib/utils'
import CtaButtons from '@/components/common/cta-buttons'
import { extractIdsFromNullable } from '@/utilities/extractIds'
import { getProductsWithSlugs, getProductVariants } from '@/lib/payload'
import { ProductGrid } from '@/components/product/product-grid'


async function DefaultFeaturedProduct({ ...block }: FeaturedProductsBlock) {
  const { 
    colourScheme,
    bgColor: backgroundColor,
    isTransparent,
    kicker,
    title,
    subtitle,
    ctas,
    products: rawProducts,
    idHref
  } = block;

  // Process color classes
  const colorClasses = getColorClasses((colourScheme as ColorScheme) || 'primary');
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;
  const sectionId = idHref || 'featured-products';

  // Extract IDs and fetch products with slugs
  const productIds = extractIdsFromNullable(rawProducts);
  let populatedProducts = productIds.length > 0 ? await getProductsWithSlugs(productIds) : [];

  // Handle case where no populated products exist
  if (populatedProducts.length === 0) {
    return null; // Don't render anything if no products
  }

  // Fetch variants for products that have them
  const finalProducts = await Promise.all(
    populatedProducts.map(async (product) => {
      let variants: ProductVariant[] = []
      if (product.hasVariants) {
        variants = await getProductVariants(String(product.id))
      }
      return {
        ...product,
        variants
      }
    })
  )

  return (
    <ContainedSection
      id={sectionId}
      overlayClassName={overlayClass}
      verticalPadding="xl"
      padding="lg"
      maxWidth="7xl"
    >
      {/* Section Header */}
      <div className="text-left mb-12">
        {kicker && (
          <p className={cn("text-sm font-medium uppercase tracking-wide mb-3 text-primary")}>
            {kicker}
          </p>
        )}
        {title && (
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className={cn("text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl")}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Products Grid */}
      <ProductGrid 
        products={finalProducts} 
        colorClasses={colorClasses}
        className="mb-12"
      />
     
      {/* CTA Buttons */}
      {ctas && ctas.length > 0 && (
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <CtaButtons ctas={ctas} variant='default' />
          </div>
        </div>
      )}
    </ContainedSection>
  );
}




export default DefaultFeaturedProduct