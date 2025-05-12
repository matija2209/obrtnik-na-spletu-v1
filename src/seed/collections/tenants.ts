import type { Payload } from 'payload';
import type { Tenant } from '../../../payload-types';
import type { SeedArgs } from '../utils';

export const seedTenants = async (args: Pick<SeedArgs, 'payload'>): Promise<{ tenantA1: Tenant, tenantMoj: Tenant }> => {
  const { payload } = args;
  payload.logger.info('--- Seeding Tenants ---');

  // --- Create Tenant A1 ---
  payload.logger.info('Creating tenant "a1-instalacije"...');
  const tenantA1 = await payload.create({
    collection: 'tenants',
    data: {
      name: 'A1 INŠTALACIJE d.o.o.',
      slug: 'a1-instalacije',
      domain:"a1-instalacije.si",
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
        headingFont: {
          name: 'Inter',
          weights: [{ weight: '700' }],
          subsets: [{ subset: 'latin' }],
        },
        bodyFont: {
          name: 'Inter',
          weights: [{ weight: '400' }],
          subsets: [{ subset: 'latin' }],
        },
      },
      radius: '0.625rem',
    },
  });
  payload.logger.info(`Tenant "a1-instalacije" created with ID: ${tenantA1.id}`);

  // --- Create Tenant Moj Mojster ---
  payload.logger.info('Creating tenant "Moj Mojster Gradnja"...');
  const tenantMoj = await payload.create({
    collection: 'tenants',
    data: {
      name: 'Moj Mojster Gradnja d.o.o.',
      slug: 'moj-mojster-gradnja',
      domain: 'moj-mojster-gradnja.si',
      colors: {
        primary: 'oklch(0.82 0.1663 83.77)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.32 0.1025 253.89)',
        secondaryForeground: 'oklch(0.98 0.005 0)',
      },
      typography: {
        headingFont: {
          name: 'Inter',
          weights: [{ weight: '700' }],
          subsets: [{ subset: 'latin' }],
        },
        bodyFont: {
          name: 'Inter',
          weights: [{ weight: '400' }],
          subsets: [{ subset: 'latin' }],
        },
      },
      // Radius might be missing here in the original seed, add if needed
    }
  });
  payload.logger.info(`Tenant "Moj Mojster Gradnja" created with ID: ${tenantMoj.id}`);

  return { tenantA1, tenantMoj };
}; 