import React from 'react'
import { cn } from '@/lib/utils'
import OptimizedImage from '@/components/OptimizedImage'
import { ImageInput } from '@/utilities/images/getImageUrl'
import { HighQualityMedia, Media } from '@payload-types'

interface ContainedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  id?: string
  sectionClassName?: string
  containerClassName?: string
  bgc?: string
  contentbgc?: string
  showGridLines?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'none'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  verticalPadding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  // Enhanced to support both optimized images and string URLs
  backgroundImage?: string | ImageInput
  backgroundImagePreferredSize?: keyof NonNullable<Media['sizes']> | keyof NonNullable<HighQualityMedia['sizes']>
  backgroundImageSizes?: string
  backgroundImagePriority?: boolean
  halfWidthImageOnDesktop?: boolean
  imagePosition?: 'left' | 'right'
  overlayClassName?: string
  style?: React.CSSProperties
}

function ContainedSection({
  children,
  className,
  id,
  sectionClassName = '',
  containerClassName = '',
  bgc = 'bg-primary',
  contentbgc,
  showGridLines = false,
  maxWidth = '7xl',
  padding = 'sm',
  verticalPadding = 'xl',
  backgroundImage = '',
  backgroundImagePreferredSize = 'tablet',
  backgroundImageSizes = '100vw',
  backgroundImagePriority = false,
  halfWidthImageOnDesktop = false,
  imagePosition = 'right',
  overlayClassName,
  style,
  ...props
}: ContainedSectionProps) {
  // Map padding options to Tailwind classes
  const paddingMap = {
    none: 'px-2 ',
    sm: 'px-2 sm:px-4',
    md: 'px-2 sm:px-6 lg:px-8',
    lg: 'px-2 sm:px-6 lg:px-12',
    xl: 'px-2 sm:px-8 lg:px-16'
  }

  // Map vertical padding options to Tailwind classes
  const verticalPaddingMap = {
    none: '',
    sm: 'py-6',
    md: 'py-10',
    lg: 'py-16',
    xl: 'py-20 md:py-24',
    '2xl': 'py-24 md:py-32',
    '3xl': 'py-32 md:py-40'
  }
  
  // Map maxWidth options to Tailwind classes
  const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
    none: ''
  }
  
  // Get the padding class safely
  const paddingClass = paddingMap[padding] || paddingMap['lg'];
  
  // Get the vertical padding class safely
  const verticalPaddingClass = verticalPaddingMap[verticalPadding];
  
  // Get the max width class safely
  const maxWidthClass = maxWidthMap[maxWidth] || maxWidthMap['6xl'];
  
  // Determine if we have a background image
  const hasBackgroundImage = Boolean(backgroundImage);
  const hasHalfWidthImage = halfWidthImageOnDesktop && hasBackgroundImage;
  
  // Determine if backgroundImage is a string URL or Media object
  const isStringUrl = typeof backgroundImage === 'string';
  const isMediaObject = backgroundImage && typeof backgroundImage === 'object';

  // Remove backgroundImage from style since we'll handle it with components
  const combinedStyle = {
    ...style,
  };

  // Render background image component
  const renderBackgroundImage = (additionalClassName?: string) => {
    if (!hasBackgroundImage) return null;

    if (isStringUrl && backgroundImage) {
      // Fallback to CSS background for string URLs
      return (
        <div 
          className={cn(
            "absolute inset-0 bg-cover bg-center",
            additionalClassName
          )}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      );
    }

    if (isMediaObject) {
      // Use OptimizedImage for Media objects
      return (
        <OptimizedImage
          image={backgroundImage as ImageInput}
          fill={true}
          className={cn("object-cover", additionalClassName)}
          sizes={backgroundImageSizes}
          preferredSize={backgroundImagePreferredSize}
          priority={backgroundImagePriority}
          alt=""
        />
      );
    }

    return null;
  };

  return (
    <section
      id={id}
      style={combinedStyle}
      className={cn(
        'relative overflow-hidden',
        !contentbgc && bgc,
        verticalPaddingClass,
        sectionClassName
      )}
    >
      {/* Full-width background image */}
      {hasBackgroundImage && !halfWidthImageOnDesktop && (
        <div className="absolute inset-0 z-0">
          {renderBackgroundImage()}
        </div>
      )}

      {/* Half-width background image for desktop */}
      {hasHalfWidthImage && (
        <div 
          className={cn(
            "absolute inset-y-0 left-0 right-0 z-0",
            imagePosition === 'left' ? 'md:right-1/2' : 'md:left-1/2'
          )}
        >
          {renderBackgroundImage()}
        </div>
      )}

      {/* Content background color overlay */}
      {contentbgc && hasHalfWidthImage && (
        <div 
          className={cn(
            "absolute inset-y-0 left-0 right-0 z-10",
            imagePosition === 'left' ? 'md:left-1/2' : 'md:right-1/2',
            contentbgc
          )}
        />
      )}

      {/* Custom overlay */}
      {overlayClassName && (
        <div
          className={cn(
            'absolute inset-0 z-5',
            overlayClassName
          )}
        />
      )}

      {/* Content container - highest z-index */}
      <div
        className={cn(
          "relative z-30 w-full mx-auto",
          paddingClass,
          maxWidthClass,
          containerClassName,
          className
        )}
        {...props}
      >
        {children}
      </div>
    </section>
  )
}

export { ContainedSection }