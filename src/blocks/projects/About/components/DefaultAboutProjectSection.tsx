import * as React from "react";
import { AboutProjectBlock, Project } from '@payload-types';
import RichText from '@/components/payload/RichText';
import { ContainedSection } from '@/components/layout/container-section';
import { ColorScheme, getBackgroundClass, getColorClasses, type ColorClasses } from '@/utilities/getColorClasses';
import { formatDate } from '@/utilities/formatDate';
import { cn } from '@/lib/utils';
import { getProject } from '@/lib/payload';


interface ProjectInfoItemProps {
  label: string;
  value: string;
  
}

export const ProjectInfoItem: React.FC<ProjectInfoItemProps> = ({ label, value }) => {
  return (
    <article className="flex flex-col gap-3 items-start">
      <p className={cn("text-sm font-light leading-relaxed max-sm:text-xs text-primary")}>
        {label}
      </p>
      <p className={cn("text-lg  leading-relaxed max-sm:text-base text-dark/80")}>
        {value}
      </p>
    </article>
  );
};

interface ProjectDescriptionProps {
  title: string;
  description: any; // RichText content
  
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ title, description }) => {
  return (
    <article className="flex flex-col items-start w-full ">
      <h2 className="text-3xl font-bold text-left">
        O projektu
      </h2>
      <div className="mt-8 text-base opacity-90 text-dark/90 text-left">
        <RichText data={description} enableGutter={false} enableProse={false} />
      </div>
    </article>
  );
};

// Helper function to calculate project duration
const calculateProjectDuration = (startDate: string | null | undefined, completionDate: string | null | undefined): string => {
  if (!startDate || !completionDate) return 'N/A';
  
  const start = new Date(startDate);
  const end = new Date(completionDate);
  
  // Calculate difference in months
  const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  
  if (monthsDiff === 0) {
    return '1 mesec';
  } else if (monthsDiff === 1) {
    return '1 mesec';
  } else if (monthsDiff < 12) {
    return `${monthsDiff} mesecev`;
  } else {
    const years = Math.floor(monthsDiff / 12);
    const remainingMonths = monthsDiff % 12;
    if (remainingMonths === 0) {
      return years === 1 ? '1 leto' : `${years} let`;
    } else {
      return years === 1 ? `1 leto ${remainingMonths} mesecev` : `${years} let ${remainingMonths} mesecev`;
    }
  }
};

/**
 * Server component that fetches project based on ID if needed
 * and renders the about project section
 */
export default async function DefaultAboutProjectSection(props: AboutProjectBlock) {
  const {
    idHref,
    project,
    bgc: backgroundColor,
    isTransparent
  } = props;




  const {
    title,
    description,
    location,
    metadata,
    tags,
    servicesPerformed,
  } = project as Project;

  // Get color classes and background styling
  
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  // Calculate project duration
  const duration = calculateProjectDuration(metadata?.startDate, metadata?.completionDate);

  // Format services for display
  const servicesText = servicesPerformed && Array.isArray(servicesPerformed) && servicesPerformed.length > 0
    ? servicesPerformed
        .map(service => typeof service === 'object' ? service.title : service)
        .filter(Boolean)
        .join(', ')
    : 'N/A';

  // Format dates
  const dateRange = (() => {
    if (metadata?.startDate && metadata?.completionDate) {
      const startFormatted = formatDate(metadata.startDate);
      const endFormatted = formatDate(metadata.completionDate);
      return startFormatted === endFormatted ? startFormatted : `${startFormatted} - ${endFormatted}`;
    } else if (metadata?.startDate) {
      return formatDate(metadata.startDate);
    } else if (metadata?.completionDate) {
      return formatDate(metadata.completionDate);
    }
    return 'N/A';
  })();

  return (
    <ContainedSection
      id={idHref ?? "o-projektu"}
      overlayClassName={overlayClass}
      verticalPadding="xl"
      padding="lg"
      maxWidth="7xl"
    >
      <div className="flex flex-col gap-16 w-full max-md:gap-12 max-sm:gap-10">

          <div className="flex gap-16 items-start w-full max-md:gap-12 max-sm:flex-col max-sm:gap-8 max-sm:items-start">
            <ProjectInfoItem
              label="DATUM"
              value={dateRange}
              
            />
            <ProjectInfoItem
              label="LOKACIJA"
              value={location || 'N/A'}
              
            />
            <ProjectInfoItem
              label="STORITVE"
              value={servicesText}
              
            />
          </div>

        <ProjectDescription
          title={title || 'O projektu'}
          description={description}
          
        />
      </div>
    </ContainedSection>
  );
}