"use client"
import React, { useState, useMemo, useEffect } from 'react';
import PayloadImage from '@/components/PayloadImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product, ProductVariant } from '@payload-types';
import { combineProductImages } from '@/utilities/images/combineProductImages';


export default function ProductGallery({ 
    product, 
    variants,
    selectedVariant
}: { 
    product: Product;
    variants?: ProductVariant[];
    selectedVariant?: ProductVariant | null;
}) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Combine main image, variant images, and gallery images in priority order
    const combinedImages = useMemo(() => {
        return combineProductImages(product, variants, selectedVariant);
    }, [product, variants, selectedVariant]);

    const images = combinedImages;

    // Reset to first image when selected variant changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedVariant]);

    const nextImage = () => {
        if (images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (images.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    const buttonClassName = "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center";

    return (
        <div className="relative">
            {images.length > 0 ? (
                <>
                    {/* Main Image Display */}
                    <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden bg-gray-100 rounded-lg">
                        {images[currentImageIndex]?.mediaObject ? (
                            <PayloadImage
                                image={images[currentImageIndex].mediaObject!}
                                alt={images[currentImageIndex].altText}
                                className="h-full w-full object-contain"
                                context="card"
                                objectFit="contain"
                                aspectRatio="square"
                                priority={true}
                            />
                        ) : (
                            <img
                                className="h-full w-full object-contain"
                                src={images[currentImageIndex].src}
                                alt={images[currentImageIndex].altText}
                                loading="eager"
                            />
                        )}

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <div className="absolute bottom-[15%] flex w-full justify-center">
                                <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur-sm dark:border-black dark:bg-neutral-900/80">
                                    <button
                                        onClick={prevImage}
                                        aria-label="Previous product image"
                                        className={buttonClassName}
                                    >
                                        <ChevronLeft className="h-5" />
                                    </button>
                                    <div className="mx-1 h-6 w-px bg-neutral-500"></div>
                                    <button
                                        onClick={nextImage}
                                        aria-label="Next product image"
                                        className={buttonClassName}
                                    >
                                        <ChevronRight className="h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Grid */}
                    {images.length > 1 && (
                        <ul className="my-12 flex items-center flex-wrap justify-center gap-2 overflow-auto py-1 lg:mb-0">
                            {images.map((image, index) => {
                                const isActive = index === currentImageIndex;
                                return (
                                    <li key={`${image.src}-${index}`} className="h-20 w-20">
                                        <button
                                            onClick={() => setCurrentImageIndex(index)}
                                            aria-label="Select product image"
                                            className="h-full w-full"
                                        >
                                            <div
                                                className={cn(
                                                    "h-full w-full rounded-md overflow-hidden border-2 relative",
                                                    isActive ? 'border-primary' : 'border-gray-200'
                                                )}
                                            >
                                                {image.mediaObject ? (
                                                    <PayloadImage
                                                        image={image.mediaObject}
                                                        alt={image.altText}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                        context="thumbnail"
                                                        objectFit="cover"
                                                        aspectRatio="square"
                                                    />
                                                ) : (
                                                    <img
                                                        src={image.src}
                                                        alt={image.altText}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                )}
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </>
            ) : (
                <div className="bg-gray-100 rounded-lg flex items-center justify-center aspect-square">
                    <span className="text-gray-500">Slika ni na voljo</span>
                </div>
            )}
        </div>
    );
} 