import { FeaturedProductsBlock, Product, Cta } from '@payload-types'
import React from 'react'
import { ContainedSection } from '@/components/layout/container-section'
import SectionHeading from '@/components/layout/section-heading'
import { ColorClasses, getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses'
import { CMSLink } from '@/components/payload/Link'
import { cn } from '@/lib/utils'
import { getPayloadClient } from '@/lib/payload'
import { extractIdsFromNullable } from '@/utilities/extractIds'

import CtaButtons from '@/components/common/cta-buttons';
import { CardContent } from '@/components/ui/card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Eye, Star, Package, Wrench } from 'lucide-react'
import PayloadImage from '@/components/PayloadImage'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

 // Determine grid columns based on product count
 const getGridClasses = (count: number) => {
  if (count >= 4) {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3";
  } else if (count === 3) {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  } else {
    return "grid-cols-1 sm:grid-cols-2";
  }
};

async function DefaultFeaturedProduct({ ...block }: FeaturedProductsBlock) {
  const { 
    bgc: backgroundColor,
    isTransparent,
    kicker,
    title,
    subtitle,
    ctas,
    products,
    idHref
  } = block;

  // Extract IDs and fetch data

  // Process color classes
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;
  const sectionId = idHref || 'featured-products';


  const allProductIds = products && products.length > 0 ? (products as Product[]).map((product) => product.id) : [];
  const payload = await getPayloadClient()
  const allProductPageIds = await payload.find({
    collection: 'product-pages',
    where: {
      products: {
        in: allProductIds
      }
    },
    limit: 20,
    select: {
      id: true,
      slug: true,
      products: true, // Include products field
    }
  })
  
  const populatedProducts = products && products.length > 0 ? (products as Product[]).map((product) => {
    // Since products is a single relationship (hasMany: false), we check if it matches
    const productPage = allProductPageIds.docs.find((page) => {
      // Handle both populated object and ID cases
      const pageProductId = typeof page.products === 'object' && page.products !== null 
        ? page.products.id 
        : page.products;
      return pageProductId === product.id;
    });
    return {
      ...product,
    }
  }) : []

  return (
    <ContainedSection
      id={sectionId}
      overlayClassName={overlayClass}
      verticalPadding="xl"
      padding="lg"
      maxWidth="7xl"
    >
      {/* Section Header */}
      {/* <div className="text-center mb-12">
        {kicker && (
          <p className={cn("text-sm font-medium uppercase tracking-wide mb-2")}>
            {kicker}
          </p>
        )}
        {title && (
          <SectionHeading 
            title={title}
            className="mb-4"
          />
        )}
        {subtitle && (
          <p className={cn("text-lg opacity-80 max-w-2xl mx-auto")}>
            {subtitle}
          </p>
        )}
      </div> */}
   <header className='mb-12'>
  <h1 className='text-left text-4xl font-bold mb-4'>Čistilne naprave ROTO EcoBox in RoEco</h1>
  <p className='text-left text-lg mb-4'>
    Izberite med modeli <strong>EcoBox</strong> in <strong>RoEco</strong> blagovne znamke <strong>ROTO Eco</strong> – zanesljive rešitve za učinkovito čiščenje odpadne vode iz gospodinjstev.
  </p>
  <Separator />
</header>

      {/* Products Grid */}
      <ProductGrid 
        products={populatedProducts} 
        className="mb-12"
      />
     
      {/* CTA Buttons */}
      {ctas && ctas.length > 0 && (
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <CtaButtons ctas={ctas as Cta[]} variant='default' />
          </div>
        </div>
      )}
    </ContainedSection>
  );
}

const formatPrice = (price?: number | null): string|undefined => {
  if (!price) return undefined
  return new Intl.NumberFormat('sl-SI', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(price);
};

interface ProductCardProps {
  product: Product & { slug?: string | null };
  className?: string;
  
}

export function ProductCard({ product, className }: ProductCardProps) {
  const productUrl = product.slug ? `/trgovina/${product.slug}` : "/trgovina"
  const isNew = false; // You can implement logic to determine if product is new
  const formattedPrice = formatPrice(product.price);
  
  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      "border border-gray-200 bg-white",
      className
    )}>
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {product.image && typeof product.image === 'object' && (
          <PayloadImage
            image={product.image}
            alt={product.title || 'Product image'}
            aspectRatio="square"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <Badge variant="secondary" className="bg-green-500 text-white">
              Novo
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive">
              Ni na zalogi
            </Badge>
          )}
          {product.mountingIncluded && (
            <Badge variant="outline" className="bg-white/90 text-xs">
              <Wrench className="w-3 h-3 mr-1" />
              Montaža vključena
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 hover:bg-white p-2"
            asChild
          >
            <Link href={productUrl}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Product Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={productUrl} className="hover:underline">
                {product.title}
              </Link>
            </h3>
          </div>
          
          {/* Manufacturer & SKU */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{product.manufacturer}</span>
            {product.sku && (
              <>
                <span>•</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {product.sku}
                </span>
              </>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          {/* Key Highlights */}
          {/* {product.highlights && product.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.highlights.slice(0, 3).map((highlight, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs py-0 px-2"
                >
                  {highlight.highlight}
                </Badge>
              ))}
              {product.highlights.length > 3 && (
                <Badge variant="outline" className="text-xs py-0 px-2">
                  +{product.highlights.length - 3}
                </Badge>
              )}
            </div>
          )} */}

          {/* Rating */}
          {/* {product.rating && product.rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating || 0)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating.toFixed(1)} ({product.ratingCount && product.ratingCount || 0})
              </span>
            </div>
          )} */}
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="space-y-1">
            {formattedPrice && <p className="text-md font-bold text-primary">
              {formattedPrice}
            </p>}
            {product.price && (
              <p className="text-xs text-gray-500">
                + montaža in dostava
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
className='w-full'
              size="sm"
              asChild
            >
              <Link href={productUrl}>
                {/* <Eye className="w-4 h-4 mr-1" /> */}
                <ShoppingCart className="w-4 h-4 mr-1" />

                Oglej izdelek
              </Link>
            </Button>
            
            {/* <Button 
              size="sm"
              disabled={!product.inStock}
              className={cn(
                product.inStock 
                  ? "bg-primary hover:bg-primary/90" 
                  : "bg-gray-300 cursor-not-allowed"
              )}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {product.inStock ? 'Povpraši' : 'Ni na zalogi'}
            </Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductGridProps {
  products: (Product & { slug?: string | null })[];
  className?: string;
  
}

export function ProductGrid({ products, className }: ProductGridProps) {
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
      // Responsive grid
      getGridClasses(products.length),

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
          
        />
      ))}
    </div>
  );
}

export default DefaultFeaturedProduct