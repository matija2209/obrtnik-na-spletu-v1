"use client"
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

import type { Cta, Testimonial as PayloadTestimonial } from "@payload-types";
import CtaButton from "@/components/ui/cta-button";
import StarIcon from '@/components/common/icons/star-icon';

interface TestimonialsSectionProps {
  testimonials: PayloadTestimonial[];
  title?: string;
  cta?: Cta;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ 
  testimonials,
  title = "Kaj pravijo naše stranke",
  cta
}) => {

  return (
    <ContainedSection id="reference" bgColor="bg-background" verticalPadding="xl">
      <SectionHeading>
        <SectionHeading.Title>{title}</SectionHeading.Title>
      </SectionHeading>
      
      <Carousel 
        opts={{ align: "start", loop: true }}
        className="w-full relative px-12 mb-12" // Add padding for arrows and bottom margin
      >
        <CarouselContent className="-ml-4">
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                <Card className="h-full shadow-md border border-gray-200">
                  <CardContent className="flex flex-col items-start justify-between p-6 space-y-4 h-full">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 italic text-sm md:text-base flex-grow">
                      {`"${testimonial.content}"`}
                    </blockquote>
                    <p className="font-semibold text-sm text-gray-800">- {testimonial.name}</p>
                    {testimonial.time && <p className="text-xs text-gray-500 mt-2">{testimonial.time}</p>}
                    {testimonial.location && <p className="text-xs text-gray-500">{testimonial.location}</p>}
                    {testimonial.service && <p className="text-xs text-gray-500">{testimonial.service}</p>}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
      </Carousel>
      {cta && (
        <div className="my-8 flex justify-center">
          <CtaButton mainCta={cta} />
        </div>
      )}
    </ContainedSection>
  );
};

export default TestimonialsSection;