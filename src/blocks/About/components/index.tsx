import type { HeroBlock, Cta, Media } from "@payload-types"
import DefaultAboutMeSection from "./default-about-section"
import { getImageUrl } from "@/utilities/getImageUrl"

// Helper to check if an item is a Cta object (not a number)
const isCtaObject = (item: number | Cta): item is Cta => typeof item === 'object' && item !== null;

const AboutBlock = ({ ...block }: HeroBlock) => {
  
  switch (block?.template) {
    case "default":
      // Ensure image is a Media object
      const imageObject = typeof block.image === 'object' && block.image !== null ? block.image : undefined;
      // Ensure ctas is an array of Cta objects, handling null and filtering numbers
      const ctaObjects = (block.ctas ?? []).filter(isCtaObject);

      return <DefaultAboutMeSection 
               title={block.title ?? undefined}
               subtitle={block.subtitle ?? undefined}
               ctas={ctaObjects.length > 0 ? ctaObjects : undefined}
               imageUrl={getImageUrl(imageObject)}
             />
    default:
      return (
        <>Please select a template</>
      )
  }
}

export default AboutBlock
