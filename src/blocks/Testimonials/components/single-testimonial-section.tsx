"use client";
import React, { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/ui/button';
import GoogleIcon from '@/components/common/icons/google-icon'; // Adjusted path
import type { Testimonial as PayloadTestimonial } from '@payload-types';
import { ContainedSection } from '@/components/layout/container-section'; // Named import
import SectionHeading from '@/components/layout/section-heading';

// Define the props interface for the template component
interface SingleTestimonialSectionProps {
  title?: string | null;
  description?: string | null; // Added description prop
  testimonials: PayloadTestimonial[];
  bgColor?: 'bg-background' | 'bg-primary' | 'bg-secondary' | 'bg-muted'; // Prop for background color
}

// Single Testimonial Card Component (Adapted from user code)
const TestimonialCard: React.FC<{ testimonial: PayloadTestimonial; isActive: boolean }> = ({
  testimonial,
  isActive,
}) => {
  const [expanded, setExpanded] = useState(false);
  const maxCharLength = 150; // Maximum characters to show initially
  const isTextLong = testimonial.content.length > maxCharLength;

  // Generate stars based on rating
  const renderStars = (rating: number = 5) => {
    return (
      <div className="flex justify-center mb-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Format the date (adjust as needed for your date format)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const diffTime = Math.abs(new Date().getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffMonths = Math.floor(diffDays / 30);
      const diffYears = Math.floor(diffDays / 365);

      if (diffYears > 0) return `pred ${diffYears} ${diffYears === 1 ? 'letom' : (diffYears === 2 ? 'letoma' : 'leti')}`;
      if (diffMonths > 0) return `pred ${diffMonths} ${diffMonths === 1 ? 'mesecem' : (diffMonths === 2 ? 'mesecema' : 'meseci')}`;
      if (diffDays > 0) return `pred ${diffDays} ${diffDays === 1 ? 'dnevom' : (diffDays === 2 ? 'dnevoma' : 'dnevi')}`;
      return 'Danes';
    } catch {
      return dateString; // Fallback if parsing fails
    }
  };

  // Function to handle the "Read more" click
  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    setExpanded(!expanded);
  };

  // Function to get the displayed text based on expanded state
  const getDisplayText = () => {
    if (!isTextLong || expanded) {
      return testimonial.content; // Use 'content' from PayloadTestimonial
    }
    return `${testimonial.content.substring(0, maxCharLength)}...`;
  };

  return (
    <div
      className={twMerge(`testimonial-card max-w-lg mx-auto p-6 text-center transition-opacity duration-500 absolute top-0 left-0 right-0`, isActive ? 'opacity-100' : 'opacity-0'
      )}
      // Add accessibility attributes
      aria-hidden={!isActive}
      style={{ visibility: isActive ? 'visible' : 'hidden' }}
    >
      {renderStars(testimonial.rating)}
      <div className="min-h-[100px] md:min-h-[120px] flex flex-col justify-center items-center"> {/* Adjusted height */}
        <p className="text-center mb-2 italic font-light">
          "{getDisplayText()}"
        </p>
        {isTextLong && (
          <button
            onClick={toggleExpand}
            className="text-sm font-medium text-blue-200 hover:text-blue-100 transition-colors mt-1"
            // Ensure button text is clear
            aria-expanded={expanded}
          >
            {expanded ? 'Pokaži manj' : 'Preberi več'}
          </button>
        )}
      </div>
      <p className="font-semibold mt-2">{testimonial.name}</p>
      <p className="text-sm">{formatDate(testimonial.testimonialDate)}</p> {/* Use 'testimonialDate' */}
    </div>
  );
};

