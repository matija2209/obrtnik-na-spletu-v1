import React from 'react';
import PayloadImage from '@/components/ui/PayloadImage';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { ServicesBlock, Service, Media, SubServicesBlock, SubService } from '@payload-types';
import { Button } from '@/components/ui/button';
import RichText from '@/components/payload/RichText';
import { getImageUrl } from '@/utilities/images/getImageUrl';
import getFirstImage from '@/utilities/images/getFirstImage';
import getImageAlt from '@/utilities/images/getImageAlt';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { extractIdsFromNullable } from '@/utilities/extractIds';
import { getSubServicesByIds } from '@/lib/payload';

// Helper component for the 3-image grid layout
interface ImageGridProps {
  images: Media[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const [img1, img2, img3] = images;

  if (!img1) return null;

  const img1Src = getImageUrl(img1);
  const img1Alt = getImageAlt(img1);
  const img2Src = img2 ? getImageUrl(img2) : null;
  const img2Alt = img2 ? getImageAlt(img2) : '';
  const img3Src = img3 ? getImageUrl(img3) : null;
  const img3Alt = img3 ? getImageAlt(img3) : '';

  return (
    <div className="grid grid-cols-12 grid-rows-12 gap-3 h-64 md:h-80 lg:h-96">
      {/* Large Image */}
      <div className="col-span-8 row-start-2 row-span-10 relative overflow-hidden rounded-lg">
        <PayloadImage
          image={img1}
          alt={img1Alt}
          className="absolute inset-0 w-full h-full object-cover rounded-3xl transition-transform duration-300 ease-in-out hover:scale-105"
          context="card"
        />
      </div>
      
      {/* Small Image 1 */}
      {img2 && (
        <div className="col-span-3 row-span-4 relative overflow-hidden rounded-lg">
          <PayloadImage
            image={img2}
            alt={img2Alt}
            className="absolute inset-0 w-full h-full object-cover rounded-3xl transition-transform duration-300 ease-in-out hover:scale-105"
            context="thumbnail"
          />
        </div>
      )}
      
      {/* Small Image 2 */}
      {img3 && (
        <div className="col-span-4 row-span-8 relative overflow-hidden rounded-lg">
          <PayloadImage
            image={img3}
            alt={img3Alt}
            className="absolute inset-0 w-full h-full object-cover rounded-3xl transition-transform duration-300 ease-in-out hover:scale-105"
            context="card"
          />
        </div>
      )}
    </div>
  );
};

// Service Item Component
interface ServiceItemProps {
  service: SubService;
  index: number;
  colorClasses?: ReturnType<typeof getColorClasses>;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ service, index, colorClasses }) => {
  const isInverse = index % 2 === 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      {/* Image Grid */}
      <div className={cn('w-full', isInverse ? 'md:order-last' : 'md:order-first')}>
        {service.images && service.images.length >= 1 ? (
          <ImageGrid images={service.images as Media[]} />
        ) : (
          <div className="bg-gray-200 h-64 md:h-80 lg:h-96 rounded-lg flex items-center justify-center text-gray-500">
            No Images
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className={cn('flex flex-col justify-center', isInverse ? 'md:order-first' : 'md:order-last')}>
        <h3 className={cn("text-2xl md:text-3xl mb-4")}>
          {service.title}
        </h3>
        
        {service.description && (
          <div className={cn("text-base leading-relaxed mb-4 ")}>
            <RichText 
              enableProse={false} 
              data={service.description} 
              className="prose prose-lg dark:text-foreground/80" 
            />
          </div>
        )}

        {/* Price Display */}
        {service.price && (
          <div className={cn("mb-4 font-semibold text-lg")}>
            {service.price}
          </div>
        )}

        {/* CTA Button - SubServices don't have showCta or ctaText, so using slug if available */}
        {service.slug && (
          <div className="mt-6">
            <Button asChild>
              <Link href={`/storitve/${service.slug}`}>
                Več o storitvi
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};


// Main Component
export default async function DefaultSubServicePresentationSection(props: SubServicesBlock) {
  const { 
    selectedSubServices, 
    title, 
    description, 
    idHref,
    colourScheme,
    bgColor: backgroundColor,
    isTransparent
  } = props;

  // Get color classes and background styling
  const colorClasses = getColorClasses((colourScheme as ColorScheme) || 'primary');
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  // Extract IDs and fetch sub-services data
  const subServiceIds = extractIdsFromNullable(selectedSubServices);
  const services = subServiceIds.length > 0 ? await getSubServicesByIds(subServiceIds) : [];

  if (services.length === 0) {
    return null;
  }

  return (
    <ContainedSection 
      id={idHref ?? "services"}
      overlayClassName={overlayClass}
      verticalPadding="2xl"
    >
<SectionHeading className="mb-16 max-md:mb-12">
      {title && (
        <SectionHeading.Title className={cn("text-4xl md:text-5xl font-light")}>
          {title}
        </SectionHeading.Title>
      )}
      {description && (
        <SectionHeading.Description className={cn("text-lg max-w-3xl mx-auto",)}>
          {description}
        </SectionHeading.Description>
      )}
    </SectionHeading>      
      <div className="space-y-16 md:space-y-32">
        {services.map((service, index) => (
          <ServiceItem 
            key={service.id || `service-${index}`} 
            service={service} 
            index={index}
          />
        ))}
      </div>
    </ContainedSection>
  );
}  