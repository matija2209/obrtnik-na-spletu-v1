import React from 'react';
import { AboutProjectBlock } from '@payload-types';
import DefaultAboutProjectSection from './DefaultAboutProjectSection';

const AboutProjectBlockComponent = ({ ...block }: AboutProjectBlock) => {
  switch (block.template) {
    case 'default':
      return <DefaultAboutProjectSection {...block} />

    default:
      return <DefaultAboutProjectSection {...block} />
  }
};

export default AboutProjectBlockComponent;
