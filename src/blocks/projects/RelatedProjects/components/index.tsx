import React from 'react';
import {  RelatedProjectsBlock } from '@payload-types';
import DefaultRelatedProjectsSection from './DefaultRelatedProjectsSection';

const RelatedProjectsBlockComponent = ({...block}: RelatedProjectsBlock) => {
  switch (block.template) {
    case 'default':
      return <DefaultRelatedProjectsSection {...block} />
    default:
      return <DefaultRelatedProjectsSection {...block} />
  }
};

export default RelatedProjectsBlockComponent;
