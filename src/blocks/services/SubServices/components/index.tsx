import React from 'react';

import DefaultSubServicePresentationSection from './default-sub-service-presentation-section';
import { SubServicesBlock } from '@payload-types';
import { SearchParams } from 'next/dist/server/request/search-params';
import { Params } from 'next/dist/server/request/params';

const SubServicesBlockComponent = async ({ searchParams,params, ...block }: SubServicesBlock & { searchParams?: SearchParams ,params?:Params}) => {

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