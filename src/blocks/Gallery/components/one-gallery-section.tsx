"use client";

import React, { useState, TouchEvent, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import { Photo } from '@/features/gallery/types';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GallerySectionV2Props {
  photos: Photo[];
}

export default function OneGallerySection({ photos }: GallerySectionV2Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Ref to store scroll position
  const scrollPositionRef = useRef<number>(0);

  // State for carousel API and dots
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideCount, setSlideCount] = useState(0)

  // Inside your component
  useEffect(() => {
    if (lightboxOpen) {
      // Store the current scroll position before applying styles
      scrollPositionRef.current = window.scrollY;

      // Prevent scrolling on body when lightbox is open
      document.body.style.overflow = 'hidden';
      // For iOS Safari specifically
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      // Keep the body at the stored scroll position visually
      document.body.style.top = `-${scrollPositionRef.current}px`;

    } else {
      // Re-enable scrolling when lightbox is closed
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = ''; // Reset top style

      // Restore the scroll position after a brief delay to allow styles to apply
      // Using requestAnimationFrame can sometimes be smoother, but setTimeout is often sufficient
      requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current);
      });
    }

    // Cleanup function to ensure scrolling is re-enabled if component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = ''; // Ensure cleanup on unmount too
      // If the component unmounts while the lightbox is open, try to restore scroll
      if (lightboxOpen) {
         requestAnimationFrame(() => {
            window.scrollTo(0, scrollPositionRef.current);
         });
      }
    };
  }, [lightboxOpen]);

  const minSwipeDistance = 50;

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setSelectedIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Effect to update dot states when API is ready or carousel changes
  useEffect(() => {
    if (!api) {
      return
    }

    setSlideCount(api.scrollSnapList().length)
    setCurrentSlide(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap())
    })

    api.on("reInit", () => {
       setSlideCount(api.scrollSnapList().length)
       setCurrentSlide(api.selectedScrollSnap())
    })

    // Cleanup listeners on unmount
    return () => {
      api.off("select", () => {})
      api.off("reInit", () => {})
    }
  }, [api])

  // Function to scroll to a specific dot
  const scrollTo = useCallback(
    (index: number) => api?.scrollTo(index),
    [api]
  )

  return (
    <ContainedSection
      id="galerija"
      bgColor="bg-white"
      verticalPadding="xl"
    >
      <SectionHeading>
        <SectionHeading.Title>Naši projekti</SectionHeading.Title>
      </SectionHeading>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
      >
        <CarouselContent className="-ml-4">
          {/* Group photos into pairs */}
          {Array.from({ length: Math.ceil(photos.length / 2) }).map((_, index) => {
            const firstPhotoIndex = index * 2;
            const secondPhotoIndex = firstPhotoIndex + 1;
            const firstPhoto = photos[firstPhotoIndex];
            const secondPhoto = photos[secondPhotoIndex]; // This might be undefined if photos.length is odd

            // Ensure we have at least one photo for the item
            if (!firstPhoto) return null;

            return (
              <CarouselItem key={firstPhoto.id} className="pl-4 basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="flex flex-col space-y-4"> {/* Stack images vertically */}
                  {/* First Image */}
                  <div
                    className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                    onClick={() => openLightbox(firstPhotoIndex)}
                  >
                    <Image
                      src={firstPhoto.src}
                      alt={firstPhoto.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" // Sizes might need adjustment based on the new layout
                      className="transition-transform duration-300 ease-in-out group-hover:scale-105 object-cover"
                    />
                    <div className="absolute inset-0 hover:bg-black/30 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                      <Search className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={48} />
                    </div>
                  </div>

                  {/* Second Image (if it exists) */}
                  {secondPhoto && (
                    <div
                      className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                      onClick={() => openLightbox(secondPhotoIndex)}
                    >
                      <Image
                        src={secondPhoto.src}
                        alt={secondPhoto.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" // Sizes might need adjustment
                        className="transition-transform duration-300 ease-in-out group-hover:scale-105 object-cover"
                      />
                      <div className="absolute inset-0 hover:bg-black/30 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                        <Search className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={48} />
                      </div>
                    </div>
                  )}
                  {/* Placeholder if only one image in the last pair */}
                  {!secondPhoto && <div className="aspect-square"></div>}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>

      {lightboxOpen && (
       <div
       className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-hidden"
       style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
       onTouchStart={handleTouchStart}
       onTouchMove={handleTouchMove}
       onTouchEnd={handleTouchEnd}
     >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-20 text-white hover:bg-white/20 rounded-full h-10 w-10 sm:h-12 sm:w-12"
            onClick={closeLightbox}
          >
            <X size={28} className="sm:scale-125"/>
            <span className="sr-only">Close lightbox</span>
          </Button>

          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-2">
               <Image
                 src={photos[selectedIndex].src}
                 alt={photos[selectedIndex].alt}
                 width={1200}
                 height={800}
                 style={{ objectFit: 'contain', maxHeight: '90vh', maxWidth: '100%' }}
                 className="rounded-lg"
               />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:block absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full h-10 w-10 sm:h-14 sm:w-14"
              onClick={goToPrevious}
            >
              <ChevronLeft size={36} className="sm:scale-125"/>
              <span className="sr-only">Previous image</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:block absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full h-10 w-10 sm:h-14 sm:w-14"
              onClick={goToNext}
            >
              <ChevronRight size={36} className="sm:scale-125"/>
              <span className="sr-only">Next image</span>
            </Button>
          </div>
        </div>
      )}

      {/* Dynamic Dots Indicator */}
      <div className="flex justify-center items-center pt-4 mt-8 space-x-2">
        {Array.from({ length: slideCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              'block w-2.5 h-2.5 rounded-full transition-colors duration-200',
              index === currentSlide ? 'bg-primary' : 'bg-secondary hover:bg-primary'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </ContainedSection>
  );
} 