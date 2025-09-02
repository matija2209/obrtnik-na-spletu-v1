'use client';

import React, { useState } from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import PayloadImage from '@/components/PayloadImage';
import { Media, Project, ProjectHighlightsBlock, Cta } from '@payload-types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { getCtas, getProjects } from '@/lib/payload';
import { extractIdsFromNullable } from '@/utilities/extractIds';

// Helper type for project images
// Correctly get the type of the elements in the projectImages array
type ProjectImage = NonNullable<Project['projectImages']>[number];


const ProjectsSection = async(props: ProjectHighlightsBlock) => {
  const { 
    highlightedProjects, 
    title, 
    description, 
    cta, 
    bgc,
    isTransparent
  } = props;

    
  // Get color classes and background styling
  const backgroundClass = getBackgroundClass(bgc as string);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;
  
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Projects are already validated and fetched as populated objects
  const validProjects = highlightedProjects as Project[] || [];

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Return early if no valid projects
  if (validProjects.length === 0) {
    return null;
  }

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setSelectedImageIndex(0);
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (!selectedProject?.projectImages || selectedProject.projectImages.length === 0) return;

    const imageCount = selectedProject.projectImages.length;
    if (direction === 'next') {
      setSelectedImageIndex((prev) => (prev + 1) % imageCount);
    } else {
      setSelectedImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
    }
  };

  // Touch event handlers for mobile swipe
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isSwipeLeft = distance > minSwipeDistance;
    const isSwipeRight = distance < -minSwipeDistance;

    if (isSwipeLeft) {
      navigateImage('next');
    } else if (isSwipeRight) {
      navigateImage('prev');
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Helper function to get image source and alt text for Image 1
  const getImageData = (img: ProjectImage | undefined) => {
    if (!img) return null;

    // Use image1 as the primary image source
    const imageObj = img.image1 as Media | undefined; 

    return {
      image: typeof imageObj === 'object' ? imageObj : null,
      alt: img.altText1 || 'Project Image', // Use altText1
    };
  };
  
  // Basic Rich Text extraction (placeholder)
  // TODO: Replace with a proper RichText renderer component
  const renderRichText = (richText: any): string => {
    try {
      // Attempt to extract the first text node's content
      return richText?.root?.children?.[0]?.children?.[0]?.text || '';
    } catch (error) {
      console.error("Error rendering rich text:", error);
      return ''; // Return empty string on error
    }
  };


  return (
    <ContainedSection
      id="projekti"
      overlayClassName={overlayClass}
      verticalPadding="2xl"
      className='static'
    >
      <SectionHeading>
        <SectionHeading.Title >{title ?? 'Naši Projekti'}</SectionHeading.Title>
        <SectionHeading.Description >{description ?? 'Preberite več o naših nedavnih projektih in si oglejte našo galerijo del.'}</SectionHeading.Description>
      </SectionHeading>
      <div className='relative z-50'>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {validProjects.map((project) => {
          const firstImageData = getImageData(project.projectImages?.[0]);
          return (
            <Card key={project.id} className="overflow-hidden group transition-all duration-300 hover:shadow-lg">
              {project.projectImages && project.projectImages.length > 0 && firstImageData?.image && (
                <div className="relative h-60 w-full overflow-hidden">
                  <PayloadImage
                    image={firstImageData.image}
                    alt={firstImageData.alt || project.title}
                    aspectRatio="16/9"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle >{project.title}</CardTitle>
                {project.location && (
                  <p className={cn("text-sm", "opacity-70")}>{project.location}</p>
                )}
              </CardHeader>
              <CardContent>
                {/* Using basic rich text extraction */}
                <p className={cn("line-clamp-3 text-sm", "opacity-80")}>
                  {/* {renderRichText(project.description)} */}
                  {project.excerpt}
                </p>
              </CardContent>
              <CardFooter>
                <button
                  onClick={() => openProject(project)}
                  className={cn("font-medium flex items-center relative hover:underline")}
                >
                  Preberi več
                </button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* CTA Buttons - Positioned at the bottom with proper spacing and styling */}
      {cta && cta.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 pt-8 border-t border-gray-200">
          {(cta as Cta[]).map((ctaItem) => {
            return (
              <Button 
                key={ctaItem.id} 
                asChild 
                variant="outline"
                size="lg"
                className={cn("min-w-[200px]")}
              >
                <Link href={ctaItem.link?.url || '#'}>
                  {ctaItem.ctaText}
                </Link>
              </Button>
            );
          })}
        </div>
      )}

      {/* Project Lightbox */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 md:p-8"
          onClick={closeProject}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative max-w-6xl w-full h-full flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 bg-white/80 text-black p-3 rounded-full cursor-pointer z-20 hover:bg-white transition-colors shadow-md"
              onClick={closeProject}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            {/* Image section */}
            <div className="relative flex-grow flex items-center justify-center h-1/2 md:h-full">
              {selectedProject.projectImages && selectedProject.projectImages.length > 0 && (
                <div className="relative w-full h-full max-h-[60vh] md:max-h-full">
                  {(() => {
                     const currentImageData = getImageData(selectedProject.projectImages?.[selectedImageIndex]);
                     return currentImageData?.image ? (
                       <PayloadImage
                         image={currentImageData.image}
                         alt={currentImageData.alt || selectedProject.title}
                         objectFit="contain"
                         className="max-h-full max-w-full"
                         sizes="90vw"
                       />
                     ) : (
                       <div className="flex items-center justify-center h-64 text-white">
                         <span>Image not found</span>
                       </div>
                     );
                  })()}

                  {/* Navigation arrows */}
                  {selectedProject.projectImages.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-black p-4 rounded-full z-10 hover:bg-white transition-colors shadow-md hidden sm:block"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage('prev');
                        }}
                        aria-label="Previous image"
                      >
                        <ArrowLeft size={24} />
                      </button>
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-black p-4 rounded-full z-10 hover:bg-white transition-colors shadow-md hidden sm:block"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage('next');
                        }}
                        aria-label="Next image"
                      >
                        <ArrowRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Image counter */}
                  {selectedProject.projectImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-black bg-white/80 px-4 py-2 rounded-full shadow-md">
                      {selectedImageIndex + 1} / {selectedProject.projectImages.length}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Project details */}
            <div className="bg-white md:w-1/3 p-6 overflow-y-auto mt-4 md:mt-0 md:ml-4 rounded-lg h-1/2 md:h-full">
              <h2 className="text-2xl font-bold mb-2">{selectedProject.title}</h2>
              {selectedProject.location && (
                <p className="text-sm text-muted-foreground mb-4">{selectedProject.location}</p>
              )}
              <div className="prose max-w-none">
                 {/* Using basic rich text extraction */}
                 {/* TODO: Replace with a proper RichText renderer component */}
                 <p>{renderRichText(selectedProject.description)}</p>
              </div>

              {/* Thumbnail navigation for gallery */}
              {selectedProject.projectImages && selectedProject.projectImages.length > 1 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Galerija:</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selectedProject.projectImages.map((img, index) => {
                      const thumbnailData = getImageData(img);
                      return (
                        <div
                          key={index}
                          className={`relative h-16 cursor-pointer border-2 ${
                            index === selectedImageIndex ? 'border-primary' : 'border-transparent'
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          {thumbnailData?.image ? (
                            <PayloadImage
                              image={thumbnailData.image}
                              alt={thumbnailData.alt || `Image ${index + 1}`}
                              aspectRatio="square"
                              objectFit="cover"
                              className="rounded"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500">No image</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Link href={`/projekti/${selectedProject.slug}`}>
                    <Button variant="outline" size="lg" className="mt-4">
                      Preberi več
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </ContainedSection>
  );
};

export default ProjectsSection;