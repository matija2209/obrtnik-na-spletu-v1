import type { Payload, PayloadRequest } from 'payload';
import type { Tenant, User } from '../../payload-types';
import { createSimulatedRequest } from './utils';
import {
  seedTenants,
  seedUsers,
  // seedOpeningHours,
  seedCtas,
  seedMenus,
  // seedServices,
  // seedSubServices,
  // seedServicePages,
  // seedTestimonials,
  // seedProjects,
  // seedFaqItems,
  // seedForms,
  // seedMedia,
  // updateCollectionsWithMedia,
  seedPages,
} from './collections';
import {
  seedBusinessInfo,
  seedNavbar,
  seedFooter,
} from './globals';

// Assume payload.config is available and provides the generated config type
// You might need to pass the config explicitly if it's not globally available
// import { config as payloadConfig } from '../path/to/your/payload.config'; // Example import

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Starting database seed...');

  try {
    // No longer need to handle config here
    // const config = payload.config as Config;

    // --- Seed Tenants and Users (Prerequisites) ---
    const { tenantA1, tenantMoj } = await seedTenants({ payload });
    const { userForGlobalUpdates } = await seedUsers({ payload, tenantA1, tenantMoj });

    // --- Create Simulated Request (Needed for Tenant-Specific Operations) ---
    const simulatedReq = createSimulatedRequest(payload, userForGlobalUpdates);

    // --- Create Image Data (Needed before Media Seeding) ---
    // const { seededImageIds } = await seedMedia({ payload, tenantA1, simulatedReq });

    // --- Base arguments for seeding functions ---
    // Note: We don't include imageAltMap here as it's used internally by seedMedia
    const baseSeedArgs: {
      payload: Payload;
      tenantA1: Tenant;
      tenantMoj: Tenant;
      userForGlobalUpdates: User;
      simulatedReq: PayloadRequest;
      // seededImageIds: { [key: string]: number };
      // Optional properties are NOT defined here
    } = {
      payload,
      tenantA1,
      tenantMoj,
      userForGlobalUpdates,
      simulatedReq,
      // seededImageIds,
      // REMOVE the initialization of optional properties here
    };

    // --- Seed Collections (in logical order of dependency) ---
    // const { regularHours } = await seedOpeningHours(baseSeedArgs);
    const { ctaKontakt,ctaVseStoritve } = await seedCtas(baseSeedArgs);
    const { mainMenu, footerMenu, socialMenu } = await seedMenus(baseSeedArgs);
    // const { serviceVodoinstalacije, serviceMontaza } = await seedServices(baseSeedArgs);
    // const subServiceArgs = { ...baseSeedArgs, serviceVodoinstalacije, serviceMontaza };
    // const { subServiceOdtok, subServicePipe, subServiceWC, subServiceShower } = await seedSubServices(subServiceArgs);
    // const testimonialArgs = { ...baseSeedArgs };
    // const { testimonial1, testimonial2 } = await seedTestimonials(testimonialArgs);
    // const projectArgs = { ...baseSeedArgs, serviceVodoinstalacije, testimonial1 };
    // const { projectAdaptacija, projectNovogradnja } = await seedProjects(projectArgs);
    // const faqArgs = { ...baseSeedArgs };
    // const { faq1, faq2, faq3 } = await seedFaqItems(faqArgs);
    // const formArgs = { ...baseSeedArgs };
    // const { contactForm, defaultSiteContactForm } = await seedForms(formArgs);

    // --- Seed Globals (depend on some collections) ---
    const businessInfoArgs = { ...baseSeedArgs };
    await seedBusinessInfo(businessInfoArgs);
    const navbarArgs = { ...baseSeedArgs, mainMenu, ctaKontakt };
    await seedNavbar(navbarArgs);
    const footerArgs = { ...baseSeedArgs, footerMenu, socialMenu };
    await seedFooter(footerArgs);

    // --- Update Collections with Media (after media and collections are seeded) ---
    // const updateMediaArgs = { ...baseSeedArgs, serviceVodoinstalacije, serviceMontaza, projectAdaptacija, projectNovogradnja };
    // await updateCollectionsWithMedia(updateMediaArgs);

    // --- Seed Service Pages (depend on services/sub-services) ---
    const servicePageArgs = { ...baseSeedArgs}; // , serviceVodoinstalacije, subServiceOdtok, subServicePipe 
    // await seedServicePages(servicePageArgs);

    // --- Seed Main Pages (depend on most other collections/globals) ---
    const pageArgs = {
      ...baseSeedArgs,
      // serviceVodoinstalacije,
      // serviceMontaza,
      // projectAdaptacija,
      // projectNovogradnja,
      // testimonial1,
      // testimonial2,
      // faq1,
      // faq2,
      // faq3,
      // regularHours,
      // defaultSiteContactForm,
      ctaKontakt,
      // ctaVseStoritve,
      // mainMenu,
    };
    await seedPages(pageArgs);

    payload.logger.info('Database seed completed successfully.');

  } catch (error) {
    payload.logger.error('------------------------------------------------------');
    payload.logger.error('Error during database seeding process:');
    payload.logger.error(error);
    // Log detailed error object for better debugging in console
    console.error('------------------------------------------------------');
    console.error('Detailed error object from main catch block in seed.ts:');
    console.error(error);
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:');
      console.error(error.stack);
    }
    if (error && typeof error === 'object' && 'message' in error) {
        console.error('Error message property:', (error as Error).message);
    }
    console.error('------------------------------------------------------');
    // Optionally re-throw or exit process
    // process.exit(1);
  }
};
