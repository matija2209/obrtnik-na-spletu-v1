import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ContainedSection } from '@/components/layout/container-section'
import { Button, buttonVariants } from '@/components/ui/button'
import type { VariantProps } from 'class-variance-authority'
import { Badge } from '@/components/ui/badge'
import { CalendarDays } from 'lucide-react'
import type { Cta, HeroBlock } from '@payload-types'

interface TwoColumnHeroBlockProps {
  kicker?: string
  title: string
  subtitle: string
  ctas: Cta[]
  imageUrl: string
  imageAlt?: string | null
  includeFollowersBadge: boolean
  features: NonNullable<HeroBlock['features']>
}

type ButtonVariant = VariantProps<typeof buttonVariants>['variant']

const mapCtaTypeToButtonVariant = (ctaType: Cta['ctaType']): ButtonVariant => {
  if (ctaType === 'icon') {
    return 'outline'
  }
  const validVariants: Array<ButtonVariant> = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
  if (ctaType && validVariants.includes(ctaType as ButtonVariant)) {
    return ctaType as ButtonVariant
  }
  return 'default'
}

const TwoColumnHeroBlock: React.FC<TwoColumnHeroBlockProps> = ({ 
  kicker,
  title,
  subtitle,
  ctas,
  imageUrl,
  imageAlt,
  includeFollowersBadge,
  features 
}) => {
  const primaryCta = ctas?.[0]

  let primaryCtaHref = '#'
  if (primaryCta) {
    if (primaryCta.link.type === 'internal' && primaryCta.link.internalLink && typeof primaryCta.link.internalLink === 'object' && primaryCta.link.internalLink.slug) {
      primaryCtaHref = `/page/${primaryCta.link.internalLink.slug}` 
    } else if (primaryCta.link.type === 'external' && primaryCta.link.externalUrl) {
      primaryCtaHref = primaryCta.link.externalUrl
    }
  }

  return (
    <ContainedSection verticalPadding="2xl" bgColor='bg-secondary'>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          {includeFollowersBadge && features && features.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pb-4">
              {features.map((feature) => (
                feature.text && (
                  <Badge key={feature.id} variant="default">
                    {feature.iconText && <span className="mr-1 font-semibold">{feature.iconText}</span>}
                    {feature.text}
                  </Badge>
                )
              ))}
            </div>
          )}
          {kicker && <p className="text-sm font-semibold uppercase text-primary">{kicker}</p>}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {title} 
          </h1>
          <p className="text-lg text-gray-600">
            {subtitle}
          </p>
          {primaryCta && (
            <Link 
              href={primaryCtaHref}
              className="block pt-4"
              target={primaryCta.link.newTab ? '_blank' : '_self'}
            >
              <Button 
                size={"lg"} 
                variant={mapCtaTypeToButtonVariant(primaryCta.ctaType)}
              >
                <CalendarDays className="mr-2 h-5 w-5" />
                {primaryCta.ctaText}
              </Button>
            </Link>
          )}
        </div>
        
        <div className="relative overflow-hidden rounded-lg shadow-md h-[400px] flex items-center justify-center">
          <Image 
            src={imageUrl}
            alt={imageAlt ?? title ?? 'Hero Image'}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </div>
    </ContainedSection>
  )
}

export default TwoColumnHeroBlock 