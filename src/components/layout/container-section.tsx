import React from 'react'
import { cn } from '@/lib/utils'

interface ContainedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  id?: string
  sectionClassName?: string
  containerClassName?: string
  bgColor?: string
  contentBgColor?: string
  showGridLines?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'none'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  verticalPadding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  backgroundImage?: string
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
  bgColor = 'bg-primary',
  contentBgColor,
  showGridLines = false,
  maxWidth = '7xl',
  padding = 'lg',
  verticalPadding = 'xl',
  backgroundImage = '',
  halfWidthImageOnDesktop = false,
  imagePosition = 'right',
  overlayClassName,
  style,
  ...props
}: ContainedSectionProps) {
  // Map padding options to Tailwind classes
  const paddingMap = {
    none: '',
    sm: 'px-3 sm:px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-4 sm:px-6 lg:px-12',
    xl: 'px-6 sm:px-8 lg:px-16'
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
  
  // Create a pseudo-element for the background image when halfWidthImageOnDesktop is true
  // This allows for more control over the background image
  const hasHalfWidthImage = halfWidthImageOnDesktop && backgroundImage;

  // Combine explicit backgroundImage with other styles
  const combinedStyle = {
    ...style,
    ...(backgroundImage && !halfWidthImageOnDesktop && { backgroundImage: `url(${backgroundImage})` }),
  };

  return (
    <section
      id={id}
      style={combinedStyle}
      className={cn(
        'relative overflow-hidden',
        !halfWidthImageOnDesktop && 'bg-cover bg-center',
        !contentBgColor && bgColor,
        verticalPaddingClass,
        sectionClassName
      )}
    >
      {hasHalfWidthImage && (
        <div 
          className={cn(
            "absolute inset-y-0 left-0 right-0 z-0 bg-cover bg-center",
            imagePosition === 'left' ? 'md:right-1/2' : 'md:left-1/2'
          )}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      {/* Content background color */}
      {contentBgColor && hasHalfWidthImage && (
        <div 
          className={cn(
            "absolute inset-y-0 left-0 right-0 z-0",
            imagePosition === 'left' ? 'md:left-1/2' : 'md:right-1/2',
            contentBgColor
          )}
        />
      )}
      {overlayClassName && (
        <div
          className={cn(
            'absolute inset-0 z-0',
            overlayClassName
          )}
        />
      )}
      <div
        className={cn(
          "relative z-10 w-full mx-auto",
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