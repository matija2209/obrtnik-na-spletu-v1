import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ContainedSection } from '@/components/layout/container-section';
import type { ServicesBlock, Service, Media } from '@payload-types';
import { Button } from '@/components/ui/button';
import RichText from '@/components/payload/RichText';
import { getImageUrl } from '@/utilities/images/getImageUrl';
import getFirstImage from '@/utilities/images/getFirstImage';
import getImageAlt from '@/utilities/images/getImageAlt';
import { getIconComponent } from '@/utilities/getIcon';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import SectionHeading from '@/components/layout/section-heading';
import PayloadImage from '@/components/ui/PayloadImage';
import { extractIdsFromNullable } from '@/utilities/extractIds';
import { getServicesByIds } from '@/lib/payload';


// Service Card Component using shadcn/ui Card
const ServiceCard: React.FC<{
  service: Service;
}> = ({ service}) => {
  const IconComponent = getIconComponent(service.icon);
  const firstImage = service.images && service.images.length > 0 ? getFirstImage(service.images) : null;
  const imageSrc = firstImage ? getImageUrl(firstImage) : null;
  const imageAlt = firstImage ? getImageAlt(firstImage) : service.title || 'Service icon';

  

  return (
      <Card className="flex flex-col h-full shadow-sm border rounded-2xl">
        <CardHeader className="flex flex-col items-center">
          <div className="relative w-40 h-40 mb-6">
            {imageSrc && firstImage && (
              <div className="w-full h-full rounded-full border-2 border-primary overflow-hidden">
                <PayloadImage
                  image={firstImage}
                  alt={imageAlt}
                  className="w-full h-full object-cover"
                  context="thumbnail"
                />
              </div>
            )}
            {/* Icon overlay in circular background */}
            {IconComponent && (
              <div className={cn("absolute -top-2 -left-2 w-16 h-16  rounded-full flex items-center justify-center bg-primary",)}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
            )}
          </div>
          
          {service.title && (
            <h3 className={cn("text-xl font-semibold text-center")}>
              {service.title}
            </h3>
          )}
        </CardHeader>

        <CardContent className="flex flex-col flex-grow items-center ">
          {service.excerpt && (
            <div className={cn("text-base leading-relaxed text-center")}>
              {service.excerpt}
            </div>
          )}
          
          {service.priceDisplay && (
            <div className={cn("font-semibold text-center")}>
              {service.priceDisplay}
            </div>
          )}
        </CardContent>

        {service.showCta && service.slug && (
          <CardFooter className='flex items-center justify-center'>
            <Button asChild variant="default">
              <Link href={`/storitve/${service.slug}`}>
                Več o storitvi
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>

  );
};

// Services Grid Component - Split into two rows
const ServicesGrid: React.FC<{ services: Service[]; colorClasses?: ReturnType<typeof getColorClasses> }> = ({ services, colorClasses }) => {
  if (!services || services.length === 0) return null;

  const gridColsClasses = services.length < 5 ? "md:grid-cols-2" : "md:grid-cols-3"
  return (
    <div className="w-full max-md:max-w-full">
      {/* First Row */}
      {services.length > 0 && (
        <div className={cn("w-full grid grid-cols-1 gap-5", gridColsClasses)}>
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id || `service-${index}`} 
              service={service} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Benefits List Component (if needed for additional benefits)
// const BenefitsList: React.FC<Pick<ServicesBlock, 'benefits'>> = ({ benefits }) => {
//   if (!benefits || benefits.length === 0) return null;

//   return (
//     <div className="flex flex-col gap-4 mt-8">
//       {benefits.map((benefit, index) => {
//         if (typeof benefit === 'number') return null;
        
//         const IconComponent = benefit.icon ? getIconComponent(benefit.icon) : null;
        
//         return (
//           <div key={benefit.id || index} className="flex items-center gap-3">
//             {IconComponent && (
//               <div className="w-6 h-6 flex-shrink-0">
//                 <IconComponent className="w-full h-full text-primary" />
//               </div>
//             )}
//             <div className="flex-1">
//               {benefit.title && (
//                 <span className="font-semibold text-gray-900">{benefit.title}</span>
//               )}
//               {benefit.description && (
//                 <span className="text-gray-600 ml-1">{benefit.description}</span>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// Section Header Component
const SectionHeader: React.FC<Pick<ServicesBlock, 'title' | 'description'> & { colorClasses?: ReturnType<typeof getColorClasses> }> = ({ 
  title, 
  description,
  colorClasses
}) => {
  if (!title && !description) return null;

  return (
    <div className="text-center mb-16 max-md:mb-12">
      {title && (
        <h2 className={cn("text-4xl font-bold mb-4 max-md:text-3xl", colorClasses?.textClass)}>
          {title}
        </h2>
      )}
      {description && (
        <div className={cn("text-lg max-w-3xl mx-auto", colorClasses?.textClass)}>
          {description}
        </div>
      )}
    </div>
  );
};

// Main Component
export default async function ServicesSectionVariant8(props: ServicesBlock) {
  const { 
    selectedServices, 
    title, 
    description, 
    idHref,
    bgColor: backgroundColor,
    isTransparent
  } = props;

  // Extract IDs and fetch services data
  const serviceIds = extractIdsFromNullable(selectedServices);
  const services = serviceIds.length > 0 ? await getServicesByIds(serviceIds) : [];

  // Return early if no services
  if (services.length === 0) {
    return null;
  }

  // Get color classes and background styling
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  return (
    <ContainedSection 
      id={idHref ?? "services"}
      overlayClassName={overlayClass}
      verticalPadding="3xl"
    >
      <SectionHeading>
        <SectionHeading.Title>
          {title}
        </SectionHeading.Title>
        <SectionHeading.Description>
          {description}
        </SectionHeading.Description>
      </SectionHeading>
      <ServicesGrid services={services} />
      {/* <BenefitsList benefits={benefits} /> */}
    </ContainedSection>
  );
}