import type { Payload } from 'payload';
import type { User } from '../../../payload-types';
import type { SeedArgs } from '../utils';

export const seedUsers = async (args: Pick<SeedArgs, 'payload' | 'tenantA1' | 'tenantMoj'>): Promise<{ userForGlobalUpdates: User }> => {
  const { payload, tenantA1, tenantMoj } = args;
  payload.logger.info('--- Seeding Users ---');

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
    },
  });
  payload.logger.info('Super admin created.');

  // --- Create Tenant A1 User ---
  payload.logger.info('Creating tenant user "miralem" for A1...');
  await payload.create({
    collection: 'users',
    data: {
      email: 'info.a1instalacije@gmail.com',
      password: 'gmb-2025', // Use a secure default password
      firstName: 'Miralem',
      lastName: 'Mehanović',
      roles: ['user'],
      tenants: [{ tenant: tenantA1.id, roles: ['tenant-admin'] }],
    },
  });
  payload.logger.info('Tenant user "miralem" created.');

  // --- Create Tenant Moj User ---
  payload.logger.info('Creating tenant user "Nihad Hotić" for Moj Mojster Gradnja...');
  await payload.create({
    collection: 'users',
    data: {
      email: 'makit1sp@gmail.com',
      password: 'Nihad113', // Use a secure default password
      firstName: 'Nihad',
      lastName: 'Hotić',
      roles: ['user'],
      tenants: [{ tenant: tenantMoj.id, roles: ['tenant-admin'] }],
    },
  });
  payload.logger.info('Tenant user "Nihad Hotić" for Moj Mojster Gradnja created.');

  // --- Fetch Tenant User for Global Updates ---
  // Using A1 user for seeding globals related to A1 tenant
  payload.logger.info('Fetching tenant user for global updates...');
  const tenantUserResult = await payload.find({
    collection: 'users',
    where: { email: { equals: 'info.a1instalacije@gmail.com' } },
    limit: 1,
    depth: 1, // Populate relationships like tenants
  });

  if (!tenantUserResult.docs[0]) {
    payload.logger.error('Could not find tenant user to perform global updates.');
    throw new Error('Tenant user info.a1instalacije@gmail.com not found for seeding globals.');
  }
  const userForGlobalUpdates = tenantUserResult.docs[0] as User; // Cast to User type
  payload.logger.info(`Using user ${userForGlobalUpdates.email} for subsequent global seeds.`);

  return { userForGlobalUpdates };
}; 