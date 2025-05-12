import type { Payload } from 'payload';
import type { Menu } from '../../../payload-types';
import type { SeedArgs } from '../utils';

export const seedMenus = async (args: Pick<SeedArgs, 'payload' | 'tenantA1' | 'simulatedReq'>): Promise<{ mainMenu?: Menu, footerMenu?: Menu, socialMenu?: Menu }> => {
  const { payload, tenantA1, simulatedReq } = args;
  payload.logger.info('--- Seeding Menus ---');
  let mainMenu: Menu | undefined = undefined;
  let footerMenu: Menu | undefined = undefined;
  let socialMenu: Menu | undefined = undefined;

  // --- Create Main Menu ---
  try {
    payload.logger.info(`Creating Main Menu for tenant ${tenantA1.id}...`);
    mainMenu = await payload.create({
      collection: 'menus',
      data: {
        tenant: tenantA1.id,
        title: 'Glavni Meni (A1)', // Admin title
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

  // --- Create Footer Menu ---
  try {
    payload.logger.info(`Creating Footer Menu for tenant ${tenantA1.id}...`);
    footerMenu = await payload.create({
      collection: 'menus',
      data: {
        tenant: tenantA1.id,
        title: 'Meni za Nogo (A1)', // Admin title
        menuItems: [
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

  // --- Create Social Links Menu ---
  try {
    payload.logger.info(`Creating Social Links Menu for tenant ${tenantA1.id}...`);
    socialMenu = await payload.create({
      collection: 'menus',
      data: {
        tenant: tenantA1.id,
        title: 'Meni za Družabna Omrežja (A1)', // Admin title
        menuItems: [
          {
            title: 'Facebook',
            hasChildren: false,
            href: 'https://facebook.com/a1instalacije', // Direct URL
          },
          {
            title: 'Google Mnenja',
            hasChildren: false,
            href: 'https://google.com/maps/place/a1instalacije', // Direct URL (Placeholder)
          },
        ],
      },
      req: simulatedReq, // For tenant context
    });
    payload.logger.info(`Social Links Menu created with ID: ${socialMenu.id}`);
  } catch (err) {
    payload.logger.error('Error creating Social Links Menu:', err);
  }

  return { mainMenu, footerMenu, socialMenu };
}; 