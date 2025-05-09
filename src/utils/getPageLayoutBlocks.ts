import { Block } from 'payload'; // Or 'payload/types' depending on your setup

// Import all your block configurations
// Adjust paths if these blocks are located differently relative to src/utils/
import Hero from '../blocks/general/Hero/config';
import Services from '../blocks/general/Services/config';
import ProjectHighlights from '../blocks/general/ProjectHighlights/config';
import About from '../blocks/general/About/config';
import Testimonials from '../blocks/general/Testimonials/config';
import Gallery from '../blocks/general/Gallery/config';
import ServiceArea from '../blocks/general/ServiceArea/config';
import Contact from '../blocks/general/Contact/config';
import FAQ from '../blocks/general/FAQ/config';
import Machinery from '../blocks/general/Machinery/config';
import ServicesHero from '../blocks/services/Hero/config';
import ServicesFaq from '../blocks/services/Faq/config';
import ServicesPresentation from '../blocks/services/Presentation/config';
import ServicesCta from '../blocks/services/Cta/config';

export const getPageLayoutBlocks = (pageType?: string): Block[] => {
  switch (pageType) {
    case 'contact':
      return [Contact, FAQ];
    case 'about':
      return [About, Testimonials];
    case 'privacyPolicy':
      return []; // No blocks for privacy policy
    case 'services':
      return [
        ServicesHero,
        Services, // Assuming general 'Services' block is also used here
        ServicesPresentation,
        Testimonials, // General Testimonials
        Gallery,    // General Gallery
        Contact,    // General Contact
        FAQ,        // General FAQ - or perhaps ServicesFaq if it's meant to replace
        ServicesFaq, // Service-specific FAQ
        ServicesCta,
      ];
    case 'landing':
    default:
      return [
        Hero,
        Services,
        ProjectHighlights,
        About,
        Testimonials,
        Gallery,
        ServiceArea,
        Contact,
        FAQ,
        Machinery,
      ];
  }
}; 