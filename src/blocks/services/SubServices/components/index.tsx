import React from 'react';

import DefaultSubServicePresentationSection from './default-sub-service-presentation-section';
import { SubServicesBlock } from '@payload-types';
import { SearchParams } from 'next/dist/server/request/search-params';


const SubServicesBlockComponent = async ({ searchParams, ...block }: SubServicesBlock & { searchParams?: SearchParams }) => {

  switch (block.template) {
    case 'default':
    default:
      return (
        <DefaultSubServicePresentationSection 
          {...block}
        />
      );
  }
};

export default SubServicesBlockComponent; 