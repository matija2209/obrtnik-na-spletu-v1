"use client";
import React, { useState } from 'react';
import { twMerge } from "tailwind-merge";
// import { daysAgo } from '@/utils/date-utils'; // Removed, file not found
import { Quote, Star } from 'lucide-react';
import type { Testimonial } from '@payload-types'; // Use alias
import { useIsMobile } from '@/hooks/use-mobile';

interface TestimonialCardProps {
  testimonial: Testimonial;
  contentClasses?: string;
}

const TestimonialCardRecycled: React.FC<TestimonialCardProps> = (props) => {
  const {
    testimonial,
    contentClasses,
  } = props;
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  // Defensive check for testimonial data
  if (!testimonial) {
    return null;
  }

  const { rating, content, name, testimonialDate } = testimonial; // Use content and testimonialDate

  return (
    <article
      className={twMerge(
        "bg-white flex flex-col p-6 rounded-sm shadow-md space-y-4 w-full justify-between",
        "h-full", // Ensure consistent height
        "min-h-[380px] md:min-h-[480px]",
        isExpanded && "h-auto", // Allow expansion when needed
        contentClasses?.replaceAll(",", " ")
      )}
      style={{
        width: '100%', // Force full width inside its container
        boxSizing: 'border-box' // Include padding in width calculation
      }}
    >
      <div className="space-y-4 flex-grow">
        {typeof rating === 'number' && rating > 0 && (
          <div
            className={twMerge(
              "flex self-start",
              "text-orange-400"
            )}
          >
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={i < rating ? "text-orange-400" : "text-gray-300"}
                fill={i < rating ? "currentColor" : "none"}
              />
            ))}
          </div>
        )}
        {content && ( // Check for content
           <div className="space-y-2">
             <Quote className="text-3xl text-primary"></Quote>
            <p className={twMerge("self-start text-left text-lg")}>
              {isExpanded || content.length <= (isMobile ? 150 : 300)
                ? content
                : content.substring(0, isMobile ? 150 : 300) + "..."} 
              {content.length > (isMobile ? 150 : 300) && (
                <span
                  className="pl-2 text-primary font-bold text-sm hover:underline text-left cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {isExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
      <div className="self-start text-left mt-auto">
        {name && <p className="text-primary font-bold">{name}</p>}
        {/* Display formatted date string */}
        {testimonialDate && <p className="text-sm">{new Date(testimonialDate).toLocaleDateString()}</p>}
      </div>
    </article>
  );
};

export default TestimonialCardRecycled; 