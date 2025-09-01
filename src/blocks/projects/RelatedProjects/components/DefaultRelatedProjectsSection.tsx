import React from 'react';
import { Project, Media, Service, RelatedProjectsBlock } from '@payload-types';
import Link from 'next/link';
import getFirstImage from '@/utilities/images/getFirstImage';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PayloadImage from '@/components/ui/PayloadImage';
import { Button } from '@/components/ui/button';
import { RichText } from '@payloadcms/richtext-lexical/react';
import getProjectImage from '@/utilities/images/getProjectImage';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { extractIdsFromNullable } from '@/utilities/extractIds';
import { getProjectsByIds } from '@/lib/payload';


const DefaultRelatedProjectsSection: React.FC<RelatedProjectsBlock> = async (props) => {
  const {
    title,
    description,
    idHref,
    relatedProjects,
    colourScheme,
    bgColor: backgroundColor,
    isTransparent
  } = props;

  // Get color classes and background styling
  const colorClasses = getColorClasses((colourScheme as ColorScheme) || 'primary');
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  // Extract IDs and fetch projects data
  const projectIds = extractIdsFromNullable(relatedProjects);
  const projects = projectIds.length > 0 ? await getProjectsByIds(projectIds) : [];

  if (projects.length === 0) {
    return null;
  }

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
        {description && (
          <SectionHeading.Description className={"text-dark/80"}>
            {description}
          </SectionHeading.Description>
        )}
      </SectionHeading>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {projects.map((project) => {
          const image = getProjectImage(project.projectImages?.[0]);
          const firstProjectImage = project.projectImages?.[0];
          const mediaImage = firstProjectImage && typeof firstProjectImage === 'object' && 'image1' in firstProjectImage 
            ? (typeof firstProjectImage.image1 === 'object' ? firstProjectImage.image1 : null)
            : null;

          return (
            <div key={project.id}>
              <Card>
                <CardHeader>
                  {mediaImage ? (
                    <PayloadImage
                      image={mediaImage as Media}
                      alt={image.alt}
                      className="w-full h-full object-cover rounded-t-lg"
                      context="card"
                      objectFit="cover"
                      aspectRatio="4/3"
                    />
                  ) : (
                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  )}
                  <CardTitle className='text-xl'>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    {project.excerpt && <p className="text-sm opacity-75">{project.excerpt}</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className={colorClasses.primaryButtonClass}>
                    <Link href={`/projekti/${project.slug}`}>
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
};

export default DefaultRelatedProjectsSection;
