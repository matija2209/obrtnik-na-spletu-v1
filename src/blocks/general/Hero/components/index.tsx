import type { Cta, HeroBlock, Media } from "@payload-types"
import DefaultHeroBlock from "./default-hero-block"
import OneHeroSection from "./one-hero-section"
import TwoColumnHeroBlock from "./two-column-hero-block"
import { getImageUrl } from "@/utilities/getImageUrl"
import { validateCtas } from "@/utilities/validateCtas"
import MissingFieldsAlert from "@/components/admin/MissingFieldsAlert"

const HeroBlockComponent = ({ ...block }: HeroBlock) => {
  // Destructure with default values or ensure they are checked before use
  const { template, ctas, kicker, title, subtitle, image, includeFollowersBadge, features } = block

  switch (template) {
    case "default": {
      // Ensure image is Media type before passing to getImageUrl
      const firstImage = Array.isArray(image) && image.length > 0 ? image[0] : undefined
      const imageUrl =
        typeof firstImage === "object" && firstImage !== null ? getImageUrl(firstImage) : undefined
      // Validate CTAs ensure they are Cta objects
      const validCtas = validateCtas(ctas)

      const missingFields: string[] = []
      if (!title) missingFields.push("Title")
      if (!subtitle) missingFields.push("Subtitle")
      if (!imageUrl) missingFields.push("Image")
      if (!validCtas || validCtas.length === 0) missingFields.push("CTAs")

      // Ensure required props are strings and validCtas is not undefined before rendering
      if (missingFields.length > 0) {
        return (
          <MissingFieldsAlert missingFields={missingFields} sectionName="Hero (Default)" />
        )
      }
      // By reaching this point, title, subtitle, imageUrl, and validCtas are guaranteed to be defined.
      return (
        <DefaultHeroBlock
          ctas={validCtas as Cta[]} // Cast because validation ensures it's Cta[] if not undefined
          kicker={kicker ?? undefined} // Pass kicker
          includeFollowersBadge={includeFollowersBadge ?? false} // Pass flag
          title={title as string} // Cast because check ensures it's a string
          subtitle={subtitle as string} // Cast because check ensures it's a string
          imageUrl={imageUrl as string} // Cast because check ensures it's a string
          // features prop can be passed if DefaultHeroBlock uses it
        />
      )
    }
    case "one-hero-section": {
      const validCtas = validateCtas(ctas)

      const firstImage = Array.isArray(image) && image.length > 0 ? image[0] : undefined
      const imageUrl =
        typeof firstImage === "object" && firstImage !== null ? getImageUrl(firstImage) : undefined

      // Use optional chaining or provide defaults
      const finalKicker = kicker ?? undefined
      const finalTitle = title ?? undefined
      const finalSubtitle = subtitle ?? undefined
      const finalIncludeFollowersBadge = includeFollowersBadge ?? false

      // Add validation if needed for this template

      return (
        <OneHeroSection
          ctas={validCtas}
          kicker={finalKicker} // Pass kicker
          includeFollowersBadge={finalIncludeFollowersBadge} // Pass flag
          imageUrl={imageUrl}
          title={finalTitle}
          subtitle={finalSubtitle}
          // features prop can be passed if OneHeroSection uses it
        />
      )
    }
    case "two-column-hero": { 
      // Validate required fields for this template
      const validCtas = validateCtas(ctas)
      const firstImage = Array.isArray(image) && image.length > 0 ? image[0] : undefined
      const imageUrl = typeof firstImage === "object" && firstImage !== null ? getImageUrl(firstImage) : undefined

      const missingFields: string[] = []
      if (!title) missingFields.push("Title")
      if (!subtitle) missingFields.push("Subtitle")
      if (!imageUrl) missingFields.push("Image")
      if (!validCtas || validCtas.length === 0) missingFields.push("CTA(s)")
      // Optionally validate features if they are required for the badges
      // if (!features || features.length === 0) missingFields.push("Features (for badges)")

      if (missingFields.length > 0) {
        return (
          <MissingFieldsAlert missingFields={missingFields} sectionName="Hero (Two Column)" />
        )
      }

      // All required fields are present and validated
      return (
        <TwoColumnHeroBlock
          // Pass validated/processed props explicitly
          ctas={validCtas as Cta[]} 
          imageUrl={imageUrl as string}
          imageAlt={typeof firstImage === 'object' ? firstImage?.alt : undefined}
          kicker={kicker ?? undefined}
          title={title as string}
          subtitle={subtitle as string}
          includeFollowersBadge={includeFollowersBadge ?? false} 
          features={features ?? []} // Pass features, default to empty array
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
