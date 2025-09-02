import { Product, ProductVariant, Collection } from '@payload-types'
import React from 'react'
import { ColorClasses } from '@/utilities/getColorClasses'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Eye, Wrench } from 'lucide-react'
import { getImageUrl } from '@/utilities/images/getImageUrl'
import getImageAlt from '@/utilities/images/getImageAlt'
import PayloadImage from '@/components/PayloadImage'
import Link from 'next/link'
import { 
  getCollectionType,
  isTlakovciProduct,
  getCtaText,
  getRelevantTechnicalSpecs,
  getCollectionBadgeColor
} from '@/utilities/productDisplay'
import { VariantOptionsDisplay } from '@/components/product/variant-options-display'
import { formatPrice } from '@/utilities/format-price'
import { getProductUrl } from '@/utilities/product-url'

interface ProductCardProps {
  product: Product & { slug?: string | null; variants?: ProductVariant[] };
  className?: string;
  colorClasses?: ColorClasses;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, className, colorClasses, variant = 'default' }: ProductCardProps) {
  const collectionSlug = (product.collection as Collection).slug
  const collectionType = getCollectionType(product)
  const isTlakovci = isTlakovciProduct(product)
  const ctaText = getCtaText(product)
  const relevantSpecs = getRelevantTechnicalSpecs(product, 2)
  
  const imageUrl = getImageUrl(product.image);
  const productUrl = getProductUrl(product.slug)
  const imageAlt = getImageAlt(product.image);
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
        {product.image && typeof product.image === 'object' ? (
          <PayloadImage
            image={product.image}
            alt={imageAlt || product.title || 'Product image'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            context="card"
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt || product.title || 'Product image'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : null}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Collection Type Badge */}
          {collectionType !== 'other' && (
            <Badge 
              variant="outline" 
              className={cn("text-xs font-medium", getCollectionBadgeColor(product))}
            >
              {collectionType === 'tlakovci' ? 'Tlakovci' : 'Čistilne naprave'}
            </Badge>
          )}
          
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
          
          {/* Manufacturer */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{product.manufacturer}</span>
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          {/* Variant Options Display for Tlakovci */}
          {isTlakovci && product.variants && product.variants.length > 0 && (
            <VariantOptionsDisplay 
              product={product}
              variants={product.variants}
              className="mt-2"
            />
          )}

          {/* Technical Specs */}
          {relevantSpecs.length > 0 && (
            <div className="space-y-1">
              {relevantSpecs.map((spec, index) => (
                <div key={index} className="flex justify-between text-xs text-gray-500">
                  <span className="font-medium">{spec.label}:</span>
                  <span>{spec.value}</span>
                </div>
              ))}
            </div>
          )}
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
                <ShoppingCart className="w-4 h-4 mr-1" />
                {ctaText}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}