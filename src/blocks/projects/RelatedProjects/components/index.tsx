import React from 'react';
import {  RelatedProjectsBlock } from '@payload-types';
import DefaultRelatedProjectsSection from './DefaultRelatedProjectsSection';
import { SearchParams } from 'next/dist/server/request/search-params';

const RelatedProjectsBlockComponent = async ({ searchParams, ...block }: RelatedProjectsBlock  & { searchParams?: SearchParams }) => {
  switch (block.template) {
    case 'default':
      return <DefaultRelatedProjectsSection {...block} />
    case 'variant1':
      return <>Not defined yet</>
    default:
      return <DefaultRelatedProjectsSection {...block} />
  }
};

export default RelatedProjectsBlockComponent;
