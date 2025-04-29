import AboutMeSection from "@/components/sections/home/about-me-section";
import ContactSection from "@/components/sections/home/contact-section";
import HeroSection from "@/components/sections/home/hero-section";
import ServiceAreaSection from "@/components/sections/home/service-area-section";
import TestimonialsSection from "@/components/sections/home/testimonials-section";

import { getHomePage} from "@/lib/payload";
import { Cta, Media, Project, Service, Machinery, Testimonial } from "@payload-types";
import ServicesSectionV3 from "@/components/sections/home/services-section-v3";
import ProjectsSection from "@/components/sections/home/projects-section";
import MachinerySection from "@/components/sections/home/machinery-section";
import { getImageUrl } from "@/utils/getImageUrl";
import Footer from "@/components/layout/footer";

export default async function RenderPage({ tenantSlug, tenantDomain }: { tenantSlug?: string, tenantDomain?: string }) {
  const page = await getHomePage(tenantSlug)
  
  // Map selectedMachinery from page data if it exists
 
  // Map selectedTestimonials from page data to the structure expected by the component
  // const testimonialsData = (page.selectedTestimonials as Testimonial[] | undefined)?.map(testimonial => ({
  //   id: String(testimonial.id),
  //   name: testimonial.name,
  //   rating: testimonial.rating,
  //   quote: testimonial.content, // Map content to quote
  //   timeAgo: testimonial.time || '' // Map time to timeAgo, provide fallback
  // })) || [];
  console.log(page);
  return (
    <div className="relative">

      asdas
      {/* <HeroSection  ctas={page?.heroCtas as Cta[]} imageUrl={getImageUrl(page.heroImage as Media)} title={page?.heroTitle} subtitle={page?.heroSubtitle as string} />
      <ServicesSectionV3 services={page.selectedServices as Service[]} title={page.servicesTitle} description={page.servicesDescription as string} />
      <TestimonialsSection 
        title={page.testimonialsTitle ?? undefined} 
        testimonials={page.selectedTestimonials as Testimonial[] || []} // Pass directly
        cta={page.testimonialsCta as Cta | undefined} // Pass the optional CTA
      />
      <MachinerySection 
        title={page.machineryTitle}
        description={page.machineryDescription ?? undefined}
        machinery={machineryData}
      />
      <ServiceAreaSection 
        title={page.serviceAreaTitle}
        description={page.serviceAreaDescription || undefined}
        mapImage={page.serviceAreaMapImage as Media}
        locations={page.serviceAreaLocations || undefined}
        additionalInfo={page.serviceAreaAdditionalInfo || undefined}
      />
      <AboutMeSection  imageUrl={getImageUrl(page.aboutImage as Media)} title={page.aboutTitle} content={page.aboutDescription} cta={page.aboutCta as Cta} />
      <div className="relative z-50">
      <ProjectsSection projects={page.highlightedProjects as Project[]} />

      </div>
      <ContactSection /> */}
      {/* <FaqSection faqData={faqData} /> */}
      <Footer />
    </div>
  );
}