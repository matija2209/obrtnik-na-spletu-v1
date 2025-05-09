"use client"
import React, { useState, useEffect } from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi // Import CarouselApi type
} from "@/components/ui/carousel";
import type { Testimonial as PayloadTestimonial } from '@payload-types';
import { cn } from '@/lib/utils';

// Define the props interface for the template component
interface ThreeCarouselSectionProps {
  title?: string | null;
  description?: string | null; // Optional description from block
  testimonials: PayloadTestimonial[];
  bgColor?: 'bg-background' | 'bg-primary' | 'bg-secondary' | 'bg-muted';
}

// Helper to format date (e.g., "Month Year" or similar)
const formatDisplayDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Example format: "Jan 2024" - Adjust Intl.DateTimeFormat options as needed
    return new Intl.DateTimeFormat('sl-SI', { month: 'short', year: 'numeric' }).format(date);
  } catch {
    return dateString; // Fallback
  }
};

const ThreeCarouselSection: React.FC<ThreeCarouselSectionProps> = ({ 
  title,
  // description, // Not used in this specific layout
  testimonials,
  bgColor = 'bg-secondary', // Default background for this template
}) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const defaultTitle = "Mnenja naših strank"; // Default title

  useEffect(() => {
    if (!api) return;

    const updateState = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    }

    updateState(); // Initial state
    api.on("select", updateState);
    api.on("resize", updateState); // Update on resize as well

    return () => {
      api.off("select", updateState);
      api.off("resize", updateState);
    };
  }, [api]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 15.585l-5.857 3.105 1.114-6.51L.515 7.62l6.517-.955L10 .685l2.968 6.03 6.517.954-4.742 4.562 1.114 6.51L10 15.585z"
              clipRule="evenodd"
            />
          </svg>
        ))}
      </div>
    );
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const canScrollPrev = api?.canScrollPrev() ?? false;
  const canScrollNext = api?.canScrollNext() ?? false;
  const textColor = bgColor === 'bg-primary' || bgColor === 'bg-secondary' ? 'text-primary-foreground' : 'text-foreground';

  return (
    <ContainedSection
      id="mnenja" // Changed id to match other templates
      bgColor={bgColor}
      verticalPadding='xl'
      className="flex flex-col relative" // Ensure section is flex column and relative for button positioning
      style={{ minHeight: '500px' }} // Ensure enough height for content
    >
      <SectionHeading className="flex-shrink-0">
        <SectionHeading.Title className={textColor}>{title || defaultTitle}</SectionHeading.Title>
        {/* Optional: Add description here if needed */}
      </SectionHeading>
      
      <div className="flex-grow flex items-center overflow-hidden mt-8 w-full"> {/* Ensure full width */} 
        <Carousel 
          setApi={setApi} 
          className="w-full" // Make carousel take full width
          opts={{
            align: "start",
            // slidesToScroll: 1, // Default
            containScroll: "trimSnaps",
            loop: testimonials.length > 3, // Loop if more than 3 items (typical for 3-column layout)
          }}
        >
          <CarouselContent className="-ml-4"> {/* Negative margin to counteract item padding */} 
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3"> {/* Padding left for spacing */} 
                <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg flex flex-col h-full"> {/* Use card colors */} 
                  <div className="flex flex-col flex-grow">
                    {renderStars(testimonial.rating)}
                    
                    <blockquote className="mt-4 flex-grow overflow-y-auto max-h-[150px]"> {/* Max height for quote */} 
                      <p className="text-card-foreground/90 italic">„{testimonial.content}"</p> {/* Use card colors */} 
                    </blockquote>
                  </div>
                  
                  <footer className="mt-4 pt-4 border-t border-border flex-shrink-0"> {/* Use border color */} 
                    <div className="font-semibold text-card-foreground">{testimonial.name}</div> {/* Use card colors */} 
                    <div className="text-sm text-muted-foreground"> {/* Use muted color */} 
                      {formatDisplayDate(testimonial.testimonialDate)} {/* Format date */} 
                      {testimonial.location && testimonial.service && (
                        <>
                          <br />
                          <span className='truncate'>{testimonial.location} - {testimonial.service}</span> {/* Added truncate */} 
                        </>
                      )}
                    </div>
                  </footer>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Remove default buttons, using custom ones below */}
        </Carousel>
      </div>

      {/* Pagination Dots and Custom Buttons Container */} 
      <div className="flex justify-center items-center mt-8 mb-2 flex-shrink-0 relative h-10"> {/* Centered pagination, relative positioning */} 
        {/* Pagination Dots */} 
        <div className="flex gap-2 justify-center flex-grow"> 
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(`h-2 w-2 rounded-full transition-all`, 
                i === current ? (textColor === 'text-primary-foreground' ? 'bg-white w-6' : 'bg-primary w-6') 
                            : (textColor === 'text-primary-foreground' ? 'bg-white/50 hover:bg-white/75' : 'bg-primary/30 hover:bg-primary/50')
              )}
              aria-label={`Pojdi na mnenje ${i + 1}`}
              aria-current={i === current}
            />
          ))}
        </div>
        
        {/* Custom Prev/Next Buttons - Positioned absolutely */} 
        <div className="flex gap-3 absolute right-0 bottom-0"> 
          <button
            onClick={() => api?.scrollPrev()}
            disabled={!canScrollPrev}
            className={cn("h-10 w-10 rounded-full border flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              textColor === 'text-primary-foreground' 
                ? 'border-white text-white hover:bg-white/10' 
                : 'border-primary text-primary hover:bg-primary/10'
            )}
            aria-label="Prejšnje mnenje"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => api?.scrollNext()}
            disabled={!canScrollNext}
            className={cn("h-10 w-10 rounded-full border flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              textColor === 'text-primary-foreground' 
                ? 'border-white text-white hover:bg-white/10' 
                : 'border-primary text-primary hover:bg-primary/10'
            )}
            aria-label="Naslednje mnenje"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </ContainedSection>
  );
}

export default ThreeCarouselSection; 