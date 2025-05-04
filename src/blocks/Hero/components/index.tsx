import type { HeroBlock } from "@payload-types"
import DefaultHeroBlock from "./default-hero-block"
import OneHeroSection from "./one-hero-section"
import { getImageUrl } from "@/utilities/getImageUrl"
import { validateCtas } from "@/utilities/validateCtas"

const HeroBlockComponent = ({ ...block }: HeroBlock) => {
  // Destructure with default values or ensure they are checked before use
  const { template, ctas, title, subtitle, image } = block

  // Early return if essential props are missing for default template
  if (
    template === 'default' &&
    (!ctas || !title || !subtitle || !image || typeof image === 'number')
  ) {
    console.warn("HeroBlockComponent: Missing essential props for default template.")
    return null
  }

  switch (template) {
    case "default": {
      // Ensure image is Media type before passing to getImageUrl
      const imageUrl = typeof image === 'object' && image !== null ? getImageUrl(image) : undefined
      // Validate CTAs ensure they are Cta objects
      const validCtas = validateCtas(ctas)

      // Ensure required props are strings and validCtas is not undefined before rendering
      if (!title || !subtitle || !imageUrl || !validCtas) {
        console.warn(
          "HeroBlockComponent: Could not render default template due to missing or invalid props.",
        )
        return null
      }
      return (
        <DefaultHeroBlock
          ctas={validCtas} // Pass validated CTAs
          title={title}
          subtitle={subtitle}
          imageUrl={imageUrl} // Pass validated image URL
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
