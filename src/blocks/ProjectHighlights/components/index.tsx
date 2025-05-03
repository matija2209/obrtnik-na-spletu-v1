import ProjectsSection from './default-projects-section';
import type { ProjectHighlightsBlock as ProjectHighlightsBlockType, Project } from '@payload-types'; // Corrected type name

// Helper to check if an item is a Project object (not a number or string ID)
const isProjectObject = (item: string | number | Project): item is Project => typeof item === 'object' && item !== null;

const ProjectHighlightsBlock = ({ ...block }: ProjectHighlightsBlockType) => {
  // Assuming a template field exists, like in the About block
  switch (block?.template) {
    case 'default':
    default: // Defaulting to render ProjectsSection if template is not 'default' or not specified
      // Ensure highlightedProjects is an array of Project objects, handling potential null/undefined and filtering IDs
      const validProjects = (block.highlightedProjects ?? [])
        .map((proj: string | number | Project) => isProjectObject(proj) ? proj : null) // Added type annotation for proj
        .filter((proj: Project | null): proj is Project => proj !== null); // Added type annotation and fixed type predicate
        
      // If no valid projects after filtering, maybe render nothing or a message?
      // For now, we'll pass an empty array if none are valid.

      return (
        <ProjectsSection
          projects={validProjects}
          title={block.title ?? undefined} // Pass title from block data
          description={block.description ?? undefined} // Pass description from block data
        />
      );
      // Add other cases for different templates if needed
      // case 'anotherTemplate':
      //   return <AnotherComponent {...block} />;
  }

  // Fallback if no template matches (or block.template is undefined and no default case handles it)
  // return <div>Please select a template for the Project Highlights block.</div>; 
  // The default case above currently handles this, but you might want a specific message
};

export default ProjectHighlightsBlock;
