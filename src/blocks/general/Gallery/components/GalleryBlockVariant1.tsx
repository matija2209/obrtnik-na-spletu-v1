"use client";

import React, { useState, TouchEvent, useEffect, useCallback, useRef, useMemo } from 'react';
import PayloadImage from '@/components/PayloadImage';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';

import { Search, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
import type { GalleryBlock, Media, HighQualityMedia } from '@payload-types';
import { getBackgroundClass } from '@/utilities/getColorClasses';
// import { extractIds } from '@/utilities/extractIds'; // No longer needed with depth: 2
// import { getMediaImages } from '@/lib/payload'; // No longer needed with depth: 2

// Define a proper type for loaded images
interface LoadedImage {
  id: number;
  media: Media; // Store the full Media object instead of individual properties
}

export default function GalleryBlockVariant1(props: GalleryBlock) {
  const { 
    title, 
    subtitle, 
    images, 
    galleryCta, 
    idHref, 
    bgc: backgroundColor,
    isTransparent
  } = props;
  
  // Extract image IDs from the images prop (memoized to prevent infinite re-renders)

  
  // Configuration
  const BATCH_SIZE = 4;
  
  // Get color classes and background styling
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;
  

  // Lazy loading state
  const [loadedImages, setLoadedImages] = useState<LoadedImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(BATCH_SIZE);
  const [hasMore, setHasMore] = useState(() => images && images.length > BATCH_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Existing lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  
  // Lightbox image cache - stores all images that have been loaded for lightbox
  const [lightboxImageCache, setLightboxImageCache] = useState<Map<number, LoadedImage>>(new Map());
  const [lightboxLoading, setLightboxLoading] = useState(false);
  const [currentLightboxImage, setCurrentLightboxImage] = useState<LoadedImage | null>(null);

  // Ref to store scroll position
  const scrollPositionRef = useRef<number>(0);

  // State for carousel API and dots
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideCount, setSlideCount] = useState(0)

  // Update hasMore when imageIds change
  useEffect(() => {
    setHasMore(images && images.length > BATCH_SIZE);
    setCurrentIndex(BATCH_SIZE);
  }, [images]);

  // Load initial images - now using populated Media objects
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    setIsLoading(true);
    try {
      // With depth: 2, images are already populated Media objects
      const mediaObjects = images as Media[];
      const initialPhotos = mediaObjects.slice(0, BATCH_SIZE);
      
      const photos: LoadedImage[] = initialPhotos.map((item: Media) => ({
        id: item.id,
        media: item,
      }));
      setLoadedImages(photos);
    } catch (error) {
      console.error('Error loading initial images:', error);
    } finally {
      setIsLoading(false);
    }
  }, [images]);

  // Function to load more images - now using populated Media objects
  const loadMoreImages = useCallback(async () => {
    if (!images) return;
    
    const totalImages = (images as Media[]).length;
    console.log('loadMoreImages called', { isLoading, hasMore, currentIndex, totalImages });
    
    if (isLoading || !hasMore) {
      console.log('Skipping load - isLoading:', isLoading, 'hasMore:', hasMore);
      return;
    }

    setIsLoading(true);
    try {
      const mediaObjects = images as Media[];
      const nextBatch = mediaObjects.slice(currentIndex, currentIndex + BATCH_SIZE);
      console.log('Loading next batch:', { nextBatch: nextBatch.length, currentIndex, BATCH_SIZE });
      
      if (nextBatch.length === 0) {
        console.log('No more images to load');
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      // No API call needed - we already have the Media objects
      const newPhotos: LoadedImage[] = nextBatch.map((item: Media) => ({
        id: item.id,
        media: item,
      }));
      
      console.log('Adding new photos:', newPhotos.length);
      setLoadedImages(prev => {
        const updated = [...prev, ...newPhotos];
        console.log('Total loaded images:', updated.length);
        return updated;
      });
      setCurrentIndex(prev => prev + BATCH_SIZE);

      // Check if we've loaded all images
      if (currentIndex + BATCH_SIZE >= totalImages) {
        console.log('All images loaded');
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more images:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [currentIndex, hasMore, images, isLoading]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          console.log('Loading more images via intersection observer');
          loadMoreImages();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before the loader comes into view
      }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef && hasMore) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [hasMore, isLoading, loadMoreImages]);

  // Manual load more handler
  const handleManualLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      console.log('Loading more images manually');
      loadMoreImages();
    }
  }, [hasMore, isLoading, loadMoreImages]);

  // Lightbox scroll prevention
  useEffect(() => {
    if (lightboxOpen) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollPositionRef.current}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';

      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
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

  // Load a single image by ID - now from populated objects
  const loadSingleImage = useCallback(async (imageId: number): Promise<LoadedImage | null> => {
    if (!images) return null;
    
    const mediaObjects = images as Media[];
    const foundImage = mediaObjects.find(img => img.id === imageId);
    
    if (foundImage) {
      return {
        id: foundImage.id,
        media: foundImage,
      };
    }
    return null;
  }, [images]);

  // Get current lightbox image - now from populated objects
  const getCurrentLightboxImage = useCallback(async (index: number): Promise<LoadedImage | null> => {
    if (!images || index < 0 || index >= (images as Media[]).length) return null;
    
    const mediaObjects = images as Media[];
    const imageId = mediaObjects[index].id;
    
    // Check if image is already in cache
    if (lightboxImageCache.has(imageId)) {
      return lightboxImageCache.get(imageId)!;
    }
    
    // Check if image is in loaded images (from carousel)
    const loadedImage = loadedImages.find(img => img.id === imageId);
    if (loadedImage) {
      setLightboxImageCache(prev => new Map(prev).set(imageId, loadedImage));
      return loadedImage;
    }
    
    // Get the image from populated objects (no API call needed)
    setLightboxLoading(true);
    const imageMedia = mediaObjects[index];
    const newImage: LoadedImage = {
      id: imageMedia.id,
      media: imageMedia,
    };
    setLightboxLoading(false);
    
    setLightboxImageCache(prev => new Map(prev).set(imageId, newImage));
    return newImage;
  }, [images, lightboxImageCache, loadedImages]);

  const goToPrevious = () => {
    if (!images) return;
    const totalImages = (images as Media[]).length;
    setSelectedIndex((prevIndex) => (prevIndex === 0 ? totalImages - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    if (!images) return;
    const totalImages = (images as Media[]).length;
    setSelectedIndex((prevIndex) => (prevIndex === totalImages - 1 ? 0 : prevIndex + 1));
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

    return () => {
      api.off("select", () => {})
      api.off("reInit", () => {})
    }
  }, [api])

  // Load current lightbox image when selected index changes
  useEffect(() => {
    if (lightboxOpen) {
      getCurrentLightboxImage(selectedIndex).then(image => {
        setCurrentLightboxImage(image);
      });
    }
  }, [lightboxOpen, selectedIndex, getCurrentLightboxImage]);

  // Function to scroll to a specific dot
  const scrollTo = useCallback(
    (index: number) => api?.scrollTo(index),
    [api]
  )

  // Generate responsive sizes string for carousel (optimized for card size: 640x480)
  const getSizes = () => {
    return "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw";
  };

  // Get image source for carousel (using card size: 640x480)
  const getCarouselImageSrc = (photo: LoadedImage) => {
    return photo.media.sizes?.card?.url || photo.media.sizes?.thumbnail?.url || photo.media.url;
  };

  // Get image source for lightbox (using tablet size: 1024x?)
  const getLightboxImageSrc = (photo: LoadedImage) => {
    return photo.media.sizes?.tablet?.url || photo.media.sizes?.card?.url || photo.media.url;
  };

  // If no images, return early
  if (!loadedImages.length && !isLoading) {
    return null;
  }

  return (
    <ContainedSection
      id={idHref || "galerija"}
      overlayClassName={overlayClass}
      verticalPadding="xl"
    >
      {(title || subtitle) && (
        <SectionHeading className='relative z-10'>
          {title && <SectionHeading.Title className={"text-dark text-center"}>{title}</SectionHeading.Title>}
          {subtitle && <SectionHeading.Description className={"text-dark text-center"}>{subtitle}</SectionHeading.Description>}
        </SectionHeading>
      )}

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {loadedImages.map((photo, index) => (
            <CarouselItem 
              key={photo.id} 
              className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg shadow-md group hover:shadow-lg transition-shadow duration-300">
                <PayloadImage
                  image={photo.media}
                  aspectRatio="square"
                  objectFit="cover"
                  sizes={getSizes()}
                  className="transition-transform duration-300 group-hover:scale-105"
                  placeholder={true}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Search className="w-8 h-8 text-white" />
                </div>
              </div>
            </CarouselItem>
          ))}
          
          {/* Loader item for lazy loading */}
          {(hasMore || isLoading) && (
            <CarouselItem className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div 
                ref={loaderRef}
                className="relative aspect-square overflow-hidden rounded-lg shadow-md flex items-center justify-center bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={handleManualLoadMore}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400 hover:text-gray-600">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={handleManualLoadMore}
                    >
                      Load More
                    </Button>
                    <span className="text-xs">
                      {loadedImages.length} / {images ? (images as Media[]).length : 0}
                    </span>
                  </div>
                )}
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>

      {/* Dynamic Dots Indicator */}
      {slideCount > 1 && (
        <div className="flex justify-center items-center pt-4 mt-8 space-x-2">
          {Array.from({ length: slideCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'block w-2.5 h-2.5 rounded-full transition-colors duration-200 bg-gray-400',
                index === currentSlide ? 'opacity-100' : 'opacity-50 hover:opacity-75'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
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
              <div className="relative max-w-full max-h-[90vh]">
                {lightboxLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-white" />
                  </div>
                ) : currentLightboxImage ? (
                  <PayloadImage
                    image={currentLightboxImage.media}
                    objectFit="contain"
                    style={{ 
                      maxHeight: '90vh', 
                      maxWidth: '100%',
                      width: 'auto',
                      height: 'auto'
                    }}
                    className="rounded-lg"
                    sizes="90vw"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-white">
                    <span>Image not found</span>
                  </div>
                )}
              </div>
              
              {/* Image counter */}
              <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {selectedIndex + 1} / {images ? (images as Media[]).length : 0}
              </div>
            </div>

            {/* Navigation buttons */}
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

            {/* Mobile swipe indicators */}
            <div className="sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-4 text-white/70 text-xs">
              <div className="flex items-center gap-1">
                <ChevronLeft size={16} />
                <span>Swipe</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {galleryCta && (
        <div className="text-center mt-8">
          {/* Add your CTA component here based on galleryCta structure */}
        </div>
      )}
    </ContainedSection>
  );
}