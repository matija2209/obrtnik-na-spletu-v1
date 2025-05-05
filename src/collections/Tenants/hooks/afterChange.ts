// Optimized afterChangeHook implementation
import { CollectionAfterChangeHook, Payload } from 'payload';
import { r2 } from '@/lib/r2-client';
import { generateTenantCSS } from '@/utilities/css-generator';
import type { Tenant } from '@payload-types';

// Debounce function to prevent multiple rapid CSS generations
const pendingTenants = new Map();
const DEBOUNCE_TIME = 2000; // 2 seconds

// Extend the global scope to include cssProcessingTimeout
declare global {
  var cssProcessingTimeout: NodeJS.Timeout | null;
}

const afterChangeHook: CollectionAfterChangeHook<Tenant> = async ({ doc, req }) => {
  if (!doc?.slug) {
    req.payload.logger.warn(`Tenant document ${doc?.id} is missing required fields for CSS generation.`);
    return;
  }
  
  // Store the tenant in the pending map with latest timestamp
  pendingTenants.set(doc.slug, {
    timestamp: Date.now(),
    tenant: doc,
    payload: req.payload
  });
  
  // Schedule processing if not already scheduled
  if (!global.cssProcessingTimeout) {
    global.cssProcessingTimeout = setTimeout(processAllPendingTenants, DEBOUNCE_TIME);
  }
  
  // Return immediately to unblock the CMS operation
  return;
};

// Process all tenants that have been updated
async function processAllPendingTenants() {
  // Clear the timeout reference
  global.cssProcessingTimeout = null;
  
  // Get pending tenants that haven't been updated in the last DEBOUNCE_TIME
  const now = Date.now();
  const tenantsToProcess: Tenant[] = []; // Explicitly type the array
  let payloadInstance: Payload | null = null; // Explicitly type and allow null
  
  pendingTenants.forEach((data, slug) => {
    if (now - data.timestamp >= DEBOUNCE_TIME) {
      tenantsToProcess.push(data.tenant);
      payloadInstance = data.payload;
      pendingTenants.delete(slug);
    }
  });
  
  // If there are still pending tenants, schedule another processing
  if (pendingTenants.size > 0) {
    global.cssProcessingTimeout = setTimeout(processAllPendingTenants, DEBOUNCE_TIME);
  }
  
  // Process each tenant that's ready
  if (tenantsToProcess.length > 0 && payloadInstance) {
    try {
      // Use type assertion to assure TypeScript payloadInstance is not null here
      const currentPayload = payloadInstance as Payload;
      currentPayload.logger.info(`Processing CSS for ${tenantsToProcess.length} tenants`);
      
      // Process tenant CSS in parallel
      await Promise.all(tenantsToProcess.map(tenant => 
        processAndUploadTenantCSS(tenant, currentPayload)
      ));
      
      // Update manifest only once after all individual tenant files are uploaded
      await updateManifestAndVersions(currentPayload);
      
    } catch (error: any) { // Catch any type of error
       // Use type assertion here as well, in case the error happens before assignment inside try
       if (payloadInstance) {
         (payloadInstance as Payload).logger.error(`Batch CSS processing error: ${error?.message || error}`);
       }
    }
  }
}

// CSS processing for a single tenant
async function processAndUploadTenantCSS(tenant: Tenant, payload: Payload) { // Add type annotations
  const cssFileName = `tenant-styles/${tenant.slug}.css`;
  
  try {
    // Generate and upload CSS
    payload.logger.info(`Generating CSS for tenant ${tenant.slug}`);
    const css = generateTenantCSS(tenant);
    
    const cssUploadResult = await r2.uploadFile(cssFileName, css, {
      contentType: 'text/css',
      cacheControl: 'public, max-age=3600',
    });
    
    if (!cssUploadResult.success) {
      payload.logger.error(`Failed to upload CSS for ${tenant.slug}: ${cssUploadResult.error}`);
      return false;
    }
    
    payload.logger.info(`Successfully uploaded CSS for ${tenant.slug}`);
    return true;
    
  } catch (error: any) { // Catch any type of error
    payload.logger.error(`Error processing CSS for tenant ${tenant.slug}: ${error?.message || error}`);
    return false;
  }
}

// Update manifest and versions files once after all tenant files are processed
async function updateManifestAndVersions(payload: Payload) { // Add type annotation
  const manifestFileName = 'tenant-styles/manifest.json';
  const versionsFileName = 'tenant-styles/versions.json';
  
  try {
    // Fetch all tenants in one query
    const allTenantsResult = await payload.find({
      collection: 'tenants',
      limit: 1000,
      depth: 0,
      overrideAccess: false, // Ensure we get all tenants regardless of user access
    });
    
    const tenantIds = allTenantsResult.docs.map(t => t.slug);
    
    // Upload manifest
    const manifestUploadResult = await r2.uploadFile(manifestFileName, JSON.stringify(tenantIds), {
      contentType: 'application/json',
      cacheControl: 'public, max-age=60',
    });
    
    if (!manifestUploadResult.success) {
      payload.logger.error(`Failed to upload manifest file: ${manifestUploadResult.error}`);
    }
    
    // Update versions file
    let versions: Record<string, number> = {}; // Initialize as empty object
    try {
      const versionDataString = await r2.getFileAsString(versionsFileName);
      versions = JSON.parse(versionDataString);
      if (typeof versions !== 'object' || versions === null) {
        payload.logger.warn('Versions file content is not a valid object. Resetting.');
        versions = {};
      }
    } catch (e: any) { // Catch any type of error
      // Check the specific error code for S3/R2 errors
      if (e?.Code === 'NoSuchKey' || e?.$metadata?.httpStatusCode === 404 || e.message?.includes('not found')) { 
        payload.logger.info('Versions file not found, creating new one.');
      } else {
        // Log other errors as actual errors
        payload.logger.error(`Error fetching or parsing versions file: ${e.message}`, e);
      }
      versions = {}; // Reset versions if error occurs
    }
    
    // Update timestamps for all tenants in the collection
    allTenantsResult.docs.forEach(tenant => {
        if (tenant.slug) { // Check if slug exists
            versions[tenant.slug] = Date.now();
        }
    });
    
    const versionsUploadResult = await r2.uploadFile(versionsFileName, JSON.stringify(versions), {
      contentType: 'application/json',
      cacheControl: 'public, max-age=60',
    });
    
    if (!versionsUploadResult.success) {
      payload.logger.error(`Failed to upload versions file: ${versionsUploadResult.error}`);
    }
    
  } catch (error: any) { // Catch any type of error
    payload.logger.error(`Error updating manifest and versions: ${error?.message || error}`);
  }
}

export default afterChangeHook;
