import React from 'react';
import type { RelatedProjectsBlock } from '@payload-types';
import DefaultRelatedProjectsSection from './DefaultRelatedProjectsSection';

/**
 * Server component wrapper that fetches related projects based on IDs
 * and passes them to the client component
 */
export default async function DefaultRelatedProjectsSectionWithData(props: RelatedProjectsBlock) {
  const { 
    relatedProjects,
    ...restProps 
  } = props;

  return (
    <DefaultRelatedProjectsSection
      {...restProps}
      relatedProjects={relatedProjects}
    />
  );
} 