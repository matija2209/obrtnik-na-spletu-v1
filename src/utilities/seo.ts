import type { Metadata } from 'next'
import type { Page, ServicePage, ProjectPage, ProductPage, Media } from '@payload-types'

type PageType = Page | ServicePage | ProjectPage | ProductPage

interface SEOConfig {
  title?: string
  description?: string
  image?: Media | null
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  noFollow?: boolean
  ogImageUrl?: string
}

export function generateSEOMetadata(config: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://laneks.si'
  const defaultTitle = 'Laneks d.o.o.'
  const defaultDescription = 'zanesljiv izvajalec gradbenih del po vsej Sloveniji. Od priprave terena, opornih zidov, komunalnih priključkov do končne ureditve okolice. Strokovno, hitro in kakovostno' 

  const seoTitle = config.title || defaultTitle
  const seoDescription = config.description || defaultDescription
  const seoUrl = config.url || baseUrl
  const seoImage = config.image

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: seoUrl,
      siteName: 'Laneks',
      locale: 'sl_SI',
      type: config.type || 'website',
      images: seoImage?.url ? [
        {
          url: seoImage.url,
          width: seoImage.width || 1200,
          height: seoImage.height || 630,
          alt: seoImage.alt || seoTitle,
        }
      ] : config.ogImageUrl ? [
        {
          url: config.ogImageUrl,
          width: 1200,
          height: 630,
          alt: seoTitle,
        }
      ] : [
        {
          url: `${baseUrl}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: seoTitle,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: seoImage?.url ? [seoImage.url] : config.ogImageUrl ? [config.ogImageUrl] : [`${baseUrl}/og-default.jpg`],
    },
    alternates: {
      canonical: seoUrl,
    },
    robots: {
      index: !config.noIndex,
      follow: !config.noFollow,
      googleBot: {
        index: !config.noIndex,
        follow: !config.noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generatePageSEOMetadata(
  page: PageType, 
  slug: string[], 
  options?: { noIndex?: boolean; noFollow?: boolean; ogImageUrl?: string }
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.laneks.si'
  const url = `${baseUrl}/${slug.join('/')}`
  
  const seoTitle = ""// page.meta?.title || page.title || undefined
  const seoDescription = ""//page.meta?.description || undefined
  const seoImage = "" // typeof page.meta?.image === 'object' && page.meta.image ? page.meta.image as Media : null

  return generateSEOMetadata({
    title: seoTitle,
    description: seoDescription,
    // image: seoImage,
    url,
    type: 'website',
    noIndex: options?.noIndex,
    noFollow: options?.noFollow,
    ogImageUrl: options?.ogImageUrl,
  })
}

export function generateBreadcrumbStructuredData(breadcrumbs: { name: string; url: string }[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://obrtniknaspletu.si'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: `${baseUrl}${breadcrumb.url}`,
    })),
  }
}

export function generateOrganizationStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://obrtniknaspletu.si'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Laneks',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      // Add social media URLs here if available
    ],
  }
}

export function generateServiceStructuredData(service: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://obrtniknaspletu.si'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description || service.meta?.description,
    provider: {
      '@type': 'Organization',
      name: 'Laneks',
      url: baseUrl,
    },
    url: `${baseUrl}/storitve/${service.slug}`,
  }
} 