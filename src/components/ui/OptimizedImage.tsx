import React, { CSSProperties } from 'react';
import PayloadImage from '@/components/ui/PayloadImage';
import { ImageInput, getImageUrl, getImageDimensions } from '@/utilities/images/getImageUrl';
import getImageAlt from '@/utilities/images/getImageAlt';
import { Media } from '@payload-types';

interface OptimizedImageProps {
  image: ImageInput;
  alt?: string;
  preferredSize?: keyof NonNullable<Media['sizes']>;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fallback?: string;
  onClick?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage Component
 * 
 * A wrapper around Next.js Image component that automatically handles:
 * - Image URL extraction from Payload Media objects
 * - Dimension extraction for proper aspect ratios
 * - Alt text extraction
 * - Responsive image sizing
 * - WebP/AVIF optimization
 * 
 * @param image - Payload Media object or image input
 * @param alt - Override alt text (falls back to Media.alt)
 * @param preferredSize - Preferred image size from Media.sizes
 * @param priority - Whether to load image with high priority (above fold)
 * @param fill - Whether image should fill its container
 * @param sizes - Responsive sizes string for better loading
 * @param className - CSS classes
 * @param style - Inline styles
 * @param quality - Image quality (1-100)
 * @param placeholder - Placeholder type while loading
 * @param blurDataURL - Base64 blur placeholder
 * @param fallback - Custom fallback image URL
 */
export function OptimizedImage({
  image,
  alt,
  preferredSize = 'card',
  className,
  style,
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
  placeholder = 'empty',
  blurDataURL,
  fallback = '/no-image.svg',
  onClick,
  onError,
  ...props
}: OptimizedImageProps) {
  const imageUrl = getImageUrl(image, preferredSize, fallback);
  const dimensions = getImageDimensions(image, preferredSize);
  
  // Extract alt text from image object if not provided
  const altText = alt || getImageAlt(image, 'Image');

  // For fill mode, check if we have a Media object
  if (fill) {
    if (typeof image === 'object' && image !== null && 'sizes' in image) {
      // Use PayloadImage for Media objects with background context for fill mode
      return (
        <PayloadImage
          image={image as Media}
          alt={altText}
          context="background"
          className={`object-cover ${className || ''}`}
          style={{ ...style, position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          onClick={onClick}
          onError={onError}
          {...props}
        />
      );
    } else {
      // Fallback to native img for string URLs in fill mode
      return (
        <img
          src={imageUrl}
          alt={altText}
          className={`object-cover ${className || ''}`}
          style={{ ...style, position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          loading={priority ? 'eager' : 'lazy'}
          onClick={onClick}
          onError={onError}
          {...props}
        />
      );
    }
  }

  if (!dimensions) {
    // Fallback dimensions based on preferred size
    const fallbackDimensions = {
      thumbnail: { width: 300, height: 300 },
      card: { width: 640, height: 480 },
      tablet: { width: 1024, height: 768 },
    };

    const defaultDimensions = fallbackDimensions[preferredSize] || fallbackDimensions.card;

    // For fallback dimensions, check if we have a Media object
    if (typeof image === 'object' && image !== null && 'sizes' in image) {
      return (
        <PayloadImage
          image={image as Media}
          alt={altText}
          context={preferredSize === 'thumbnail' ? 'thumbnail' : 'card'}
          className={className}
          style={style}
          priority={priority}
          onClick={onClick}
          onError={onError}
          {...props}
        />
      );
    } else {
      // Fallback to native img for string URLs
      return (
        <img
          src={imageUrl}
          alt={altText}
          width={defaultDimensions.width}
          height={defaultDimensions.height}
          className={className}
          style={style}
          loading={priority ? 'eager' : 'lazy'}
          onClick={onClick}
          onError={onError}
          {...props}
        />
      );
    }
  }

  // For known dimensions, check if we have a Media object
  if (typeof image === 'object' && image !== null && 'sizes' in image) {
    return (
      <PayloadImage
        image={image as Media}
        alt={altText}
        context={preferredSize === 'thumbnail' ? 'thumbnail' : 'card'}
        className={className}
        style={style}
        priority={priority}
        onClick={onClick}
        onError={onError}
        {...props}
      />
    );
  } else {
    // Fallback to native img for string URLs
    return (
      <img
        src={imageUrl}
        alt={altText}
        width={dimensions.width}
        height={dimensions.height}
        className={className}
        style={style}
        loading={priority ? 'eager' : 'lazy'}
        onClick={onClick}
        onError={onError}
        {...props}
      />
    );
  }
}

export default OptimizedImage; 