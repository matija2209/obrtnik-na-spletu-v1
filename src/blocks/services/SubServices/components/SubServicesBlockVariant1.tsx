import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import SvgIcon from '@/components/svg-icon';
import { getSubServices } from '@/lib/payload';
import { extractIds } from '@/utilities/extractIds';
import { getBackgroundClass } from '@/utilities/getColorClasses';

import type { SubService, SubServicesBlock } from '@payload-types';
import { RichText } from '@payloadcms/richtext-lexical/react';
import React from 'react';


interface ServiceCardProps {
  service: SubService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <article className="relative border rounded-3xl border-light">
      <header className="px-8 pt-16 pb-8">
        <h2 className="text-2xl font-semibold leading-tight text-gray-900 max-md:text-2xl max-sm:text-xl mb-4">
          {service.title}
        </h2>

        {service.description && <RichText className='mb-4' data={service.description} />}

        {service.price && (
          <div className="mr-auto mt-auto">
            <span className="text-lg font-medium text-secondary">{service.price}</span>
          </div>
        )}
      </header>
      <SvgIcon className='text-white fill-white' icon={service.icon} />
    </article>
  );
};


const ServicesGrid = ({ subServices }:{subServices:(number | SubService)[] | null | undefined}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24  md:gap-y-16 gap-x-8">
      {subServices && subServices.map((service) => {
        if (typeof service === 'number') {
          return null;
        }
        return (
        <ServiceCard key={service.id} service={service} />
        )
      })}
    </div>
  );
};

// Demo component with sample data
const SubServicesBlockVariant1 = async (props: SubServicesBlock) => {
  const {subServices,bgc,isTransparent,title,description} = props
  
const subServicesIds = extractIds(subServices ?? [])
const subServicesData = await getSubServices(subServicesIds)

  const backgroundClass = isTransparent ? "bg-transparent" :  getBackgroundClass(bgc ?? "") 

  return (
    <ContainedSection overlayClassName={backgroundClass}>

<SectionHeading className='mb-20'>
  <SectionHeading.Title>
    {title}
  </SectionHeading.Title>
  <SectionHeading.Description>
    {description}
  </SectionHeading.Description>
</SectionHeading>
    <ServicesGrid subServices={subServicesData} />

    </ContainedSection>
  );
};

export default SubServicesBlockVariant1;