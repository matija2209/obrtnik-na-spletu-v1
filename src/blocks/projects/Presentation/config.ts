import type { Block } from 'payload';

const ProjectPresentationBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Hero Block',
    plural: 'Hero Blocks',
  },
  fields: [
    {
      name:"idHref",
      type:"text",
      defaultValue:"projekti"
    },
  ]
};

export default ProjectPresentationBlock; 