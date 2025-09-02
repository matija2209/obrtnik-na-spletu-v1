'use client'

import { Home, ChevronRight } from 'lucide-react'
import React from 'react'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

interface BreadcrumbComponentProps {
  crumbs?: { title: string; href: string }[]
  showEllipsis?: boolean
  maxItems?: number
  showHome?: boolean
  className?: string
}

function BreadcrumbComponent({ 
  crumbs,
  showEllipsis = false, 
  maxItems = 3,
  showHome = true,
  className
}: BreadcrumbComponentProps) {
  const pathname = usePathname()
  
  // Generate breadcrumbs from pathname if no crumbs provided
  const generatedCrumbs = React.useMemo(() => {
    if (crumbs) return crumbs
    
    const segments = pathname.split('/').filter(Boolean)
    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      return { title, href }
    })
  }, [pathname, crumbs])

  // Handle ellipsis logic if there are too many items
  const shouldShowEllipsis = showEllipsis && generatedCrumbs.length > maxItems
  const displayCrumbs = shouldShowEllipsis 
    ? [...generatedCrumbs.slice(0, 1), ...generatedCrumbs.slice(-2)] 
    : generatedCrumbs

  // Don't render if we're on home page and no custom crumbs
  if (pathname === '/' && !crumbs) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home item */}
        {showHome && (
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className={cn("flex items-center gap-1.5 text-white/80 hover:text-gray-600 transition-colors", className)}>
              <Home className="w-4 h-4" />
              <span>Domov</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}

        {/* Show ellipsis if needed */}
        {shouldShowEllipsis && generatedCrumbs.length > maxItems && (
          <>
            {showHome && <BreadcrumbSeparator />}
            <BreadcrumbItem className={cn("text-white/80 hover:text-gray-600 transition-colors capitalize", className)}>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
          </>
        )}

        {/* Render breadcrumb items */}
        {displayCrumbs.map((crumb, index) => {
          const isLast = index === displayCrumbs.length - 1

          return (
            <React.Fragment key={`${crumb.href}-${index}`}>
              {(showHome || index > 0) && <BreadcrumbSeparator className={cn("text-white/80 hover:text-gray-600 transition-colors", className)} />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className={cn("text-white/80 hover:text-gray-600 transition-colors capitalize", className)}>{crumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className={cn("text-white/80 hover:text-gray-600 transition-colors", className)} href={crumb.href}>
                    {crumb.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadcrumbComponent