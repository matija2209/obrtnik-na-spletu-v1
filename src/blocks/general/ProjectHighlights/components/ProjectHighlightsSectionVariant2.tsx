import React from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import PayloadImage from '@/components/ui/PayloadImage';
import { Media, Project, ProjectHighlightsBlock } from '@payload-types';
import { Calendar, MapPin } from 'lucide-react';
import { getImageUrl } from '@/utilities/images/getImageUrl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import getFirstImage from '@/utilities/images/getFirstImage';
import RichText from '@/components/payload/RichText';
import CtaButtons from '@/components/common/cta-buttons';
import { extractIdsFromNullable } from '@/utilities/extractIds';
import { getProjectsByIds } from '@/lib/payload';

// Helper type for project images
type ProjectImage = NonNullable<Project['projectImages']>[number];

// Tag component
const Tag = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => (
  <span className={cn(
    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
    className
  )}>
    {children}
  </span>
);

// ProjectCard component
interface ProjectCardProps extends Project {

}

const ProjectCard: React.FC<ProjectCardProps> = ({  ...project }) => {
  const firstImageData = getImageData(project.projectImages?.[0]);

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('sl-SI', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch {
      return dateString;
    }
  };

  // Get tags from services
  const tags = project.servicesPerformed?.filter(service => 
    typeof service === 'object' && service !== null && 'title' in service
  ).map(service => (service as any).title) || [];

  return (
    <Card className={cn(
      "h-full flex flex-col transition-all duration-300 hover:shadow-lg",
      "bg-card border-borde border",
    )}>
      <CardHeader className="">
        <div className="h-[281px] w-full relative overflow-hidden rounded-lg">
          {firstImageData.imageObj ? (
            <PayloadImage
              image={firstImageData.imageObj}
              alt={firstImageData.alt || project.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              context="card"
            />
          ) : (
            <img
              src={firstImageData.src}
              alt={firstImageData.alt || project.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        <CardTitle className={cn(
          "text-xl font-bold",

        )}>
          {project.title}
        </CardTitle>
        
        {project.excerpt && (
          <CardDescription className={cn(


          )}>
            {project.excerpt}
          </CardDescription>
        )}
        
        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {project.metadata?.completionDate && (
              <div className="flex items-center gap-2">
                <Calendar className={cn("w-4 h-4")} />
                <span className={cn("text-sm")}>
                  {formatDate(project.metadata?.completionDate || project.metadata?.startDate || undefined)}
                </span>
              </div>
            )}
            {project.location && (
              <div className="flex items-center gap-2">
                <MapPin className={cn("w-4 h-4")} />
                <span className={cn("text-sm")}>
                  {project.location}
                </span>
              </div>
            )}
          </div>
          
          {tags.length > 0 && (
            <div className="flex items-start gap-2 flex-wrap">
              {tags.slice(0, 3).map((tag, index) => (
                <Tag key={index} >
                  {tag}
                </Tag>
              ))}
              {tags.length > 3 && (
                <Tag >
                  +{tags.length - 3}
                </Tag>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button 
          asChild 
          className={cn("w-full")}
        >
          <Link href={`/projekti/${project.slug}`}>
            Več o projektu
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper function to get image source and alt text for Image 1
const getImageData = (img: ProjectImage | undefined) => {
  if (!img) return { src: '/placeholder-image.jpg', alt: 'Placeholder Image', imageObj: null };

  const imageObj = img.image1 as Media | undefined; 

  return {
    src: imageObj ? getImageUrl(imageObj) || '/placeholder-image.jpg' : '/placeholder-image.jpg',
    alt: img.altText1 || 'Project Image',
    imageObj: imageObj || null,
  };
};

const ProjectHighlightsSectionVariant2: React.FC<ProjectHighlightsBlock> = async (props) => {
  const { 
    highlightedProjects, 
    title, 
    description, 
    cta,
    colourScheme,
    bgColor: backgroundColor,
    isTransparent
  } = props;

  // Extract IDs and fetch project data
  const projectIds = extractIdsFromNullable(highlightedProjects);
  const validProjects = projectIds.length > 0 ? await getProjectsByIds(projectIds) : [];

  // Return early if no valid projects
  if (validProjects.length === 0) {
    return null;
  }

  // Get color classes and background styling
  const colorClasses = getColorClasses((colourScheme as ColorScheme) || 'primary');
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  return (
    <ContainedSection
      id="projekti"
      overlayClassName={overlayClass}
      verticalPadding="3xl"
      maxWidth="7xl"
      padding="lg"
    >
      <SectionHeading>
        <SectionHeading.Title>
          {title ?? 'Naši Projekti'}
        </SectionHeading.Title>
        <SectionHeading.Description>
          {description ?? 'Preberite več o naših nedavnih projektih in si oglejte našo galerijo del.'}
        </SectionHeading.Description>
      </SectionHeading>

      {/* Project Grid - CSS Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {validProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            {...project} 
          />
        ))}
      </div>

      {/* CTA Buttons */}
      {cta && cta.length > 0 && (
        <CtaButtons ctas={cta} variant='default' />
      )}
    </ContainedSection>
  );
};

export default ProjectHighlightsSectionVariant2;