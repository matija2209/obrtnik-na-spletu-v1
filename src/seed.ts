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
        domain:"a1-instalacije.si",
        // Add theme fields with default values
        colors: {
          primary: 'oklch(0.82 0.1663 83.77)',
          primaryForeground: 'oklch(0.985 0 0)',
          secondary: 'oklch(0.32 0.1025 253.89)',
          secondaryForeground: 'oklch(0.98 0.005 0)',
          accent: 'oklch(0.77 0.1687 67.36)',
          accentForeground: 'oklch(0.205 0 0)',
          background: 'oklch(1 0 0)',
          foreground: 'oklch(0.145 0 0)',
        },
        typography: {
          displayFont: 'Inter, system-ui, sans-serif',
          bodyFont: 'Inter, system-ui, sans-serif',
          headingWeight: '700',
          bodyWeight: '400',
        },
        radius: '0.625rem',
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
          link: { // Correct link structure
            type: 'external', // Changed from internal based on '#kontakt'
            externalUrl: '#kontakt', // Use externalUrl for anchors or external links
            newTab: false,
          },
          // icon: 'Mail', // Optional: Lucide icon name
          // ctaClassname: 'custom-cta-class', // Optional: Custom CSS class
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
          link: { // Correct link structure
            type: 'external', // Assume external for now as /storitve page isn't seeded
            externalUrl: '/storitve', // Use externalUrl
            newTab: false,
          },
          // icon: 'ArrowRight', // Optional: Lucide icon name
          // ctaClassname: 'another-cta-class', // Optional: Custom CSS class
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

    // --- Create Main Menu --- (New Step)
    payload.logger.info(`Creating Main Menu for tenant ${tenantId}...`);
    let mainMenu;
    try {
      mainMenu = await payload.create({
        collection: 'menus',
        data: {
          tenant: tenantA1.id,
          title: 'Glavni Meni (A1)', // Admin title for the menu
          menuItems: [
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
        },
        req: simulatedReq, // For tenant context
      });
      payload.logger.info(`Main Menu created with ID: ${mainMenu.id}`);
    } catch (err) {
      payload.logger.error('Error creating Main Menu:', err);
    }

    // --- Seed Navbar --- (Update to use mainMenu relationship)
    payload.logger.info(`Seeding Navbar for tenant ${tenantId}...`);
    try {
      await payload.updateGlobal({
        slug: 'navbar',
        data: {
          title: 'A1 Navigacija',
          // REMOVED: navItems array
          // mainCta relationship might need checking if ctaKontakt is null
          ...(mainMenu ? { mainMenu: mainMenu.id } : {}), // Link the created menu
          ...(ctaKontakt ? { mainCta: ctaKontakt.id } : {}),
          // Add default values for new flags if needed, though globals usually fetch defaults
          showLogoImage: true,
          showLogoText: true,
          isTransparent: false,
          isFixed: true,
        },
        req: simulatedReq, // Re-added simulated req
      });
      payload.logger.info(`Navbar seeded for tenant ${tenantId}.`);
    } catch (err) {
      payload.logger.error('Error seeding Navbar:', err);
      throw err; // Re-throw the error to stop the seed process if needed
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
          images: [], // Changed from image: mediaDocId to images: []
          priceDisplay: 'Po dogovoru', // Added priceDisplay
          // relatedProjects: [], // Optional
          // relatedTestimonials: [], // Optional
          // dedicatedPage: null, // Optional
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
          images: [], // Added images: [] for consistency
          priceDisplay: 'Od €150 dalje', // Added priceDisplay
          // relatedProjects: [], // Optional
          // relatedTestimonials: [], // Optional
          // dedicatedPage: null, // Optional
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
          testimonialDate: new Date('2024-04-15').toISOString(),
          source: 'manual',
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
          testimonialDate: new Date('2024-05-01').toISOString(),
          source: 'google',
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
          tags: [{ tag: 'Adaptacija' }, { tag: 'Kopalnica' }],
          servicesPerformed: [serviceVodoinstalacije?.id].filter(Boolean) as number[], // Example link with type assertion
          relatedTestimonials: [testimonial1?.id].filter(Boolean) as number[], // Example link with type assertion
          // dedicatedPage: null // Optional: Link to a page ID
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
          servicesPerformed: [serviceVodoinstalacije?.id].filter(Boolean) as number[], // Example link with type assertion
          // relatedTestimonials: [], // Optional
          // dedicatedPage: null // Optional: Link to a page ID
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
          category: 'general',
          answer: {
            root: {
              type: 'root',
              children: [{
                type: 'paragraph',
                children: [{ text: 'Naš redni delovni čas je od ponedeljka do petka, od 8:00 do 16:00. Za nujne intervencije smo dosegljivi tudi izven delovnega časa.', version: 1 }],
                version: 1
              }],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            },
          },
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
          category: 'general',
          answer: {
            root: {
              type: 'root',
              children: [{
                type: 'paragraph',
                children: [{ text: 'Storitve opravljamo predvsem na območju osrednje Slovenije, vključno z Ljubljano z okolico, Domžalami, Kamnikom in Kranjem. Za večje projekte se lahko dogovorimo tudi za delo izven tega območja.', version: 1 }],
                version: 1
              }],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            },
          },
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
          category: 'general',
          answer: {
            root: {
              type: 'root',
              children: [{
                type: 'paragraph',
                children: [{ text: 'Da, na vse naše storitve in vgrajeni material nudimo ustrezno garancijo.', version: 1 }],
                version: 1
              }],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            },
          },
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

    // --- Seed Forms --- (Using formBuilderPlugin collection)
    payload.logger.info('Attempting to seed Forms (using formBuilderPlugin)...');
    payload.logger.info(`Seeding Forms for tenant ${tenantId}...`);
    let contactForm;
    try {
      payload.logger.info('Attempting to create Form: Kontaktni Obrazec');
      contactForm = await payload.create({
        collection: 'forms', // Use the slug from formBuilderPlugin
        data: {
          tenant: tenantA1.id,
          title: 'Stopite v stik', // Form title for admin/selection
          // submitButtonLabel: 'Pošlji sporočilo', // Default is 'Submit', customize if needed
          // confirmationType: 'message', // Default
          // confirmationMessage: [{ type: 'p', children: [{ text: 'Hvala za vaše sporočilo!' }] }], // Customize if needed
          // Add other form builder fields if needed (e.g., emailsToSendTo)
          fields: [
            {
              name: 'ime_priimek',
              label: 'Ime in Priimek',
              blockType: 'text', // Use blockType instead of type
              required: true,
              width: 100, // Example width
            },
            {
              name: 'email',
              label: 'Email Naslov',
              blockType: 'email', // Use blockType instead of type
              required: true,
              width: 100,
            },
            {
              name: 'telefon',
              label: 'Telefonska številka (Neobvezno)',
              blockType: 'text', // Use blockType instead of type
              required: false,
              width: 100,
            },
            {
              name: 'sporocilo',
              label: 'Vaše sporočilo',
              blockType: 'textarea', // Use blockType instead of type
              required: true,
              width: 100,
            },
            {
              name: 'strinjanje',
              label: 'Strinjam se s pogoji zasebnosti',
              blockType: 'checkbox', // Use blockType instead of type
              required: true,
              width: 100,
            },
          ],
          // Note: 'replyToEmail' and 'redirectUrl' are not standard top-level form builder fields.
          // Emails are configured within the 'emails' array field of the form builder collection.
          // Redirects are configured via 'confirmationType: redirect' and the 'redirect' field.
          // You might need to adjust where you store 'replyToEmail' or handle redirects differently.
        },
         req: simulatedReq, // Pass req for tenant context if needed
      });
      payload.logger.info(`Created Form: ${contactForm.id}`);
      payload.logger.info(`Forms seeded: ${contactForm.id}`);
    } catch (err) {
      payload.logger.error('Error creating Form (Kontaktni Obrazec):', err);
      payload.logger.warn('Form seeding failed.');
    }

    // --- Seed Media (Images) ---
    payload.logger.info('Attempting to seed Media (Images)...');
    payload.logger.info(`Seeding Media for tenant ${tenantId}...`);

    // Corrected metadata to only use filename and alt_text
    const imageMetadata = [
        {
            "filename": "nagrada-a1-instalacije-doo.jpg",
            "alt_text": "Lesena nagrada z napisom PRIMERJAM.si, IZBIRA STRANK 2022 in A1 INŠTALACIJE d.o.o. ter oceno 5.0 s petimi zvezdicami. Nagrada je postavljena na armaturni plošči avtomobila."
        },
        {
            "filename": "polaganje-keramike-laser-nivelir.jpg",
            "alt_text": "Polaganje keramičnih ploščic v prostoru s pomočjo laserskega nivelirja. Ploščice so položene in fiksirane s plastičnimi distančniki."
        },
        {
            "filename": "kopalnica-prenova-ploščice-okno.jpg",
            "alt_text": "Kopalnica v prenovi s svetlimi ploščicami in oknom. Na tleh je položen parket."
        },
        {
            "filename": "polaganje-keramike-kopalnica-prenova.jpg",
            "alt_text": "Fotografija prikazuje polaganje keramičnih ploščic v kopalnici med prenovo. Ploščice so svetle s pisanimi vzorci, modri distančniki pa zagotavljajo enakomerne fuge."
        },
        {
            "filename": "polaganje-keramike-v-kopalnici.jpg",
            "alt_text": "Fotografija prikazuje polaganje keramičnih ploščic v kopalnici. Vidni so tudi orodje in naprave za polaganje ploščic."
        },
        {
            "filename": "notranjost-sobe-s-pečjo-televizorjem.jpg",
            "alt_text": "Notranjost sobe prikazuje peč iz rdečih opek, televizor na steni in leseno oblogo na stropu. V ozadju je stena z vzorcem cvetja in vrata."
        },
        {
            "filename": "hiša-terasa-zunanje-ureditve.jpg",
            "alt_text": "Zunanja terasa hiše s tlakovci in leseno nadstrešnico. Na vrtu je vidna trava in cvetje."
        },
        {
            "filename": "talno-ogrevanje-sistem-namestitev.jpg",
            "alt_text": "Talno ogrevanje je nameščeno v sobi, s črnimi ploščicami in belimi cevmi. Sistem je pripravljen za pokrivanje s talno oblogo."
        },
        {
            "filename": "kopalnica-prenova-polaganje-ploščic.jpg",
            "alt_text": "Kopalnica v fazi prenove s sveže položenimi keramičnimi ploščicami na stenah in lesenimi talnimi oblogami. Vidni so tudi elementi za sanitarno opremo in okno."
        },
        {
            "filename": "soba-keramika-stena-elektrika.jpg",
            "alt_text": "Prazna soba s keramičnimi ploščicami na tleh in belimi stenami. Na steni je električna vtičnica."
        },
        {
            "filename": "hiša-terasa-dvorišče-zunanjost.jpg",
            "alt_text": "Zunanji pogled na hišo s tlakovano teraso in zelenico. Na terasi so vidni ostanki gradbenih del."
        },
        {
            "filename": "kopalnica-s-keramicnimi-ploscicami.jpg",
            "alt_text": "Kopalnica s keramičnimi ploščicami in lesenim podom. Viden je tudi okenski okvir in priključki za sanitarno opremo."
        },
        {
            "filename": "kopalnica-umivalnik-wc-pralni-stroj.jpg",
            "alt_text": "Notranjost kopalnice s sodobnim umivalnikom, straniščem, pralnim strojem Samsung in tuš kabino. Na pultu pralnega stroja je čistilo Tandil."
        },
        {
            "filename": "bathroom-tiles-plumbing-fixtures.jpg",
            "alt_text": "A newly tiled bathroom features neutral-toned wall and floor tiles, with plumbing fixtures visible on the wall. A white bucket sits on the floor."
        },
        {
            "filename": "gorenje-bojler-vodovodne-napeljave.jpg",
            "alt_text": "Bojler Gorenje je nameščen na steni s priključenimi vodovodnimi napeljavami. Na polici pod njim sta orodje in posoda."
        },
        {
            "filename": "talno-ogrevanje-modra-izolacija.jpg",
            "alt_text": "Talno ogrevanje je nameščeno na modri izolaciji. Bele cevi za talno ogrevanje so položene v vzorcu na modri izolaciji."
        },
        {
            "filename": "kopalnica-prha-črna-armatura.jpg",
            "alt_text": "Sodobna kopalnica s črno prho in armaturo. Prha ima steklena vrata s črnim okvirjem."
        },
        {
            "filename": "kopalnica-ploščice-stene-prenova.jpg",
            "alt_text": "Notranjost kopalnice s svetlimi keramičnimi ploščicami na stenah. Prikazuje del prenove kopalnice z nameščenimi ploščicami in pripravami za sanitarno opremo."
        },
        {
            "filename": "nova-lesen-tlakovanje-notranjost.jpg",
            "alt_text": "Nova lesena talna obloga v notranjosti z nedokončanimi stenami. Tlakovanje je svetlo rjave barve in ima videz lesa."
        },
        {
            "filename": "polaganje-keramike-renoviranje-kopalnice.jpg",
            "alt_text": "Fotografija prikazuje polaganje keramičnih ploščic v kopalnici med prenovo. Ploščice so pritrjene s križci za enakomerne fuge."
        },
        {
            "filename": "tiles-installation-bathroom-wall.jpg",
            "alt_text": "Stena polnjena s keramičnimi ploščicami z uporabo izravnalnega sistema. Vidni so tudi vodovodne cevi in škatla za vgradnjo."
        },
        {
            "filename": "polaganje-keramike-izravnalni-sistem.jpg",
            "alt_text": "Prikazano je polaganje keramičnih ploščic z uporabo izravnalnega sistema. Modri distančniki zagotavljajo enakomerne fuge med ploščicami."
        },
        {
            "filename": "vodovodne-instalacije-a1-mehanovic.jpg",
            "alt_text": "Oglas za vodovodne instalacije A1 instalacije d.o.o. z Miralemom Mehanovicem, ki ponuja storitve na področju vode, gretja, elektrike, keramike in adaptacije kopalnic."
        },
        {
            "filename": "soba-keramika-opeka-notranjost.jpg",
            "alt_text": "Soba s keramičnimi ploščicami na tleh in pečjo iz opeke v kotu. Na peči je steklenica čistila."
        },
        {
            "filename": "kuhinja-sodobna-notranjost-okno.jpg",
            "alt_text": "Sodobna kuhinja z oknom, ki gleda na balkon. Kuhinja ima črne elemente in leseno pult."
        },
        {
            "filename": "kopalnica-stenske-ploščice-vtičnica.jpg",
            "alt_text": "Stena v kopalnici je obložena s svetlimi keramičnimi ploščicami. Na steni je nameščena vtičnica in priključki za vodo."
        },
        {
            "filename": "kopalnica-prenova-ploščice-stran.jpg",
            "alt_text": "Kopalnica v prenovi s sveže položenimi belimi ploščicami in modrimi distančniki. V ozadju je stranišče in modra stena."
        },
        {
            "filename": "notranjost-sobe-s-pečjo.jpg",
            "alt_text": "Notranjost sobe s keramičnimi tlemi, pečjo iz opečneatih ploščic in lesenimi vrati. Stena je okrašena z zelenim vzorcem."
        },
        {
            "filename": "bathroom-toilet-water-heater.jpg",
            "alt_text": "A bathroom features a wall-mounted toilet, a white water heater, and beige tile walls. A small shelf is built into the wall above the toilet."
        },
        {
            "filename": "soba-s-plo-icami-okno.jpg",
            "alt_text": "Prazen prostor s ploščicami in oknom, ki gleda na zunanjo teraso. Ploščice so svetlo sive barve in so položene v vzorcu opeke."
        },
        {
            "filename": "talno-ogrevanje-razdelilnik-cevi.jpg",
            "alt_text": "Slika prikazuje razdelilnik talnega ogrevanja s priključenimi belimi cevmi, nameščenimi na modri izolaciji. Na tleh so tudi orodja za montažo."
        },
        {
            "filename": "kuhinja-sodobna-črna-bela.jpg",
            "alt_text": "Sodobna kuhinja z belimi zgornjimi omaricami in črnimi spodnjimi omaricami ter lesenim pultom. V ospredju je lesena talna obloga."
        },
        {
            "filename": "nedokončana-kopalnica-prenova-notranjost.jpg",
            "alt_text": "Nedokončana kopalnica s keramičnimi ploščicami in lesenimi tlemi. Vidi se odprtina za vrata in napeljave na steni."
        },
        {
            "filename": "vtičnice-stenske-pipe-kopalnica.jpg",
            "alt_text": "Dve vtičnici na steni v kopalnici, pod njima pa so nameščene stenske pipe. Stena je obložena s svetlimi keramičnimi ploščicami."
        },
        {
            "filename": "kopalnica-talne-ploščice-odtok.jpg",
            "alt_text": "Pogled od zgoraj na talne ploščice v kopalnici z odtokom in delom steklene tuš kabine. Ploščice so bele z marmornatim vzorcem."
        }
    ];

    // Use filename directly for the map key
    const imageAltMap = new Map(imageMetadata.map(item => {
        return [item.filename, item.alt_text];
    }));

    const seededImageIds: { [key: string]: number } = {}; // Store seeded image IDs by filename

    try {
        const { default: path } = await import('path');
        const { default: fs } = await import('fs/promises');
        const imagesDir = path.resolve(process.cwd(), 'seed/images'); // Resolve from project root
        payload.logger.info(`Resolved image directory path: ${imagesDir}`); // Log the resolved path
        const files = await fs.readdir(imagesDir);
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

        for (const filename of imageFiles) {
            const altText = imageAltMap.get(filename);
            if (!altText) {
                payload.logger.warn(`Alt text not found for image: ${filename}, skipping.`);
                continue;
            }

            const filePath = path.join(imagesDir, filename);
            payload.logger.info(`Attempting to create Media for: ${filename}`);

            try {
                const mediaDoc = await payload.create({
                    collection: 'media',
                    filePath: filePath, // Use filePath for local file uploads
                    data: {
                        tenant: tenantA1.id,
                        alt: altText,
                    },
                    req: simulatedReq, // Pass simulatedReq for tenant context
                });
                payload.logger.info(`Created Media: ${filename} with ID: ${mediaDoc.id}`);
                seededImageIds[filename] = mediaDoc.id; // Store ID
            } catch (mediaErr) {
                payload.logger.error(`Error creating Media for ${filename}:`, mediaErr);
            }
        }
        payload.logger.info('Media seeding completed.');

    } catch (err) {
      payload.logger.error('Error reading image directory or seeding media:', err);
      if (err instanceof Error) {
        payload.logger.error('Stack trace:', err.stack); // Log stack trace
      } else {
        payload.logger.error('Full error object:', err); // Log the full error if it's not an Error instance
      }
    }

    // --- Update Services with Images ---
    payload.logger.info('Attempting to update Services with images...');
    try {
        if (serviceVodoinstalacije?.id && seededImageIds['gorenje-bojler-vodovodne-napeljave.jpg']) {
            await payload.update({
                collection: 'services',
                id: serviceVodoinstalacije.id,
                data: {
                    images: [
                        { image: seededImageIds['gorenje-bojler-vodovodne-napeljave.jpg'] },
                        // Add more relevant images if needed
                        ...(seededImageIds['talno-ogrevanje-sistem-namestitev.jpg'] ? [{ image: seededImageIds['talno-ogrevanje-sistem-namestitev.jpg'] }] : []),
                    ],
                },
                req: simulatedReq, // Pass req for tenant context if needed by hooks/access
            });
            payload.logger.info(`Updated Service '${serviceVodoinstalacije.title}' with images.`);
        }
        if (serviceMontaza?.id && seededImageIds['kopalnica-umivalnik-wc-pralni-stroj.jpg']) {
            await payload.update({
                collection: 'services',
                id: serviceMontaza.id,
                data: {
                    images: [
                        { image: seededImageIds['kopalnica-umivalnik-wc-pralni-stroj.jpg'] },
                        ...(seededImageIds['kopalnica-prha-črna-armatura.jpg'] ? [{ image: seededImageIds['kopalnica-prha-črna-armatura.jpg'] }] : []),
                    ],
                },
                req: simulatedReq,
            });
            payload.logger.info(`Updated Service '${serviceMontaza.title}' with images.`);
        }
    } catch (err) {
        payload.logger.error('Error updating Services with images:', err);
    }

    // --- Update Projects with Images ---
    payload.logger.info('Attempting to update Projects with images...');
    try {
        if (projectAdaptacija?.id && seededImageIds['kopalnica-prenova-ploščice-okno.jpg']) {
            await payload.update({
                collection: 'projects',
                id: projectAdaptacija.id,
                data: {
                    projectImages: [
                        {
                            image1: seededImageIds['kopalnica-prenova-ploščice-okno.jpg'],
                            // altText1: imageAltMap.get('kopalnica-prenova-ploščice-okno.jpg'), // Optionally add alt text here too
                        },
                        ...(seededImageIds['kopalnica-prenova-polaganje-ploščic.jpg'] ? [{
                            image1: seededImageIds['kopalnica-prenova-polaganje-ploščic.jpg'],
                        }] : []),
                         ...(seededImageIds['kopalnica-ploščice-stene-prenova.jpg'] ? [{
                            image1: seededImageIds['kopalnica-ploščice-stene-prenova.jpg'],
                        }] : []),
                    ],
                },
                req: simulatedReq,
            });
            payload.logger.info(`Updated Project '${projectAdaptacija.title}' with images.`);
        }
        if (projectNovogradnja?.id && seededImageIds['hiša-terasa-zunanje-ureditve.jpg']) {
            await payload.update({
                collection: 'projects',
                id: projectNovogradnja.id,
                data: {
                    projectImages: [
                        {
                            image1: seededImageIds['hiša-terasa-zunanje-ureditve.jpg'],
                        },
                        ...(seededImageIds['talno-ogrevanje-razdelilnik-cevi.jpg'] ? [{
                            image1: seededImageIds['talno-ogrevanje-razdelilnik-cevi.jpg'],
                        }] : []),
                    ],
                },
                req: simulatedReq,
            });
            payload.logger.info(`Updated Project '${projectNovogradnja.title}' with images.`);
        }
    } catch (err) {
        payload.logger.error('Error updating Projects with images:', err);
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
              kicker: 'A1 INŠTALACIJE', // Added Kicker
              title: 'Vaš Zanesljiv Partner za Vodoinštalacije', // Previously heroTitle
              subtitle: 'A1 INŠTALACIJE d.o.o. - Kakovost in zanesljivost na prvem mestu.', // Previously heroSubtitle
              includeFollowersBadge: true, // Added flag
              ...(seededImageIds['hiša-terasa-zunanje-ureditve.jpg'] && { image: [seededImageIds['hiša-terasa-zunanje-ureditve.jpg']] }),
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

    // --- Create Footer Menu --- (New Step)
    payload.logger.info(`Creating Footer Menu for tenant ${tenantId}...`);
    let footerMenu;
    try {
      footerMenu = await payload.create({
        collection: 'menus',
        data: {
          tenant: tenantA1.id,
          title: 'Meni za Nogo (A1)', // Admin title
          menuItems: [
            // Map quickLinks to simple menuItems (no children/description/icon)
            { title: 'Domov', hasChildren: false, href: '/' },
            { title: 'Storitve', hasChildren: false, href: '/storitve' },
            { title: 'Projekti', hasChildren: false, href: '/projekti' },
            { title: 'O nas', hasChildren: false, href: '/o-nas' },
            { title: 'Kontakt', hasChildren: false, href: '#kontakt' },
          ],
        },
        req: simulatedReq, // For tenant context
      });
      payload.logger.info(`Footer Menu created with ID: ${footerMenu.id}`);
    } catch (err) {
      payload.logger.error('Error creating Footer Menu:', err);
    }

    // --- Create Social Links Menu --- (New Step)
    payload.logger.info(`Creating Social Links Menu for tenant ${tenantId}...`);
    let socialMenu;
    try {
      socialMenu = await payload.create({
        collection: 'menus',
        data: {
          tenant: tenantA1.id,
          title: 'Meni za Družabna Omrežja (A1)', // Admin title
          menuItems: [
            {
              title: 'Facebook', // Title for the link
              hasChildren: false,
              href: 'https://facebook.com/a1instalacije', // Direct URL
            },
            {
              title: 'Google Mnenja', // Title for the link
              hasChildren: false,
              href: 'https://google.com/maps/place/a1instalacije', // Direct URL (Placeholder)
            },
            // Add more social links as simple menu items if needed
          ],
        },
        req: simulatedReq, // For tenant context
      });
      payload.logger.info(`Social Links Menu created with ID: ${socialMenu.id}`);
    } catch (err) {
      payload.logger.error('Error creating Social Links Menu:', err);
    }

    // --- Seed Footer --- (Update to use footerMenu relationship)
    payload.logger.info(`Seeding Footer for tenant ${tenantId}...`);
    payload.logger.info('Attempting to update Footer global...');
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        copyrightText: '© {{year}} A1 INŠTALACIJE d.o.o. Vse pravice pridržane.',
        menuSections: [
          // Section 1: Using the main footer menu (no title)
          ...(footerMenu ? [{
            blockType: 'menuSection' as const, // Ensure literal type
            menu: footerMenu.id,
            // title: '', // Optional title, leaving empty
          }] : []),
          // Section 2: Using the social menu (with title)
          ...(socialMenu ? [{
            blockType: 'menuSection' as const, // Ensure literal type
            title: 'Povezave', // Example title
            menu: socialMenu.id,
          }] : []),
        ],
        ...(socialMenu ? { socialMenu: socialMenu.id } : {}), // Keep the separate socialMenu field for now, if used elsewhere
        showContactInFooter: true,
        showLogoText: true,
      },
      req: simulatedReq, // Re-added simulated req for tenant context
    });
    payload.logger.info(`Footer seeded for tenant ${tenantId}.`);

  } catch (error) {
    payload.logger.error('Caught error during seeding process:');
    payload.logger.error('Error seeding database:', error);
  }
};