import React, { forwardRef } from 'react';
import { Media } from '@payload-types';
import { cn } from '@/lib/utils';
import { 
  generateSrcSet, 
  generateSizesAttribute, 
  getOptimizedImageUrl, 
  type ImageUsageContext 
} from '@/lib/payload-image-utils';

interface PayloadImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> {
  image: Media;
  alt?: string;
  priority?: boolean;
  sizes?: string;
  context?: ImageUsageContext;
  className?: string;
  aspectRatio?: 'auto' | 'square' | '4/3' | '16/9' | '3/2';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholder?: boolean;
}

export const PayloadImage = forwardRef<HTMLImageElement, PayloadImageProps>(({
  image,
  alt,
  priority = false,
  sizes,
  context = 'card',
  className,
  aspectRatio = 'auto',
  objectFit = 'cover',
  placeholder = true,
  ...props
}, ref) => {
  if (!image || typeof image !== 'object') {
    console.warn('PayloadImage: Invalid image object provided');
    return null;
  }

  // Use utility functions for generating responsive image attributes
  const srcSet = generateSrcSet(image);
  const sizesAttr = sizes || generateSizesAttribute(context);
  const src = getOptimizedImageUrl(image, context === 'thumbnail' ? 'thumbnail' : 'card');

  const aspectRatioClasses = {
    auto: '',
    square: 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    '3/2': 'aspect-[3/2]',
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  return (
    <img
      ref={ref}
      src={src}
      srcSet={srcSet}
      sizes={sizesAttr}
      alt={alt || image.alt || ''}
      className={cn(
        'block w-full h-auto',
        aspectRatioClasses[aspectRatio],
        objectFitClasses[objectFit],
        className
      )}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
    />
  );
});

PayloadImage.displayName = 'PayloadImage';

export default PayloadImage; 