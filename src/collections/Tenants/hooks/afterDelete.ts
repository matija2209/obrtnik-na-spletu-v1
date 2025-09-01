import { CollectionAfterDeleteHook } from 'payload';
import type { Tenant } from '@payload-types';
import { deleteDomainMapping } from '@/lib/edge-config';

const afterDeleteHook: CollectionAfterDeleteHook<Tenant> = async ({ doc, req }) => {
  // Remove domain mapping from Edge Config when tenant is deleted
  if (doc?.domain) {
    try {
      req.payload.logger.info(`Removing Edge Config domain mapping for deleted tenant: ${doc.slug}`);
      await deleteDomainMapping(doc.domain);
      req.payload.logger.info(`Edge Config mapping removed for domain: ${doc.domain}`);
    } catch (error) {
      req.payload.logger.error(`Error removing Edge Config mapping for ${doc.domain}:`, error);
    }
  }
};

export default afterDeleteHook;