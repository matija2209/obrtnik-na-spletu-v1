import React from 'react';
import { Project, Media, Service, RelatedProjectsBlock } from '@payload-types';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PayloadImage from '@/components/PayloadImage';
import { Button } from '@/components/ui/button';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { getProjects } from '@/lib/payload';
import { extractIdsFromNullable } from '@/utilities/extractIds';

/**
 * Server component that fetches related projects based on IDs
 * and renders the related projects section
 */
export default async function DefaultRelatedProjectsSection(props: RelatedProjectsBlock) {
  const {
    title,
    subtitle,
    idHref,
    relatedProjects,
    bgc: backgroundColor,
    isTransparent
  } = props;  

  // Get color classes and background styling
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  return (
    <ContainedSection 
      id={idHref ?? "projekti"} 
      overlayClassName={overlayClass}
      verticalPadding="xl"
    >
      {/* Section Header */}
      <SectionHeading>
        <SectionHeading.Title className={"text-dark/80"}>
          {title}
        </SectionHeading.Title>
        {subtitle && (
          <SectionHeading.Description className={"text-dark/80"}>
            {subtitle}
          </SectionHeading.Description>
        )}
      </SectionHeading>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {relatedProjects && relatedProjects.map((project) => {
          const projectImage = (project as Project).projectImages?.[0];
          const imageMedia = projectImage && typeof projectImage.image1 === 'object' ? projectImage.image1 : null;

          return (
            <div key={(project as Project).id}>
              <Card>
                <CardHeader>
                  {imageMedia && (
                    <PayloadImage 
                      image={imageMedia} 
                      alt={projectImage?.altText1 || (project as Project).title}
                      aspectRatio="4/3"
                      objectFit="cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  <CardTitle className='text-xl'>{(project as Project).title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    {(project as Project).excerpt && <p className="text-sm opacity-75">{(project as Project).excerpt}</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button >
                    <Link href={`/projekti/${(project as Project).slug}`}>
                      Preberi več
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )
        })}
      </div>
    </ContainedSection>
  );
}
