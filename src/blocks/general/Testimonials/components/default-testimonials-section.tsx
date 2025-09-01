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

import type { TestimonialsBlock, Testimonial as PayloadTestimonial } from "@payload-types";
import CtaButton from "@/components/ui/cta-button";
import StarIcon from '@/components/common/icons/star-icon';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { extractIdsFromNullable, extractIdFromNullable } from '@/utilities/extractIds';
import { getTestimonialsByIds, getCta } from '@/lib/payload';

const DefaultTestimonialsSection: React.FC<TestimonialsBlock> = async (props) => {
  const { 
    selectedTestimonials, 
    title, 
    googleReviewCta, 
    colourScheme,
    bgColor: backgroundColor,
    isTransparent
  } = props;

  // Get color classes and background styling
  const colorClasses = getColorClasses((colourScheme as ColorScheme) || 'primary');
  const backgroundClass = getBackgroundClass( backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  // Extract IDs and fetch testimonials data
  const testimonialIds = extractIdsFromNullable(selectedTestimonials);
  const ctaId = extractIdFromNullable(googleReviewCta);

  // Fetch testimonials and CTA data
  const validTestimonials = testimonialIds.length > 0 ? await getTestimonialsByIds(testimonialIds) : [];
  const ctaData = ctaId ? await getCta(ctaId) : null;

  // Render nothing if no testimonials are valid
  if (validTestimonials.length === 0) {
    return null; 
  }

  return (
    <ContainedSection id="reference" overlayClassName={overlayClass} verticalPadding="xl">
      <SectionHeading>
        <SectionHeading.Title className={colorClasses.textClass}>{title ?? "Kaj pravijo naše stranke"}</SectionHeading.Title>
      </SectionHeading>
      
      <Carousel 
        opts={{ align: "start", loop: true }}
        className="w-full relative px-12 mb-12" // Add padding for arrows and bottom margin
      >
        <CarouselContent className="-ml-4">
          {validTestimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                <Card className={cn("h-full shadow-md border border-gray-200 bg-white")}>
                  <CardContent className="flex flex-col items-start justify-between p-6 space-y-4 h-full">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <blockquote className={cn("italic text-sm md:text-base flex-grow")}>
                      {`"${testimonial.content}"`}
                    </blockquote>
                    <p className={cn("font-semibold text-sm")}>- {testimonial.name}</p>
                    {testimonial.testimonialDate && 
                      <p className={cn("text-xs mt-2", "opacity-70")}>
                        {new Date(testimonial.testimonialDate).toLocaleDateString('sl-SI')} 
                      </p>
                    }
                    {testimonial.location && <p className={cn("text-xs", colorClasses.textClass, "opacity-70")}>{testimonial.location}</p>}

                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={cn("absolute left-0 top-1/2 -translate-y-1/2", colorClasses.secondaryButtonClass)} />
        <CarouselNext className={cn("absolute right-0 top-1/2 -translate-y-1/2", colorClasses.secondaryButtonClass)} />
      </Carousel>
      {ctaData && (
        <div className="my-8 flex justify-center">
          <CtaButton mainCta={ctaData} />
        </div>
      )}
    </ContainedSection>
  );
};

export default DefaultTestimonialsSection;