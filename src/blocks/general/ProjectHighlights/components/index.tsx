import { SearchParams } from 'next/dist/server/request/search-params';
import { Params } from 'next/dist/server/request/params';import ProjectHighlightsSectionVariant2 from './ProjectHighlightsSectionVariant2';
import type { ProjectHighlightsBlock } from '@payload-types';
import { Suspense } from 'react';

const ProjectHighlightsBlockComponent = async ({ searchParams,params, ...block }: ProjectHighlightsBlock  & { searchParams?: SearchParams ,params?:Params}) => {
  switch (block?.template) {
    case 'default':
    case 'variant1':
    case 'variant2':
    default:
      return (
        <Suspense fallback={<div>Nalaganje projektov...</div>}>
          <ProjectHighlightsSectionVariant2 {...block} />
        </Suspense>
      )
  }
}

export default ProjectHighlightsBlockComponent;
