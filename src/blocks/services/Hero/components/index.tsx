import type { Cta } from "@payload-types"

import { validateCtas } from "@/utilities/validateCtas"
import MissingFieldsAlert from "@/components/admin/MissingFieldsAlert"
import DefaultServiceHeroBlock from "./default";

// Define our own interface since ServicesHeroBlock isn't yet in payload-types.ts
interface ServicesHeroBlockType {
  template: 'default';
  title?: string | null;
  subtitle?: string | null;
  ctas?: (number | Cta)[] | null;
  id?: string | null;
  blockName?: string | null;
  blockType: 'servicesHero';
}

const ServiceHeroBlockComponent = ({ ...block }: ServicesHeroBlockType) => {
  // Destructure with default values or ensure they are checked before use
  const { template, ctas, title, subtitle } = block

  switch (template) {
    case "default": {
      // Validate CTAs ensure they are Cta objects
      const validCtas = validateCtas(ctas)

      const missingFields: string[] = []
      if (!title) missingFields.push("Title")
      if (!subtitle) missingFields.push("Subtitle")
      if (!validCtas || validCtas.length === 0) missingFields.push("CTAs")

      // Ensure required props are strings and validCtas is not undefined before rendering
      if (missingFields.length > 0) {
        return (
          <MissingFieldsAlert missingFields={missingFields} sectionName="Service Hero (Default)" />
        )
      }
      
      return (
        <DefaultServiceHeroBlock
          ctas={validCtas as Cta[]} // Cast because validation ensures it's Cta[] if not undefined
          title={title as string} // Cast because check ensures it's a string
          subtitle={subtitle as string} // Cast because check ensures it's a string
        />
      )
    }
    default:
      return (
        <>
          Please select a template or ensure all required fields for the selected
          template are filled.
        </>
      )
  }
}

export default ServiceHeroBlockComponent 