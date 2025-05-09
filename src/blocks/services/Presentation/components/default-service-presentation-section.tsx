import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { ContainedSection } from '@/components/layout/container-section';

interface Image {
  src: string;
  alt: string;
}

interface ServiceDetailSectionData {
  title: string;
  description: string;
  order: 'normal' | 'inverse';
  bulletPoints: string[];
  images: Image[];
}

interface ServicePresentationSectionProps {
  services: ServiceDetailSectionData[];
}

// Helper component for the 3-image grid layout
const ImageGrid: React.FC<{ images: Image[] }> = ({ images }) => {
  const [img1, img2, img3] = images;

  if (!img1) return null;

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-3 h-64 md:h-80 lg:h-96">
      {/* Large Image */}
      {img1 && (
        <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg shadow-md">
          <Image
            src={img1.src}
            alt={img1.alt}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
      )}
      {/* Small Image 1 */}
      {img2 && (
        <div className="col-span-1 row-span-1 relative overflow-hidden rounded-lg shadow-md">
          <Image
            src={img2.src}
            alt={img2.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
      )}
      {/* Small Image 2 */}
      {img3 && (
        <div className="col-span-1 row-span-1 relative overflow-hidden rounded-lg shadow-md">
          <Image
            src={img3.src}
            alt={img3.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
      )}
    </div>
  );
};

function DefaultServicePresentationSection({ services }: ServicePresentationSectionProps) {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <ContainedSection
      sectionClassName="bg-white"
      verticalPadding="xl"
      padding="md"
      maxWidth="7xl"
    >
      <div className="space-y-16 md:space-y-20">
        {services.map((service, index) => {
          const isInverse = service.order === 'inverse';
          return (
            <div
              key={service.title + index}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              {/* Image Grid */}
              <div className={cn('w-full', isInverse ? 'md:order-last' : 'md:order-first')}>
                {/* Ensure images array is passed correctly */}
                {service.images && service.images.length >= 1 ? (
                  <ImageGrid images={service.images} />
                ) : (
                  <div className="bg-gray-200 h-64 md:h-80 lg:h-96 rounded-lg flex items-center justify-center text-gray-500">No Images</div>
                )}
              </div>

              {/* Text Content */}
              <div className={cn('flex flex-col justify-center', isInverse ? 'md:order-first' : 'md:order-last')}>
                <h3 className="text-3xl md:text-4xl font-light text-primary mb-4">
                  {service.title}
                </h3>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                  {service.description}
                </p>
                {/* Render bullet points if they exist */}
                {service.bulletPoints && service.bulletPoints.length > 0 && (
                  <ul className="space-y-2 mt-4 text-gray-700">
                    {service.bulletPoints.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-1" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ContainedSection>
  );
}

export default DefaultServicePresentationSection; 