// Main Template Component (Adapted from user's TestimonialsSection)
const SingleTestimonialSection: React.FC<SingleTestimonialSectionProps> = ({
  title,
  description,
  testimonials,
  bgColor = 'bg-primary', // Default to primary background
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);

  // Check if testimonials array is valid
  if (!testimonials || testimonials.length === 0) {
    // Optionally render a message or nothing in development/preview mode
    // if (process.env.NODE_ENV !== 'production') {
    //   return <div>No testimonials provided for SingleTestimonialSection.</div>;
    // }
    return null; // Don't render anything if no testimonials
  }

  // Auto-scroll functionality
  useEffect(() => {
    if (!isPaused && testimonials.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000); // Change testimonial every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isPaused, testimonials.length]);

  // Navigation handlers
  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  // Pagination dots
  const renderPaginationDots = () => {
    if (testimonials.length <= 1) return null; // Hide dots if only one testimonial
    return (
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === activeIndex ? 'bg-white w-6' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            aria-label={`Go to testimonial ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : 'false'}
          />
        ))}
      </div>
    );
  };

  // Mouse event handlers for pausing
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const textColor = bgColor === 'bg-primary' || bgColor === 'bg-secondary' ? 'text-primary-foreground' : 'text-foreground';

  return (
    <ContainedSection id='mnenja' bgColor={bgColor} verticalPadding='xl'>
      <SectionHeading>
        {title && <SectionHeading.Title className={textColor}>{title}</SectionHeading.Title>}
        {description && <SectionHeading.Description className={textColor}>{description}</SectionHeading.Description>}
      </SectionHeading>

      {/* Testimonials carousel */}
      <div
        className="relative overflow-hidden mt-12" // Added margin-top
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={testimonialRef}
        aria-roledescription="carousel"
        aria-label="Testimonials"
      >
        {/* Testimonials Container */}
        <div className={twMerge("relative h-[250px] md:h-[280px] testimonials-container", textColor)}> {/* Adjusted height */}
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id || index} // Use Payload ID
              testimonial={testimonial}
              isActive={index === activeIndex}
            />
          ))}
        </div>

        {/* Navigation Arrows Container - Conditionally render if more than one testimonial */}
        {testimonials.length > 1 && (
           <div className="flex justify-center items-center mt-4 space-x-4 sm:mt-0 sm:relative"> {/* Centered flex on mobile, relative on sm+ */}
              {/* Left navigation button */}
              <button
                onClick={handlePrev}
                className="arrow-button border border-current rounded-full bg-transparent text-current p-2 z-10 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all nav-arrow sm:absolute sm:left-0 sm:top-1/2 sm:transform sm:-translate-y-full" // Adjusted position and styling
                aria-label="Previous testimonial"
              >
                <svg className="arrow-icon w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right navigation button */}
              <button
                onClick={handleNext}
                className="arrow-button border border-current rounded-full bg-transparent text-current p-2 z-10 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all nav-arrow sm:absolute sm:right-0 sm:top-1/2 sm:transform sm:-translate-y-full" // Adjusted position and styling
                aria-label="Next testimonial"
              >
                <svg className="arrow-icon w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
          </div>
        )}
      </div> {/* End of overflow-hidden container */}

      {/* Pagination dots */}
      {renderPaginationDots()}

      {/* Google Review Link - Removed as useBusinessInfo is not available */}
      {/* 
      {businessInfo?.googleReviewUrl && (
         <div className="text-center mt-8">
            <Button variant={"ghost"} size="sm" asChild className={textColor === 'text-primary-foreground' ? 'text-primary-foreground hover:text-primary-foreground hover:bg-primary/90' : ''}>
              <a
                href={businessInfo.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GoogleIcon className="mr-2" />
                Pustite mnenje na Google
              </a>
            </Button>
          </div>
      )}
      */}


      {/* Inline styles for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .testimonial-card {
          transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
        }
        .nav-arrow {
          transition: background-color 0.3s ease;
        }
        /* Ensure inactive cards are not focusable */
        .testimonial-card:not(.opacity-100) {
           pointer-events: none;
        }
      `}} />
    </ContainedSection>
  );
};

export default SingleTestimonialSection; 