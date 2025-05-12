import type { Payload } from 'payload';
import type { OpeningHour } from '../../../payload-types';
import type { SeedArgs } from '../utils';

export const seedOpeningHours = async (args: Pick<SeedArgs, 'payload' | 'tenantA1'>): Promise<{ regularHours?: OpeningHour }> => {
  const { payload, tenantA1 } = args;
  payload.logger.info('--- Seeding Opening Hours ---');
  let regularHours: OpeningHour | undefined = undefined;

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
        ],
      },
      // Add req: simulatedReq if required by hooks/access control
    });
    payload.logger.info(`OpeningHours "Regular Business Hours" seeded with ID: ${regularHours.id}`);
  } catch (err) {
    payload.logger.error('Error seeding Opening Hours:', err);
    // Decide if this error should stop the seeding process
  }

  return { regularHours };
}; 