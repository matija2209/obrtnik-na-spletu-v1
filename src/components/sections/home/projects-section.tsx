'use client';

import React, { useState } from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import Image from 'next/image';
import { Media, Project } from '@payload-types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { getImageUrl } from '@/utils/getImageUrl';


interface ProjectsSectionProps {
  projects: Project[];
  title?: string;
  description?: string;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  title = 'Naši Projekti',
  description = 'Preberite več o naših nedavnih projektih in si oglejte našo galerijo del.'
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setSelectedImageIndex(0);
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (!selectedProject?.images || selectedProject.images.length === 0) return;

    if (direction === 'next') {
      setSelectedImageIndex((prev) => (prev + 1) % selectedProject.images!.length);
    } else {
      setSelectedImageIndex((prev) => (prev - 1 + selectedProject.images!.length) % selectedProject.images!.length);
    }
  };

  // Touch event handlers for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
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

  return (
    <ContainedSection
      id="projekti"
      bgColor="bg-white"
      verticalPadding="2xl"
    >
      <SectionHeading>
        <SectionHeading.Title>{title}</SectionHeading.Title>
        <SectionHeading.Description>{description}</SectionHeading.Description>
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden group transition-all duration-300 hover:shadow-lg">
            {project.images && project.images.length > 0 && (
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={getImageUrl(project.images[0].image as Media) as string}
                  alt={project.images[0].altText || project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              {project.location && (
                <p className="text-sm text-muted-foreground">{project.location}</p>
              )}
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-gray-700">
                {project.description}
              </p>
            </CardContent>
            <CardFooter>
              <button 
                onClick={() => openProject(project)}
                className="text-primary font-medium flex items-center relative hover:underline"
              >
                Preberi več
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>

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
              {selectedProject.images && selectedProject.images.length > 0 && (
                <div className="relative w-full h-full max-h-[60vh] md:max-h-full">
                  <Image
                    src={typeof selectedProject.images[selectedImageIndex].image === 'object' 
                      ? getImageUrl(selectedProject.images[selectedImageIndex].image as Media) || '/placeholder-image.jpg'
                      : '/placeholder-image.jpg'}
                    alt={selectedProject.images[selectedImageIndex].altText || selectedProject.title}
                    fill
                    className="object-contain"
                  />
                  
                  {/* Navigation arrows */}
                  {selectedProject.images.length > 1 && (
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
                  {selectedProject.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-black bg-white/80 px-4 py-2 rounded-full shadow-md">
                      {selectedImageIndex + 1} / {selectedProject.images.length}
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
                <p>{selectedProject.description}</p>
              </div>
              
              {/* Thumbnail navigation for gallery */}
              {selectedProject.images && selectedProject.images.length > 1 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Galerija:</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selectedProject.images.map((img, index) => (
                      <div
                        key={index}
                        className={`relative h-16 cursor-pointer border-2 ${
                          index === selectedImageIndex ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Image
                          src={typeof img.image === 'object' 
                            ? getImageUrl(img.image as Media) || '/placeholder-image.jpg'
                            : '/placeholder-image.jpg'}
                          alt={img.altText || `Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ContainedSection>
  );
};

export default ProjectsSection;
