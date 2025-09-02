import ProjectsSection from './default-projects-section';
import type { ProjectHighlightsBlock } from '@payload-types';

const ProjectHighlightsBlockComponent = ({ ...block }: ProjectHighlightsBlock) => {
  switch (block?.template) {
    case 'default':
      return <ProjectsSection {...block} />
    default:
      return <ProjectsSection {...block} />
  }
}

export default ProjectHighlightsBlockComponent;
