"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Testimonial } from "@payload-types";
import { useIsMobile } from "@/hooks/use-mobile";
import TestimonialCardRecycled from "./card"; // Import the card component

interface ThreeColumnCarouselRecycledProps {
  testimonials: Testimonial[];
  // Add any other props needed specifically for this template
  contentClasses?: string;
}

const ThreeColumnCarouselRecycled: React.FC<ThreeColumnCarouselRecycledProps> = (props) => {
  const { testimonials, contentClasses } = props;
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slidesToShow = isMobile ? 1 : 3;

  // Sort testimonials by date (newest first)
  const sortedTestimonials = testimonials && testimonials.length > 0
    ? [...testimonials].sort((a: Testimonial, b: Testimonial) => {
        // Handle potential null/undefined dates
        const dateA = a.testimonialDate ? new Date(a.testimonialDate).getTime() : 0;
        const dateB = b.testimonialDate ? new Date(b.testimonialDate).getTime() : 0;
        return dateB - dateA; // Newest first
      })
    : [];

  // Ensure we have at least 3 testimonials for desktop view (or duplicate existing)
  const ensureMinimumSlides = (items: Testimonial[]): Testimonial[] => {
    if (items.length === 0) return [];
    // Only enforce minimum for desktop view if needed
    if (isMobile || items.length >= 3) return items;

    let result = [...items];
    while (result.length < 3) {
      result = [...result, ...items]; // Duplicate items
    }
    // Limit duplication reasonably if original list was very small
    return result.slice(0, Math.max(3, items.length * 2)); 
  };

  const processedTestimonials = ensureMinimumSlides(sortedTestimonials);
  const totalSlides = processedTestimonials.length;

  // Calculate the maximum index to prevent going past the end
  // Ensure maxIndex is never negative
  const maxIndex = Math.max(0, totalSlides - slidesToShow);

  const next = () => {
    if (isTransitioning || currentIndex >= maxIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => Math.min(prevIndex + 1, maxIndex));
  };

  const previous = () => {
    if (isTransitioning || currentIndex === 0) return;
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  // Reset transition state after animation completes
  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 550); // Match transition duration + small buffer

    return () => clearTimeout(timer);
  }, [isTransitioning]);

  // Touch events for mobile swiping
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current || touchEndX.current === 0) {
       isSwiping.current = false;
       touchEndX.current = 0; // Reset end position
       return;
    }

    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50 && currentIndex < maxIndex) { // Swipe left - go to next
      next();
    } else if (diff < -50 && currentIndex > 0) { // Swipe right - go to previous
      previous();
    }

    isSwiping.current = false;
    touchEndX.current = 0; // Reset end position
  };

  // Auto-scroll (optional - can be enabled if needed)
  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   if (!isTransitioning && totalSlides > slidesToShow) {
  //     interval = setInterval(() => {
  //       setCurrentIndex(prevIndex => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  //     }, 5000);
  //   }
  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };
  // }, [isTransitioning, currentIndex, maxIndex, totalSlides, slidesToShow]);

  // Handle window resize to recalculate indices
  useEffect(() => {
    const handleResize = () => {
      // Recalculate maxIndex based on new slidesToShow
      const newSlidesToShow = window.innerWidth < 768 ? 1 : 3;
      const newMaxIndex = Math.max(0, totalSlides - newSlidesToShow);
      if (currentIndex > newMaxIndex) {
        setCurrentIndex(newMaxIndex);
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial call to set correct state on load
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, totalSlides]); // Re-run on currentIndex and totalSlides change

  // Early return if no testimonials to display
  if (totalSlides === 0) {
    return null;
  }

  // Calculate the width of the container based on total slides and slides to show
  const containerWidthPercentage = totalSlides * (100 / slidesToShow);
  // Calculate the translation based on the current index and total slides
  const translateXPercentage = currentIndex * (100 / totalSlides);


  return (
    <div className="w-full overflow-hidden">
      <div className="relative">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            // Ensure container width adapts correctly
            width: `${containerWidthPercentage}%`,
            transform: `translateX(-${translateXPercentage}%)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {processedTestimonials.map((testimonial: Testimonial, index: number) => (
            <div
              key={testimonial.id ? `testimonial-${testimonial.id}-${index}` : `testimonial-${index}`} // Use ID if available for better key
              style={{
                // Each slide takes up the correct fraction of the container width
                width: `${100 / totalSlides}%`,
              }}
              className="px-2 flex-shrink-0" // Add horizontal spacing and prevent shrinking
            >
              <div className="h-full"> {/* Ensure card container takes full height */}
                <TestimonialCardRecycled
                  testimonial={testimonial}
                  contentClasses={contentClasses}
                  // Pass any other necessary props to the card
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - only show if needed */}
      {totalSlides > slidesToShow && (
        <div className="flex gap-4 items-center justify-center mt-8"> {/* Increased margin-top */}
          <button
            className={`rounded-full p-2 transition-colors duration-200 ${currentIndex === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              }`}
            onClick={previous}
            disabled={isTransitioning || currentIndex === 0}
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="h-5 w-5" /> {/* Adjusted size */} 
          </button>
          <button
            className={`rounded-full p-2 transition-colors duration-200 ${currentIndex >= maxIndex
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              }`}
            onClick={next}
            disabled={isTransitioning || currentIndex >= maxIndex}
            aria-label="Next testimonial"
          >
            <ArrowRight className="h-5 w-5" /> {/* Adjusted size */} 
          </button>
        </div>
      )}
    </div>
  );
}

export default ThreeColumnCarouselRecycled; 