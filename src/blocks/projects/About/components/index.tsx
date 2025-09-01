import React from 'react';
import { AboutProjectBlock } from '@payload-types';
import DefaultAboutProjectSection from './DefaultAboutProjectSection';
import { SearchParams } from 'next/dist/server/request/search-params';



const AboutProjectBlockComponent = async ({ searchParams, ...block }: AboutProjectBlock  & { searchParams?: SearchParams }) => {
  switch (block.template) {
    case 'default':
      return <DefaultAboutProjectSection {...block} />
    case 'variant1':
    default:
      return <DefaultAboutProjectSection {...block} />
  }
};

export default AboutProjectBlockComponent;
