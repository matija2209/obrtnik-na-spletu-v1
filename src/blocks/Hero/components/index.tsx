import type { Cta, HeroBlock } from "@payload-types"
import DefaultHeroBlock from "./default-hero-block"
import OneHeroSection from "./one-hero-section"
import { getImageUrl } from "@/utilities/getImageUrl"
import { validateCtas } from "@/utilities/validateCtas"
import MissingFieldsAlert from "@/components/admin/MissingFieldsAlert"

const HeroBlockComponent = ({ ...block }: HeroBlock) => {
  // Destructure with default values or ensure they are checked before use
  const { template, ctas, title, subtitle, image } = block

  switch (template) {
    case "default": {
      // Ensure image is Media type before passing to getImageUrl
      const imageUrl =
        typeof image === "object" && image !== null ? getImageUrl(image) : undefined
      // Validate CTAs ensure they are Cta objects
      const validCtas = validateCtas(ctas)

      const missingFields: string[] = []
      if (!title) missingFields.push("Title")
      if (!subtitle) missingFields.push("Subtitle")
      if (!imageUrl) missingFields.push("Image")
      if (!validCtas) missingFields.push("CTAs")

      // Ensure required props are strings and validCtas is not undefined before rendering
      if (missingFields.length > 0) {
        return (
          <MissingFieldsAlert missingFields={missingFields} sectionName="Hero" />
        )
      }
      // By reaching this point, title, subtitle, imageUrl, and validCtas are guaranteed to be defined.
      return (
        <DefaultHeroBlock
          ctas={validCtas as Cta[]} // Cast because validation ensures it's Cta[] if not undefined
          title={title as string} // Cast because check ensures it's a string
          subtitle={subtitle as string} // Cast because check ensures it's a string
          imageUrl={imageUrl as string} // Cast because check ensures it's a string
        />
      )
    }
    case "one-hero-section": {
      const validCtas = validateCtas(ctas)

      const imageUrl =
        typeof image === "object" && image !== null ? getImageUrl(image) : undefined

      // Use optional chaining or provide defaults
      const finalTitle = title ?? undefined
      const finalSubtitle = subtitle ?? undefined

      return (
        <OneHeroSection
          ctas={validCtas}
          imageUrl={imageUrl}
          title={finalTitle}
          subtitle={finalSubtitle}
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

export default HeroBlockComponent
