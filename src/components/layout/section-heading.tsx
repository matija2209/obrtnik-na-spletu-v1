import React from 'react';
import { cn } from '@/lib/utils';

// Define types for the sub-components
type TitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  size?: 'big' | 'small' | 'hero';
};
type DescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

// Main component
function SectionHeading({
  children,
  className,
  titleClassName,
  descriptionClassName,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  titleClassName?: string;
  descriptionClassName?: string;
}) {
  // Clone children and pass props to them
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    // Cast child.type to any to compare with component functions
    const childType = child.type as any;

    if (childType === Title) {
      return React.cloneElement(child as React.ReactElement<TitleProps>, {
        className: cn(titleClassName, (child.props as TitleProps).className),
      });
    }

    if (childType === Description) {
      return React.cloneElement(child as React.ReactElement<DescriptionProps>, {
        className: cn(descriptionClassName, (child.props as DescriptionProps).className),
      });
    }

    return child;
  });

  return (
    <div
      className={cn(
        "text-left md:text-center mb-12 mx-auto",
        className
      )}
      {...props}
    >
      {childrenWithProps}
    </div>
  );
}

// Title sub-component
function Title({
  children,
  className,
  size = 'big',  // Default size is 'big'
  ...props
}: TitleProps) {
  return (
    <h2
      className={cn(
        // Base styles for all sizes
        "font-semibold text-gray-900 dark:text-gray-100 tracking-tight leading-none",
        // Size-specific styles
        size === 'hero' 
          ? "text-5xl md:text-6xl lg:text-6xl xl:text-6xl 2xl:text-7xl" 
          : size === 'big' 
            ? "text-4xl md:text-4xl lg:text-4xl 2xl:text-4xl" 
            : "text-xl md:text-2xl lg:text-3xl 2xl:text-3xl",
          "mb-4",
        className
      )}
      style={{
        // textShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)",
      }}
      {...props}
    >
      {children}
    </h2>
  );
}

// Description sub-component
function Description({
  children,
  className,
  ...props
}: DescriptionProps) {
  return (
    <p
      className={cn(
        "text-base text-dark/90",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

// Attach sub-components to main component
SectionHeading.Title = Title;
SectionHeading.Description = Description;

export default SectionHeading;