import React from 'react';

import SubServicesBlockVariant1 from './SubServicesBlockVariant1';
import { SubServicesBlock } from '@payload-types';


const SubServicesBlockComponent = ({ ...block }: SubServicesBlock) => {

  switch (block.template) {
    case 'default':
    default:
      return (
        <SubServicesBlockVariant1 
          {...block}
        />
      );
  }
};

export default SubServicesBlockComponent; 