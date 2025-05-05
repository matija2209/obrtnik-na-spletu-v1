import React from 'react';
import type { Media, Service } from '@payload-types';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image'; // Assuming usage of Next.js Image

// Helper to check if an object is a Media object
const isMediaObject = (item: string | number | Media | null | undefined): item is Media =>
  typeof item === 'object' && item !== null && 'url' in item;

// Define the props for the SimpleListServiceCard
interface SimpleListServiceCardProps {
  service: Service;
  // Add other props if needed
}

export const SimpleListServiceCard: React.FC<SimpleListServiceCardProps> = ({
  service,
}) => {
  const { title, description, images } = service;

  // Get the first image if available and it's a Media object
  const firstImage = Array.isArray(images) && images.length > 0 ? images[0]?.image : null;
  const imageMedia = isMediaObject(firstImage) ? firstImage : null;

  const renderVisual = () => {
    if (!imageMedia || !imageMedia.url) return null;

    const altText = imageMedia.alt || title || '';
    const srcUrl = imageMedia.url;

    // Use Next.js Image component for the visual
    return (
      <Image
        src={srcUrl}
        alt={altText}
        width={40} // Fixed width for list view icon/image
        height={40} // Fixed height for list view icon/image
        className="object-cover rounded" // Keep rounded for images
      />
    );
  };

  return (
    <div className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
      <div className="flex items-center">
        {imageMedia && (
          <div className="mr-4 flex-shrink-0"> {/* Increased margin */}
            {renderVisual()}
          </div>
        )}
        <div>
          <h3 className="font-medium text-base md:text-lg">{title}</h3> {/* Adjusted text size */}
          {description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p> /* Added line-clamp */
          )}
        </div>
        {/* Removed the CTA link - handled at block level */}
      </div>
    </div>
  );
};

export default SimpleListServiceCard; 