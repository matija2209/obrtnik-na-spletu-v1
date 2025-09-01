import { Project } from '@payload-types';
import { CollectionAfterChangeHook } from 'payload';

export const syncProjectHighlightsBlocks: CollectionAfterChangeHook<Project> = async ({
  doc,
  req,
  operation,
}) => {
  // Only run for create operations (new projects)
  if (operation !== 'create') {
    return doc;
  }
  
  if (doc.source === "facebook") {
    // Avoid sync for facebook projects to avoid infinite loops
    req.payload.logger.info(`Skipping project highlights sync for facebook project ${doc.id}`);
    return doc;
  }
  
  try {
    // Get the server URL for making HTTP requests
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    
    req.payload.logger.info(`Starting project highlights sync process for project ${doc.id}`);

    // Strategy 1: Try immediate execution first (faster, more reliable)
    setTimeout(async () => {
      try {
        const immediateResponse = await fetch(`${serverUrl}/api/projects/sync-with-page`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication header if CRON_SECRET is available
            ...(process.env.CRON_SECRET && {
              'Authorization': `Bearer ${process.env.CRON_SECRET}`
            }),
          },
          body: JSON.stringify({ projectId: doc.id }),
        });

        if (immediateResponse.ok) {
          const result = await immediateResponse.json();
          req.payload.logger.info(
            `Successfully executed immediate project highlights sync for project ${doc.id}: ${JSON.stringify(result.result)}`
          );
          return; // Success - no need for fallback
        } else {
          const errorText = await immediateResponse.text();
          req.payload.logger.warn(
            `Immediate project highlights sync failed for project ${doc.id}: ${immediateResponse.status} ${errorText}. Falling back to job queue.`
          );
        }
      } catch (immediateError) {
        req.payload.logger.warn(
          `Immediate project highlights sync error for project ${doc.id}: ${(immediateError as Error).message}. Falling back to job queue.`
        );
      }

      // Strategy 2: Fallback to job queue system
      try {
        // Queue the job using the Local API (this still works for queuing)
        const job = await req.payload.jobs.queue({
          task: 'syncProjectToProjectHighlights',
          input: {
            projectId: doc.id.toString(),
          },
          waitUntil: new Date(Date.now() + 2000), // Wait 2 seconds
        });

        req.payload.logger.info(
          `Queued project highlights sync task ${job.id} for project ${doc.id} as fallback`
        );

        // Trigger job execution via HTTP endpoint
        setTimeout(async () => {
          try {
            const jobResponse = await fetch(`${serverUrl}/api/payload-jobs/run`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(process.env.CRON_SECRET && {
                  'Authorization': `Bearer ${process.env.CRON_SECRET}`
                }),
              },
            });

            if (jobResponse.ok) {
              const result = await jobResponse.json();
              req.payload.logger.info(
                `Successfully triggered job execution for project ${doc.id}: ${JSON.stringify(result)}`
              );
            } else {
              const errorText = await jobResponse.text();
              req.payload.logger.warn(
                `Failed to trigger job execution for project ${doc.id}: ${jobResponse.status} ${errorText}`
              );
            }
          } catch (jobError) {
            req.payload.logger.warn(
              `Error triggering job execution for project ${doc.id}: ${(jobError as Error).message}`
            );
          }
        }, 2000); // Wait 2 seconds for job execution

      } catch (queueError) {
        req.payload.logger.error(
          `Failed to queue project highlights sync task for project ${doc.id}: ${(queueError as Error).message}`
        );
      }
    }, 1000); // Wait 1 second to ensure database transaction is complete

  } catch (error) {
    req.payload.logger.error(
      `Failed to initiate project highlights sync for project ${doc.id}: ${(error as Error).message}`
    );
  }

  return doc;
};
