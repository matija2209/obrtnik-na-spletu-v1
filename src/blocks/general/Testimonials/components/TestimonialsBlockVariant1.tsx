import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import GoogleIcon from '@/components/common/icons/google-icon';
import type { TestimonialsBlock, Testimonial as PayloadTestimonial, Cta } from '@payload-types';
import { getColorClasses, getBackgroundClass, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import CtaButtons from '@/components/common/cta-buttons';
import { getTestimonials, getCtas } from '@/lib/payload';
import { extractIdsFromNullable } from '@/utilities/extractIds';


const StarIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    className={`h-5 w-5 ${className}`}
  >
    <path 
      fillRule="evenodd" 
      d="M10 15.585l-5.857 3.105 1.114-6.51L.515 7.62l6.517-.955L10 .685l2.968 6.03 6.517.954-4.742 4.562 1.114 6.51L10 15.585z" 
      clipRule="evenodd" 
    />
  </svg>
);

// Helper to format date as "time ago"
const formatTimeAgo = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000; // years
    if (interval > 1) return `pred ${Math.floor(interval)} ${Math.floor(interval) === 1 ? 'letom' : (Math.floor(interval) === 2 ? 'letoma' : 'leti')}`;
    
    interval = seconds / 2592000; // months
    if (interval > 1) return `pred ${Math.floor(interval)} ${Math.floor(interval) === 1 ? 'mesecem' : (Math.floor(interval) === 2 ? 'mesecema' : 'meseci')}`;
    
    interval = seconds / 86400; // days
    if (interval > 1) return `pred ${Math.floor(interval)} ${Math.floor(interval) === 1 ? 'dnevom' : (Math.floor(interval) === 2 ? 'dnevoma' : 'dnevi')}`;
    
    interval = seconds / 3600; // hours
    if (interval > 1) return `pred ${Math.floor(interval)} ${Math.floor(interval) === 1 ? 'uro' : (Math.floor(interval) === 2 ? 'urama' : 'urami')}`;
    
    interval = seconds / 60; // minutes
    if (interval > 1) return `pred ${Math.floor(interval)} ${Math.floor(interval) === 1 ? 'minuto' : (Math.floor(interval) === 2 ? 'minutama' : 'minutami')}`;
    
    return `pred ${Math.floor(seconds)} ${Math.floor(seconds) === 1 ? 'sekundo' : (Math.floor(seconds) === 2 ? 'sekundama' : 'sekundami')}`;
  } catch {
    return dateString; // Fallback
  }
};

/**
 * Server component that fetches testimonials and CTAs based on IDs
 * and renders the testimonials section
 */
export default async function TestimonialsBlockVariant1(props: TestimonialsBlock) {
  const { 
    selectedTestimonials,
    googleReviewCta,
    title, 
    subtitle, 
    bgc,
    isTransparent,
    ...restProps 
  } = props;
  
 
  const backgroundClass =  isTransparent ? "bg-transparent" : getBackgroundClass(bgc ?? "");
  
    

  // Hardcoded average rating for display - could be calculated or set in CMS if needed
  const averageRating = 5.0;
  const ratingDisplay = averageRating.toFixed(1);

  return (
    <ContainedSection 
      id="mnenja" 
      overlayClassName={backgroundClass}
      verticalPadding="xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center"> {/* Added items-center */} 
        <div className="lg:col-span-1 flex flex-col items-start space-y-6">
          {/* Use title from props, fallback to default */}
          {(title || subtitle) &&  <SectionHeading className="items-start mb-0"> {/* Align heading items left */} 
            {title && <SectionHeading.Title className={cn("text-dark-800", 'font-semibold text-left')}> {/* Adjusted style */} 
              {title}
            </SectionHeading.Title>}
            {subtitle && <SectionHeading.Description className={cn("text-dark-800", 'text-left')}> 
                {subtitle}
              </SectionHeading.Description>}
          </SectionHeading>}
          {/* Static Google Rating Display */} 
          <div className="flex items-center space-x-3 pt-2"> {/* Adjusted spacing */} 
            <GoogleIcon className="w-[70px] h-[24px]" /> {/* Adjusted size */} 
            <div className={cn("pl-2 border-l")}> {/* Added separator */} 
              <div className={cn("text-sm leading-tight")}>{
                process.env.NEXT_PUBLIC_PRIMARY_LANGUAGE === "si" ? "Ocene" : process.env.NEXT_PUBLIC_PRIMARY_LANGUAGE === "de" ? "Bewertungen" : "Ratings"
                }</div> {/* Tightened leading */} 
              <div className="flex items-center space-x-1"> {/* Reduced space */} 
                <span className={cn("text-xl font-bold")}>{ratingDisplay}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={i < Math.floor(averageRating) ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Review Button */} 
          {googleReviewCta && (
             <CtaButtons variant='outline' ctas={googleReviewCta as Cta} />
          )} 
        </div>
        <div className="lg:col-span-2">
          {selectedTestimonials && <Carousel 
            opts={{ 
              align: "start", 
              loop: selectedTestimonials.length > 1 // Allow loop if more than 1 testimonial
            }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4">
              {selectedTestimonials.map((testimonial) => {
                if (typeof testimonial === 'number') {
                  return null;
                }
                return (
                  <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
                      {/* Use PayloadTestimonial data */}
                      <Card className="h-full shadow-md border border-gray-200/80 rounded-lg overflow-hidden flex flex-col"> {/* Ensure flex column */} 
                        <CardContent className="flex flex-col items-start justify-between p-6 space-y-4 h-full flex-grow"> {/* Ensure content grows */} 
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <StarIcon key={i} className="text-yellow-400" />
                            ))}
                            {[...Array(5 - testimonial.rating)].map((_, i) => (
                              <StarIcon key={i + testimonial.rating} className="text-gray-300" />
                            ))}
                          </div>
                          {/* Map content to quote */} 
                          <blockquote className={cn("italic leading-relaxed flex-grow", "opacity-80")}> 
                            &ldquo;{testimonial.content}&rdquo;
                          </blockquote>
                          <div className={cn("text-sm pt-2")}> {/* Added padding top */} 
                            <p className="font-semibold">{testimonial.name}</p>
                            {/* Format testimonialDate as timeAgo */} 
                            <p className={cn("opacity-70")}>{formatTimeAgo(testimonial.testimonialDate)}</p>
                          </div>
                        </CardContent>
                      </Card>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            {/* Show arrows only if looping is possible (more than 1 item on md, more than 2 on lg might be better criteria depending on basis) */} 
            {selectedTestimonials.length > 1 && ( 
              <>
                <CarouselPrevious className={cn("absolute left-[-15px] top-1/2 -translate-y-1/2 z-10 hidden lg:inline-flex bg-background/80 hover:bg-background border-border", )} />
                <CarouselNext className={cn("absolute right-[-15px] top-1/2 -translate-y-1/2 z-10 hidden lg:inline-flex bg-background/80 hover:bg-background border-border", )} />
              </>
            )}
          </Carousel>}
        </div>
      </div>
    </ContainedSection>
  );
} 