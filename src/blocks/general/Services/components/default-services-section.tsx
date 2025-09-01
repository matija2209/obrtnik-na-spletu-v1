import React from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import Image from 'next/image';
import { Service, ServicesBlock } from '@payload-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';
import RichText from '@/components/payload/RichText';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { extractIdsFromNullable } from '@/utilities/extractIds';
import { getServicesByIds } from '@/lib/payload';



const DefaultServicesSection: React.FC<ServicesBlock> = async (props) => {
  const { 
    title, 
    description, 
    selectedServices, 
    colourScheme,
    bgColor: backgroundColor,
    isTransparent
  } = props;

  // Get color classes and background styling
  const colorClasses = getColorClasses((colourScheme as ColorScheme) || 'primary');
  const backgroundClass = getBackgroundClass( backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  // Extract IDs and fetch services data
  const serviceIds = extractIdsFromNullable(selectedServices);
  const validServices = serviceIds.length > 0 ? await getServicesByIds(serviceIds) : [];
  
  return (
    <ContainedSection
      id="storitve"
      overlayClassName={overlayClass}
      verticalPadding="2xl"
    >
      <SectionHeading>
        <SectionHeading.Title >{title}</SectionHeading.Title>
        <SectionHeading.Description >{description}</SectionHeading.Description>
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">
        {validServices.map((service) => (
          <Card key={service.id} className={cn("p-6 h-full", colorClasses.badgeClass)}>
            <CardHeader className="space-y-2 p-0 mb-4">
              <CardTitle className={cn("text-xl font-bold", colorClasses.textClass)}>{service.title}</CardTitle>
              
              </CardHeader>
            <CardContent className="p-0 space-y-4">
            <div className={colorClasses.textClass}>
              <RichText data={service.description as any}/>
            </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ContainedSection>
  );
};

export default DefaultServicesSection;