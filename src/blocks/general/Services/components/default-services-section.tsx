import React from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import Image from 'next/image';
import { Service } from '@payload-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';

interface ServicesSectionProps {
  services: Service[];
  title?: string;
  description?: string;
}

const DefaultServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  title = 'Naše Storitve',
  description = 'Naše storitve diamantnega rezanja in vrtanja betona so vam na voljo širom Slovenije. Z veseljem se odzovemo na povpraševanja iz vseh slovenskih regij, pri čemer trenutno ne pokrivamo le območja Štajerske.'
}) => {
  return (
    <ContainedSection
      id="storitve"
      bgColor="bg-primary"
      verticalPadding="2xl"
    >
      <SectionHeading>
        <SectionHeading.Title className='text-primary-foreground'>{title}</SectionHeading.Title>
        <SectionHeading.Description className='text-primary-foreground'>{description}</SectionHeading.Description>
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">
        {services.map((service) => (
          <Card key={service.id} className="p-6 h-full">
            <CardHeader className="space-y-2 p-0 mb-4">
              <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
              <p className="text-gray-700">{service.description}</p>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              {service.features?.map((feature) => (
                <div key={feature.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <CheckIcon className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-sm">{feature.featureText}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </ContainedSection>
  );
};

export default DefaultServicesSection;
