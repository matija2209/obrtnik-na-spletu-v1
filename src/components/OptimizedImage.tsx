import React, { CSSProperties } from 'react';
import { ImageInput } from '@/utilities/images/getImageUrl';
import { HighQualityMedia, Media } from '@payload-types';
import PayloadImage from '@/components/PayloadImage';

interface OptimizedImageProps {
  image: ImageInput;
  alt?: string;
  preferredSize?: keyof NonNullable<Media['sizes']> | keyof NonNullable<HighQualityMedia['sizes']>;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number; // Ignored - Payload already optimizes
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string; // Ignored - PayloadImage uses base64Preview
  fallback?: string; // Handled automatically
  onClick?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage Component
 * 
 * A high-performance wrapper around PayloadImage that leverages Payload's
 * pre-optimized WebP images. Now uses native img with responsive srcset
 * instead of Next.js Image optimization.
 * 
 * @param image - Payload Media object or image input
 * @param alt - Override alt text (falls back to Media.alt)
 * @param preferredSize - Preferred image size (for backward compatibility)
 * @param priority - Whether to load image with high priority (above fold)
 * @param fill - Make image fill container with proper object-fit
 * @param sizes - Responsive sizes string
 * @param className - CSS classes
 * @param style - Inline styles
 * @param quality - Ignored (Payload already optimizes)
 * @param placeholder - Enable/disable blur placeholder
 * @param blurDataURL - Ignored (PayloadImage uses base64Preview)
 * @param fallback - Ignored (handled automatically)
 */
export function OptimizedImage({
  image,
  alt,
  preferredSize = 'card',
  className,
  style,
  priority = false,
  fill = false,
  sizes,
  quality, // Ignored
  placeholder = 'blur',
  blurDataURL, // Ignored
  fallback, // Ignored
  onClick,
  onError,
  ...props
}: OptimizedImageProps) {
  // Convert ImageInput to Media/HighQualityMedia if needed
  if (!image || typeof image !== 'object' || typeof image === 'number') {
    return (
      <img
        src="/no-image.svg"
        alt={alt || 'Image not found'}
        className={className}
        style={style}
        onClick={onClick}
        onError={onError}
        {...props}
      />
    );
  }

  // Handle array inputs (take first image)
  if (Array.isArray(image)) {
    const firstImage = image[0];
    if (!firstImage || typeof firstImage !== 'object') {
      return (
        <img
          src="/no-image.svg"
          alt={alt || 'Image not found'}
          className={className}
          style={style}
          onClick={onClick}
          onError={onError}
          {...props}
        />
      );
    }
    return (
      <PayloadImage
        image={firstImage as Media}
        alt={alt}
        priority={priority}
        sizes={sizes}
        className={fill ? `absolute inset-0 w-full h-full ${className || ''}` : className}
        style={style}
        aspectRatio="auto"
        objectFit="cover"
        placeholder={placeholder === 'blur'}
        onClick={onClick}
        onError={onError}
        {...props}
      />
    );
  }

  return (
    <PayloadImage
      image={image as Media }
      alt={alt}
      priority={priority}
      sizes={sizes}
      className={fill ? `absolute inset-0 w-full h-full ${className || ''}` : className}
      style={style}
      aspectRatio="auto"
      objectFit="cover"
      placeholder={placeholder === 'blur'}
      onClick={onClick}
      onError={onError}
      {...props}
    />
  );
}

export default OptimizedImage; 