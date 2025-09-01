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
import type { TestimonialsBlock, Testimonial as PayloadTestimonial } from '@payload-types';
import { getColorClasses, getBackgroundClass, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { extractIdsFromNullable } from '@/utilities/extractIds';
import { getTestimonialsByIds } from '@/lib/payload';

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

const TestimonialsSectionVariant2: React.FC<TestimonialsBlock> = async (props) => {
  const { 
    title, 
    description, 
    selectedTestimonials, 
    colourScheme,
    bgColor: backgroundColor,
    isTransparent
  } = props;

  // Get color classes and background styling
  const colorClasses = getColorClasses((colourScheme as ColorScheme) || 'primary');
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  // Extract IDs and fetch testimonials data
  const testimonialIds = extractIdsFromNullable(selectedTestimonials);
  const validTestimonials = testimonialIds.length > 0 ? await getTestimonialsByIds(testimonialIds) : [];

  // TODO: Ideally, get the review link from CMS global settings (e.g., Business Info)
  const reviewLink = "https://search.google.com/local/writereview?placeid=ChIJvdXt9j0zv0cRGtM1K3CFRoM";
  const defaultTitle = "Kaj pravijo naše stranke"; // Default title if none provided

  if (validTestimonials.length === 0) {
    return null; // Don't render if no testimonials
  }
  
  // Hardcoded average rating for display - could be calculated or set in CMS if needed
  const averageRating = 5.0;
  const ratingDisplay = averageRating.toFixed(1);

  return (
    <ContainedSection 
      id="mnenja" 
      overlayClassName={overlayClass}
      verticalPadding="xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center"> {/* Added items-center */} 
        <div className="lg:col-span-1 flex flex-col items-start space-y-6">
          {/* Use title from props, fallback to default */}
          <SectionHeading className="items-start mb-0"> {/* Align heading items left */} 
            <SectionHeading.Title className={cn(colorClasses.textClass, 'font-semibold text-left')}> {/* Adjusted style */} 
              {title || defaultTitle}
            </SectionHeading.Title>
            {description && <SectionHeading.Description className={cn(colorClasses.textClass, 'text-left')}>
                {description}
              </SectionHeading.Description>}
          </SectionHeading>
          {/* Static Google Rating Display */} 
          <div className="flex items-center space-x-3 pt-2"> {/* Adjusted spacing */} 
            <GoogleIcon className="w-[70px] h-[24px]" /> {/* Adjusted size */} 
            <div className={cn("pl-2 border-l", colorClasses.borderClass)}> {/* Added separator */} 
              <div className={cn("text-sm leading-tight", colorClasses.textClass)}>Ocene</div> {/* Tightened leading */} 
              <div className="flex items-center space-x-1"> {/* Reduced space */} 
                <span className={cn("text-xl font-bold", colorClasses.textClass)}>{ratingDisplay}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={i < Math.floor(averageRating) ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Review Button */} 
          {reviewLink && (
             <Button variant="outline" className={cn("w-full sm:w-auto", colorClasses.secondaryButtonClass)} asChild> 
                <Link
                  href={reviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Oddajte oceno
                </Link>
              </Button>
          )} 
        </div>
        <div className="lg:col-span-2">
          <Carousel 
            opts={{ 
              align: "start", 
              loop: validTestimonials.length > 1 // Allow loop if more than 1 testimonial
            }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4">
              {validTestimonials.map((testimonial) => (
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
              ))}
            </CarouselContent>
            {/* Show arrows only if looping is possible (more than 1 item on md, more than 2 on lg might be better criteria depending on basis) */} 
            {validTestimonials.length > 1 && ( 
              <>
                <CarouselPrevious className={cn("absolute left-[-15px] top-1/2 -translate-y-1/2 z-10 hidden lg:inline-flex bg-background/80 hover:bg-background border-border", colorClasses.secondaryButtonClass)} />
                <CarouselNext className={cn("absolute right-[-15px] top-1/2 -translate-y-1/2 z-10 hidden lg:inline-flex bg-background/80 hover:bg-background border-border", colorClasses.secondaryButtonClass)} />
              </>
            )}
          </Carousel>
        </div>
      </div>
    </ContainedSection>
  );
};

export default TestimonialsSectionVariant2; 