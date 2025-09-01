import { ProductFormBlock, ProductVariant, Collection } from '@payload-types'
import React from 'react'
import { cn } from '@/lib/utils'
import { headers } from 'next/headers';

// Import layout components
import { ContainedSection } from '@/components/layout/container-section'
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses'

// Import product display components from existing folders
import ProductGallery from './components/product-components/ProductGallery'
import ProductInfo from './components/product-components/ProductInfo'
import { ProductSpecifications } from './components/order/ProductSpecifications'
import ProductFeatures from './components/product-components/ProductFeatures'

// Import order form components
import OrderForm from './components/order/OrderForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getImageUrl } from '@/utilities/images/getImageUrl'
import BreadcrumbComponent from '@/blocks/general/Hero/components/HeroSectionVariant7/breadcrumb'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import RichText from '@/components/payload/RichText'
import { extractId } from '@/utilities/extractIds'
import { getProductById } from '@/lib/payload'
import { 
  parseSelectedVariant, 
  mergeVariantWithProduct, 
  getVariantAttributes, 
  parseVariantSelectionFromSearchParams,
  findVariantByAttributes
} from '@/lib/variants'
import { getProductVariants } from '@/lib/payload'
import ProductVariantSelector from './components/ProductVariantSelector'

async function DefaultProductFormComponent(block: ProductFormBlock & { searchParams?: Record<string, string | string[] | undefined> }) {
  const { 
    product,
    colourScheme = 'primary',
    showTitle = true,
    showSku = false,
    showManufacturer = true,
    showType = true,
    showShortDescription = true,
    showLongDescription = false,
    showPricing = true,
    showAvailability = true,
    showMountingInfo = true,
    showTechnicalSpecs = false,
    showHighlights = true,
    showMainImage = true,
    showGallery = false,
    isTransparent,
    showReviews = true,
    showRating = true,
    showOrderForm = true,
    bgColor,
    ctaText = 'Pošljite povpraševanje',
    idHref,
    searchParams,
  } = block

  // Console log to test searchParams
  console.log('🔍 DefaultProductFormComponent searchParams:', searchParams)
  const headersList = await headers()
  const sectionId = idHref || 'product-form'

  // Extract product ID and fetch product data
  const productId = extractId(product);
  const productData = productId ? await getProductById(productId) : null;

  // Fetch variants if product has variants
  let variants: ProductVariant[] = []
  let selectedVariant:ProductVariant|null = null
  let mergedProductData = productData
  let variantSelection = {}

  if (productData && productData.hasVariants) {
    variants = await getProductVariants(String(productData.id))
    selectedVariant = parseSelectedVariant(searchParams, variants)
    
    // Parse variant selection from URL for the generic selector
    const availableAttributes = getVariantAttributes(variants, productData)
    variantSelection = parseVariantSelectionFromSearchParams(searchParams, productData)
    
    // Find variant from generic selector (this takes precedence over legacy SKU method)
    const variantFromSelection = findVariantByAttributes(variants, variantSelection)
    
    // Use generic selector result if available, otherwise fall back to legacy SKU method
    const currentlySelectedVariant = variantFromSelection || selectedVariant
    
    // Update selectedVariant to be the currently selected one
    selectedVariant = currentlySelectedVariant
    mergedProductData = mergeVariantWithProduct(productData, selectedVariant)
  }

  // Handle case where product doesn't exist or wasn't found
  if (!mergedProductData) {
    return (
      <ContainedSection
        overlayClassName="bg-background"
        verticalPadding="xl"
        padding="lg"
        maxWidth="7xl"
      >
        <div className="text-center">
          <p className="text-muted-foreground">Izdelek ni na voljo ali ni bil najden.</p>
        </div>
      </ContainedSection>
    )
  }

  const colorClasses = getColorClasses((colourScheme as ColorScheme) || 'primary')
  const backgroundClass = isTransparent ? "bg-transparent" : getBackgroundClass(bgColor as any)

  return (
    <ContainedSection
      id={sectionId}
      overlayClassName={backgroundClass}
      verticalPadding="xl"
      padding="lg"
      maxWidth="7xl"
    >
      <div className="mb-4">
        <BreadcrumbComponent crumbs={[
          { title: (mergedProductData.collection as Collection).title , href: `/kolekcija/${(mergedProductData.collection as Collection).slug}` },
          { title: mergedProductData.title, href: `/izdelek/${mergedProductData.id}` }
        ]} className='text-dark'/>
      </div>
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        
        {/* Product Images Section */}
        <div className="space-y-6">
          {showMainImage && (
            <ProductGallery 
              product={mergedProductData}
              variants={variants}
              selectedVariant={selectedVariant}
            />
          )}
        </div>

        {/* Product Information & Order Form Section */}
        <div className="space-y-6">
          {/* Main Product Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {mergedProductData.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Variant Selector */}
              {productData && productData.hasVariants && variants.length > 0 && (
                <ProductVariantSelector 
                  variants={variants} 
                  currentSelection={variantSelection}
                  product={productData}
                />
              )}
              
              {/* Basic Product Info */}
              <ProductInfo product={mergedProductData} />
              
              {/* Order CTA */}
              <Link href={`/narocilo?productId=${mergedProductData.id}${selectedVariant ? `&variantSku=${selectedVariant.variantSku}` : ''}`}>
                <Button 
                  className={cn(
                    "w-full",
                    colorClasses.primaryButtonClass
                  )}
                >
                  {ctaText ?? "Naroči"}
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-auto rounded-none border-b">
                  {showHighlights && mergedProductData.highlights && mergedProductData.highlights.length > 0 && (
                    <TabsTrigger value="highlights">Lastnosti</TabsTrigger>
                  )}
                  {showLongDescription && mergedProductData.longDescription && (
                    <TabsTrigger value="description">Opis</TabsTrigger>
                  )}
                  {showTechnicalSpecs && (
                    <TabsTrigger value="specs">Specifikacije</TabsTrigger>
                  )}
                </TabsList>
                
                {showHighlights && mergedProductData.highlights && mergedProductData.highlights.length > 0 && (
                  <TabsContent value="highlights" >
                    <ProductFeatures product={mergedProductData} />
                  </TabsContent>
                )}
                
                {showLongDescription && mergedProductData.longDescription && (
                  <TabsContent value="description" >
                    <div className="prose prose-sm max-w-none">
                      <RichText data={mergedProductData.longDescription} />
                    </div>
                  </TabsContent>
                )}
                
                {showTechnicalSpecs && (
                  <TabsContent value="specs" >
                    <ProductSpecifications product={mergedProductData} />
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContainedSection>
  )
}

export default DefaultProductFormComponent