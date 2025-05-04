import { Inquiry } from '@payload-types';
import type { CollectionAfterChangeHook } from 'payload';


export const sendNotification: CollectionAfterChangeHook<Inquiry> = async ({ doc, req, operation }) => {
  if (operation !== 'create') {
    return doc;
  }

  req.payload.logger.info(`New inquiry received: ${doc.id}. Notification logic to be implemented here.`);

  return doc;
};
