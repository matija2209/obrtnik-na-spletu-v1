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
      depth: 1, // Populate relationships like tenants
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

    // --- Seed Opening Hours Schedule ---
    payload.logger.info('Attempting to seed Opening Hours...');
    let regularHours;
    try {
      payload.logger.info(`Seeding OpeningHours for tenant ${tenantA1.id}...`);
      regularHours = await payload.create({
        collection: 'opening-hours',
        data: {
          tenant: tenantA1.id,
          name: 'Regular Business Hours',
          dailyHours: [
            {
              days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
              timeSlots: [
                { startTime: '1970-01-01T08:00:00.000Z', endTime: '1970-01-01T16:00:00.000Z' } // Use ISO format
              ]
            },
            // Removed Saturday/Sunday entry as timeSlots requires minRows: 1
            // {
            //   days: ['saturday', 'sunday'],
            //   timeSlots: [] // Invalid: minRows is 1
            // }
          ],
          // Removed comment: This collection IS tenant-specific
        },
        // If OpeningHours is tenant-specific, access control/hooks MIGHT need req, but let's try without first.
        // req: simulatedReq, 
        // depth: 0, // Usually sufficient for create
      });
      payload.logger.info(`OpeningHours "Regular Business Hours" seeded with ID: ${regularHours.id}`);
    } catch (err) {
      payload.logger.error('Error seeding Opening Hours:', err);
      console.error('Detailed error seeding Opening Hours:', err); // Add console.error for more detail
    }

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
      req: simulatedReq, // Re-added simulated req for tenant context
    });
    payload.logger.info(`BusinessInfo seeded for tenant ${tenantId}.`);

    // --- Seed CTAs ---
    payload.logger.info(`Seeding CTAs for tenant ${tenantId}...`);
    let ctaKontakt, ctaVseStoritve;
    try {
      payload.logger.info('Attempting to create CTA: Kontaktirajte nas');
      ctaKontakt = await payload.create({
        collection: 'ctas',
        data: {
          tenant: tenantA1.id,
          ctaText: 'Kontaktirajte nas',
          ctaHref: '#kontakt',
          ctaType: 'primary',
        },
      });
      payload.logger.info(`Created CTA: ${ctaKontakt.id}`);
    } catch (err) {
      payload.logger.error('Error creating CTA (Kontaktirajte nas):', err);
    }
    try {
      payload.logger.info('Attempting to create CTA: Vse Storitve');
      ctaVseStoritve = await payload.create({
        collection: 'ctas',
        data: {
          tenant: tenantA1.id,
          ctaText: 'Vse Storitve',
          ctaHref: '/storitve',
          ctaType: 'secondary',
        },
      });
      payload.logger.info(`Created CTA: ${ctaVseStoritve.id}`);
    } catch (err) {
      payload.logger.error('Error creating CTA (Vse Storitve):', err);
    }
    if (ctaKontakt && ctaVseStoritve) {
      payload.logger.info(`CTAs seeded: ${ctaKontakt.id}, ${ctaVseStoritve.id}`);
    } else {
      payload.logger.warn('One or more CTAs failed to seed.');
    }

    // --- Seed Navbar ---
    payload.logger.info(`Seeding Navbar for tenant ${tenantId}...`);
    try {
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
                // Add more service links if needed
              ],
            },
            { title: 'Projekti', hasChildren: false, href: '/projekti' },
            { title: 'O nas', hasChildren: false, href: '/o-nas' },
            { title: 'Kontakt', hasChildren: false, href: '#kontakt' }, // Link to contact section
          ],
          // Only add CTA if it was successfully created
          ...(ctaKontakt ? { mainCta: ctaKontakt.id } : {}),
        },
        req: simulatedReq, // Re-added simulated req
      });
      payload.logger.info(`Navbar seeded for tenant ${tenantId}.`);
    } catch (err) {
      payload.logger.error('Error seeding Navbar:', err);
    }

    // --- Seed Services ---
    payload.logger.info('Attempting to seed Services...');
    payload.logger.info(`Seeding Services for tenant ${tenantId}...`);
    let serviceVodoinstalacije, serviceMontaza;
    try {
      payload.logger.info('Attempting to create Service: Vodoinštalacije');
      serviceVodoinstalacije = await payload.create({
        collection: 'services',
        data: {
          tenant: tenantA1.id,
          title: 'Vodoinštalacije',
          description: 'Nudimo celovite rešitve za vodovodne inštalacije, od načrtovanja do izvedbe in vzdrževanja.',
          features: [{ featureText: 'Novogradnje' }, { featureText: 'Adaptacije' }, { featureText: 'Popravila' }],
          link: '/storitve/vodoinstalacije',
          images: [], // Changed from image: mediaDocId to images: []
        },
      });
      payload.logger.info(`Created Service: ${serviceVodoinstalacije.id}`);
    } catch (err) {
      payload.logger.error('Error creating Service (Vodoinštalacije):', err);
    }
    try {
      payload.logger.info('Attempting to create Service: Montaža sanitarne opreme');
      serviceMontaza = await payload.create({
        collection: 'services',
        data: {
          tenant: tenantA1.id,
          title: 'Montaža sanitarne opreme',
          description: 'Strokovna montaža tuš kabin, kadi, WC školjk, umivalnikov in ostale sanitarne opreme.',
          features: [{ featureText: 'Montaža' }, { featureText: 'Priklop' }, { featureText: 'Svetovanje' }],
          link: '/storitve/montaza-sanitarne-opreme',
          images: [], // Added images: [] for consistency
        },
      });
      payload.logger.info(`Created Service: ${serviceMontaza.id}`);
    } catch (err) {
      payload.logger.error('Error creating Service (Montaža sanitarne opreme):', err);
    }
    if (serviceVodoinstalacije && serviceMontaza) {
      payload.logger.info(`Services seeded: ${serviceVodoinstalacije.id}, ${serviceMontaza.id}`);
    } else {
      payload.logger.warn('One or more Services failed to seed.');
    }

    // --- Seed Projects ---
    payload.logger.info('Attempting to seed Projects...');
    payload.logger.info(`Seeding Projects for tenant ${tenantId}...`);
    let projectAdaptacija, projectNovogradnja;
    try {
      payload.logger.info('Attempting to create Project: Adaptacija kopalnice Novak');
      projectAdaptacija = await payload.create({
        collection: 'projects',
        data: {
          tenant: tenantA1.id,
          title: 'Adaptacija kopalnice Novak',
          description: { // Use Slate JSON structure
            root: {
              type: 'root',
              children: [{
                type: 'paragraph',
                children: [{ text: 'Celovita prenova kopalnice v stanovanju družine Novak.', version: 1 }],
                version: 1
              }],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            },
          },
          projectStatus: 'completed',
          location: 'Ljubljana',
          metadata: {
            startDate: new Date('2023-09-01').toISOString(),
            completionDate: new Date('2023-10-15').toISOString(),
            client: 'Družina Novak',
            budget: '10000 EUR',
          },
          // projectImages: [], // Add image data if seeding media
          tags: [{ tag: 'Adaptacija' }, { tag: 'Kopalnica' }],
        },
      });
      payload.logger.info(`Created Project: ${projectAdaptacija.id}`);
    } catch (err) {
      payload.logger.error('Error creating Project (Adaptacija kopalnice Novak):', err);
    }
    try {
      payload.logger.info('Attempting to create Project: Novogradnja hiše Podlipnik');
      projectNovogradnja = await payload.create({
        collection: 'projects',
        data: {
          tenant: tenantA1.id,
          title: 'Novogradnja hiše Podlipnik',
          description: { // Use Slate JSON structure
            root: {
              type: 'root',
              children: [{
                type: 'paragraph',
                children: [{ text: 'Izvedba vseh vodovodnih inštalacij v novozgrajeni enodružinski hiši.', version: 1 }],
                version: 1
              }],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            },
          },
          projectStatus: 'completed',
          location: 'Domžale',
          metadata: {
            completionDate: new Date('2024-01-20').toISOString(),
            client: 'Gospod Podlipnik',
          },
          tags: [{ tag: 'Novogradnja' }, { tag: 'Hiša' }],
        },
      });
      payload.logger.info(`Created Project: ${projectNovogradnja.id}`);
    } catch (err) {
      payload.logger.error('Error creating Project (Novogradnja hiše Podlipnik):', err);
    }
    if (projectAdaptacija && projectNovogradnja) {
      payload.logger.info(`Projects seeded: ${projectAdaptacija.id}, ${projectNovogradnja.id}`);
    } else {
      payload.logger.warn('One or more Projects failed to seed.');
    }

    // --- Seed Testimonials ---
    payload.logger.info('Attempting to seed Testimonials...');
    payload.logger.info(`Seeding Testimonials for tenant ${tenantId}...`);
    let testimonial1, testimonial2;
    try {
      payload.logger.info('Attempting to create Testimonial: Ana K.');
      testimonial1 = await payload.create({
        collection: 'testimonials',
        data: {
          tenant: tenantA1.id,
          name: 'Ana K.',
          time: 'pred 1 mesecem',
          location: 'Ljubljana',
          service: 'Adaptacija kopalnice',
          content: 'Zelo zadovoljni s hitrostjo in kvaliteto izvedbe prenove kopalnice. Priporočam!',
          rating: 5,
        },
      });
      payload.logger.info(`Created Testimonial: ${testimonial1.id}`);
    } catch (err) {
      payload.logger.error('Error creating Testimonial (Ana K.):', err);
    }
    try {
      payload.logger.info('Attempting to create Testimonial: Marko P.');
      testimonial2 = await payload.create({
        collection: 'testimonials',
        data: {
          tenant: tenantA1.id,
          name: 'Marko P.',
          time: 'pred 3 tedni',
          location: 'Domžale',
          service: 'Menjava vodovodnih cevi',
          content: 'Profesionalen odnos in odlično opravljeno delo. Držali so se dogovorjenih rokov.',
          rating: 5,
        },
      });
      payload.logger.info(`Created Testimonial: ${testimonial2.id}`);
    } catch (err) {
      payload.logger.error('Error creating Testimonial (Marko P.):', err);
    }
    if (testimonial1 && testimonial2) {
      payload.logger.info(`Testimonials seeded: ${testimonial1.id}, ${testimonial2.id}`);
    } else {
      payload.logger.warn('One or more Testimonials failed to seed.');
    }

    // --- Seed FAQ Items ---
    payload.logger.info('Attempting to seed FAQ Items...');
    payload.logger.info(`Seeding FAQ Items for tenant ${tenantId}...`);
    let faq1, faq2, faq3;
    try {
      payload.logger.info('Attempting to create FAQ Item 1');
      faq1 = await payload.create({
        collection: 'faq-items',
        data: {
          tenant: tenantA1.id,
          question: 'Kakšen je vaš delovni čas?',
          answer: 'Naš redni delovni čas je od ponedeljka do petka, od 8:00 do 16:00. Za nujne intervencije smo dosegljivi tudi izven delovnega časa.',
        },
      });
      payload.logger.info(`Created FAQ Item: ${faq1.id}`);
    } catch (err) {
      payload.logger.error('Error creating FAQ Item 1:', err);
    }
    try {
      payload.logger.info('Attempting to create FAQ Item 2');
      faq2 = await payload.create({
        collection: 'faq-items',
        data: {
          tenant: tenantA1.id,
          question: 'Na katerem območju opravljate storitve?',
          answer: 'Storitve opravljamo predvsem na območju osrednje Slovenije, vključno z Ljubljano z okolico, Domžalami, Kamnikom in Kranjem. Za večje projekte se lahko dogovorimo tudi za delo izven tega območja.',
        },
      });
      payload.logger.info(`Created FAQ Item: ${faq2.id}`);
    } catch (err) {
      payload.logger.error('Error creating FAQ Item 2:', err);
    }
    try {
      payload.logger.info('Attempting to create FAQ Item 3');
      faq3 = await payload.create({
        collection: 'faq-items',
        data: {
          tenant: tenantA1.id,
          question: 'Ali nudite garancijo na opravljeno delo?',
          answer: 'Da, na vse naše storitve in vgrajeni material nudimo ustrezno garancijo.',
        },
      });
      payload.logger.info(`Created FAQ Item: ${faq3.id}`);
    } catch (err) {
      payload.logger.error('Error creating FAQ Item 3:', err);
    }
    if (faq1 && faq2 && faq3) {
      payload.logger.info(`FAQ Items seeded: ${faq1.id}, ${faq2.id}, ${faq3.id}`);
    } else {
      payload.logger.warn('One or more FAQ Items failed to seed.');
    }

    // --- Seed Home Page ---
    payload.logger.info('Attempting to seed Home Page...');
    payload.logger.info(`Seeding 'home' page for tenant ${tenantId}...`);
    try {
      payload.logger.info('Attempting to create Page: home');
      await payload.create({
        collection: 'pages',
        data: {
          tenant: tenantA1.id, // Explicitly set the tenant ID
          title: 'Domov',
          slug: 'home',
          layout: [
            // Hero Block
            {
              blockType: 'hero', // Matches the slug defined in src/blocks/Hero/index.ts
              template: 'default',
              title: 'Vaš Zanesljiv Partner za Vodoinštalacije', // Previously heroTitle
              subtitle: 'A1 INŠTALACIJE d.o.o. - Kakovost in zanesljivost na prvem mestu.', // Previously heroSubtitle
              features: [ // Previously heroFeatures
                { iconText: '10+', text: 'Let izkušenj' },
                { iconText: '✓', text: 'Certificirani mojstri' },
                { iconText: '✓', text: 'Garancija na delo' },
              ],
              // Assuming Hero block might have CTAs
              // ctas: [ctaKontakt.id, ctaVseStoritve.id], // Link seeded CTAs
            },
            // Services Block
            {
              blockType: 'services', // Matches the slug defined in src/blocks/Services/index.ts
              template: 'default',
              title: 'Naše Storitve', // Previously servicesTitle
              description: 'Nudimo širok spekter vodoinštalaterskih storitev.', // Previously servicesDescription
              selectedServices: [serviceVodoinstalacije, serviceMontaza]
                .filter((item): item is NonNullable<typeof item> => Boolean(item)) // Filter out null/undefined and assert type
                .map((s) => s.id), // Get IDs
              // Maybe add a CTA here too if the block supports it
              // cta: ctaVseStoritve.id,
            },
            // Project Highlights Block
            {
              blockType: 'projectHighlights', // Or your chosen slug
              template: 'default',
              title: 'Naši Projekti', // Previously projectHighlightsTitle
              description: 'Oglejte si nekaj naših uspešno zaključenih projektov.', // Previously projectHighlightsDescription
              buttonText: 'Vsi Projekti', // Previously projectHighlightsButtonText - consider using a CTA relationship instead
              buttonHref: '/projekti', // Previously projectHighlightsButtonHref
              highlightedProjects: [projectAdaptacija, projectNovogradnja]
                .filter((item): item is NonNullable<typeof item> => Boolean(item))
                .map((p) => p.id),
            },
            // About Block
            {
              blockType: 'about', // Or your chosen slug
              template: 'default',
              title: 'Spoznajte nas', // Previously aboutTitle
              description: 'Smo ekipa izkušenih vodoinštalaterjev, predanih kakovosti in zadovoljstvu strank. Z več kot 10 leti izkušenj zagotavljamo zanesljive in trajne rešitve.', // Previously aboutDescription
              // aboutBenefits: [], // Add benefits if defined in block config
              // cta: ctaKontakt.id // Optional CTA
            },
             // Testimonials Block
            {
              blockType: 'testimonials',
              template: 'default',
              title: 'Mnenja naših strank',
              selectedTestimonials: [testimonial1, testimonial2]
                .filter((item): item is NonNullable<typeof item> => Boolean(item))
                .map((t) => t.id),
              // limit: 2, // Optional limit
            },
            // Service Area Block
            {
              blockType: 'serviceArea', // Or your chosen slug
              template: 'default',
              title: 'Kje delujemo?', // Previously serviceAreaTitle
              showMap: true, // Previously showMap
              locations: [ { name: 'Ljubljana' }, { name: 'Domžale' }, { name: 'Kamnik' }, { name: 'Kranj'} ], // Previously serviceAreaLocations
              // cta: ctaKontakt.id // Optional CTA
            },
             // FAQ Block
            {
              blockType: 'faq',
              template: 'default',
              title: 'Pogosta Vprašanja',
              selectedFaqs: [faq1, faq2, faq3]
                .filter((item): item is NonNullable<typeof item> => Boolean(item))
                .map((f) => f.id),
            },
            // Contact Block
            {
              blockType: 'contact',
              title: 'Stopite v stik',
              description: 'Za vsa vprašanja, povpraševanja ali nujne intervencije smo vam na voljo.',
              // Only add opening hours if successfully seeded
              ...(regularHours ? { openingHoursSchedules: [regularHours.id] } : {}),
              phoneNumber: '069 653335',
              address: 'Stegne 35, 1000 Ljubljana',
              template: 'default', // Ensure template is set if required
            },
            // Machinery block - can remain hidden or you can add content
            // {
            //   blockType: 'machinery',
            //   template: 'default',
            //   title: 'Naša oprema',
            //   // Add content if needed
            // },
            // Gallery block - can remain hidden or you can add content/links
            // {
            //   blockType: 'gallery',
            //   template: 'default',
            //   title: 'Galerija projektov',
            //   // Add images or link projects/media if needed
            // },

          ],
          meta: {
            title: 'A1 INŠTALACIJE d.o.o. | Vodoinštalacije Ljubljana',
            description: 'Profesionalne vodoinštalaterske storitve in montaža sanitarne opreme v Ljubljani in okolici. A1 INŠTALACIJE d.o.o.',
          }
        },
      });
      payload.logger.info('Successfully created Page: home');
      payload.logger.info(`'home' page seeded for tenant ${tenantId}.`);
    } catch (err) {
      payload.logger.error('Error seeding \'home\' page:');
      payload.logger.error(err); // Log the full error object
      throw err; // Re-throw the error to stop the seed process if needed
    }

    // --- Seed Footer ---
    payload.logger.info(`Seeding Footer for tenant ${tenantId}...`);
    payload.logger.info('Attempting to update Footer global...');
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        socialLinks: [
          {
            platform: 'facebook',
            url: 'https://facebook.com/a1instalacije', // From BusinessInfo
          },
          {
            platform: 'google',
            url: 'https://google.com/maps/place/a1instalacije', // Placeholder, replace with actual Google review/maps link
          },
          // Add other relevant social links if needed
        ],
        copyrightText: '© {{year}} A1 INŠTALACIJE d.o.o. Vse pravice pridržane.',
        quickLinks: [
          { label: 'Domov', url: '/' },
          { label: 'Storitve', url: '/storitve' },
          { label: 'Projekti', url: '/projekti' },
          { label: 'O nas', url: '/o-nas' },
          { label: 'Kontakt', url: '#kontakt' },
        ],
        showContactInFooter: true,
        showPrivacyLinks: true,
        // logo: logoDocId, // Add logo ID if you seed media and want it in the footer
      },
      req: simulatedReq, // Re-added simulated req for tenant context
    });
    payload.logger.info(`Footer seeded for tenant ${tenantId}.`);

  } catch (error) {
    payload.logger.error('Caught error during seeding process:');
    payload.logger.error('Error seeding database:', error);
  }
};