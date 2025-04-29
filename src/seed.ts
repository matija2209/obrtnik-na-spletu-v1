import type { Payload, PayloadRequest } from 'payload';
import type { Config, Tenant, User } from '../payload-types'; // Add User type

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Seeding database...');

  try {
    // --- Create Super Admin ---
    payload.logger.info('Creating super admin...');
    await payload.create({
      collection: 'users',
      data: {
        email: 'matija@obrtniknaspletu.si',
        password: 'Matija113', // Use a secure default password
        firstName: 'Matija',
        lastName: 'Admin',
        roles: ['super-admin'],
        // No tenants array needed for super admin if userHasAccessToAllTenants is true
      },
    });
    payload.logger.info('Super admin created.');

    // --- Create Tenant ---
    payload.logger.info('Creating tenant "a1-instalacije"...');
    const tenantA1 = await payload.create({
      collection: 'tenants',
      data: {
        name: 'A1 INŠTALACIJE d.o.o.',
        slug: 'a1-instalacije',
        domain:"a1-instalacije.si"
        // domain: 'a1.localhost', // Optional: Add domain if needed
      },
    });
    payload.logger.info(`Tenant "a1-instalacije" created with ID: ${tenantA1.id}`);

    // --- Create Tenant User ---
    payload.logger.info('Creating tenant user "miralem"...');
    await payload.create({
      collection: 'users',
      data: {
        email: 'info.a1instalacije@gmail.com',
        password: 'gmb-2025', // Use a secure default password
        firstName: 'Miralem',
        lastName: 'Mehanović',
        roles: ['user'], // Changed from 'tenant-admin' to 'user' based on likely type defs
        tenants: [{ tenant: tenantA1.id, roles: ['tenant-admin'] }], // Correct structure for multi-tenant plugin
      },
    });
    payload.logger.info('Tenant user "miralem" created.');

    // Fetch the tenant user to use for global updates
    const tenantUser = await payload.find({
      collection: 'users',
      where: { email: { equals: 'info.a1instalacije@gmail.com' } },
      limit: 1,
      depth: 0, // No need to populate relationships
    });

    if (!tenantUser.docs[0]) {
      payload.logger.error('Could not find tenant user to perform global updates.');
      throw new Error('Tenant user not found for seeding globals.');
    }
    const userForGlobalUpdates = tenantUser.docs[0] as User; // Cast to User type

    // Simulate a more complete req object for global updates
    const simulatedReq: PayloadRequest = {
      payload,
      user: userForGlobalUpdates,
      payloadAPI: 'local',
      transactionID: undefined,
      locale: 'sl', // From your config
      fallbackLocale: 'sl', // From your config
      context: {}, // Minimal context
      // Mock minimal i18n object
      i18n: {
        t: (key: string) => key, // Simple pass-through translation
        locale: 'sl',
        fallbackLocale: 'sl',
        locales: ['sl', 'en'], // Match your payload.config.ts
        defaultLocale: 'sl',
        // Add other i18n methods/properties if required by hooks/access control
      } as any, // Cast to any to simplify mocking
      payloadDataLoader: undefined,
      query: {}, // Empty query object
      t: (key: string) => key, // Minimal translation function placeholder
    } as any as PayloadRequest;

    // --- Seed Globals for Tenant ---
    const tenantId = tenantA1.id; // Keep tenantId for logging if needed

    // --- Seed BusinessInfo ---
    payload.logger.info(`Seeding BusinessInfo for tenant ${tenantId}...`);
    await payload.updateGlobal({
      slug: 'business-info',
      data: {
        companyName: 'A1 INŠTALACIJE d.o.o.',
        companyAbout: 'Smo strokovnjaki za vodoinštalacije in montažo sanitarne opreme. Nudimo kakovostne storitve z dolgoletnimi izkušnjami.',
        vatId: 'SI35905875',
        businessId: '12345678', // Replace with actual if available, otherwise use placeholder
        registryDate: new Date().toISOString(), // Use current date as placeholder
        location: 'Stegne 35, 1000 Ljubljana',
        phoneNumber: '069 653335',
        email: 'info.a1instalacije@gmail.com',
        facebookUrl: 'https://facebook.com/a1instalacije', // Placeholder
        googleReviewUrl: 'https://google.com/maps/place/a1instalacije', // Placeholder
        // logo and logoLight would need media uploads, skipping for basic seed
        leadGenPlatformUrls: [
          { platformName: 'Primerjam.si', url: 'https://primerjam.si/a1instalacije' }, // Placeholder URL
          { platformName: 'MojMojster.net', url: 'https://mojmojster.net/a1instalacije' }, // Placeholder URL
        ],
        coordinates: {
          latitude: 46.0784, // Approximate latitude for Stegne, Ljubljana
          longitude: 14.4616, // Approximate longitude for Stegne, Ljubljana
        },
        serviceRadius: 50000, // Example: 50km radius in meters
        metaTitle: 'A1 INŠTALACIJE d.o.o. | Vodoinštalacije Ljubljana',
        metaDescription: 'Profesionalne vodoinštalaterske storitve in montaža sanitarne opreme v Ljubljani in okolici. A1 INŠTALACIJE d.o.o.',
      },
      req: simulatedReq, // Pass simulated req instead of user
    });
    payload.logger.info(`BusinessInfo seeded for tenant ${tenantId}.`);

    // --- Seed Navbar ---
    payload.logger.info(`Seeding Navbar for tenant ${tenantId}...`);
    await payload.updateGlobal({
      slug: 'navbar',
      data: {
        title: 'A1 Navigacija',
        navItems: [
          { title: 'Domov', hasChildren: false, href: '/' },
          {
            title: 'Storitve',
            hasChildren: true,
            children: [
              { title: 'Vodoinštalacije', href: '/storitve/vodoinstalacije', description: 'Celovite vodovodne inštalacije.', icon: 'Drop' },
              { title: 'Montaža sanitarne opreme', href: '/storitve/montaza-sanitarne-opreme', description: 'Strokovna montaža opreme.', icon: 'Hands' },
            ],
          },
          { title: 'Projekti', hasChildren: false, href: '/projekti' },
          { title: 'O nas', hasChildren: false, href: '/o-nas' },
          { title: 'Kontakt', hasChildren: false, href: '#kontakt' },
        ],
        // mainCta would require a CTA to be created first, skipping for basic seed
      },
      req: simulatedReq, // Pass simulated req
    });
    payload.logger.info(`Navbar seeded for tenant ${tenantId}.`);

    // --- Seed HomePage ---
    // This is a simplified version. You might want to add more details
    // or link relationships (like CTAs, Services, Projects) after creating those.
    payload.logger.info(`Seeding HomePage for tenant ${tenantId}...`);
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        // Hero Section (Example)
        heroHideSection: false,
        heroTitle: 'Vaš Zanesljiv Partner za Vodoinštalacije',
        heroSubtitle: 'A1 INŠTALACIJE d.o.o. - Kakovost in zanesljivost na prvem mestu.',
        heroFeatures: [
          { iconText: '10+', text: 'Let izkušenj' },
          { iconText: '✓', text: 'Certificirani mojstri' },
          { iconText: '✓', text: 'Garancija na delo' },
        ],
        // Other sections default to hidden or need more data/relationships
        servicesHideSection: false,
        servicesTitle: 'Naše Storitve',
        servicesDescription: 'Nudimo širok spekter vodoinštalaterskih storitev.',
        // selectedServices: [], // Link actual services after creating them

        machineryHideSection: true, // Default hidden
        projectsHideSection: false,
        projectHighlightsTitle: 'Naši Projekti',
        projectHighlightsDescription: 'Oglejte si nekaj naših uspešno zaključenih projektov.',
        projectHighlightsButtonText: 'Vsi Projekti',
        projectHighlightsButtonHref: '/projekti',
        // highlightedProjects: [], // Link actual projects after creating them

        aboutHideSection: false,
        aboutTitle: 'Spoznajte nas',
        aboutDescription: 'Smo ekipa izkušenih vodoinštalaterjev...',
        // aboutBenefits: [],

        testimonialsHideSection: true, // Default hidden
        galleryHideSection: true, // Default hidden
        serviceAreaHideSection: false,
        serviceAreaTitle: 'Kje delujemo?',
        serviceAreaDescription: 'Naše storitve nudimo v **Ljubljani** in širši okolici.',
        showMap: true,
        serviceAreaLocations: [ { name: 'Ljubljana' }, { name: 'Domžale' }, { name: 'Kamnik' } ],

        contactHideSection: false,
        contactTitle: 'Stopite v stik',
        contactDescription: 'Za vsa vprašanja smo vam na voljo.',
        contactWorkingHours: [
            { day: 'Ponedeljek - Petek', hours: '08:00 - 16:00' },
            { day: 'Sobota, Nedelja, Prazniki', hours: 'Zaprto' }
        ],
        contactPhoneNumber: '069 653335',
        contactAddress: 'Stegne 35, 1000 Ljubljana',

        faqHideSection: true, // Default hidden
      },
      req: simulatedReq, // Pass simulated req
    });
    payload.logger.info(`HomePage seeded for tenant ${tenantId}.`);


    payload.logger.info('Database seeding completed successfully.');

  } catch (error: unknown) {
    payload.logger.error('Error seeding database:');
    if (error instanceof Error) {
      payload.logger.error(error.message);
      if (error.stack) {
        payload.logger.error(error.stack);
      }
       // Log validation errors if available
      if ('data' in error && typeof error.data === 'object' && error.data !== null && 'errors' in error.data) {
        payload.logger.error('Validation Errors:');
        payload.logger.error(JSON.stringify((error.data as any).errors, null, 2));
      }
    } else {
      payload.logger.error(String(error));
    }
    process.exit(1); // Exit if seeding fails
  }
}; 