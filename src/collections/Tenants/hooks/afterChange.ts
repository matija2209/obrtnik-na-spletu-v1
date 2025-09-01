// Optimized afterChangeHook implementation
import { CollectionAfterChangeHook, Payload } from 'payload';
import { r2 } from '@/lib/r2-client';
import { generateTenantCSS } from '@/utilities/css-generator';
import type { Tenant } from '@payload-types';
import { revalidateTag } from 'next/cache';
import { TENANT_CSS_TAG, TENANT_THEME_CONFIG_TAG } from '@/utilities/themeUtils';
import { handleTenantDomainUpdate } from '@/lib/edge-config';


// Debounce function to prevent multiple rapid generations
const pendingTenants = new Map();
const DEBOUNCE_TIME = 2000; // 2 seconds

// Extend the global scope to include assetProcessingTimeout
declare global {
  var assetProcessingTimeout: NodeJS.Timeout | null;
}

const afterChangeHook: CollectionAfterChangeHook<Tenant> = async ({ doc, req, previousDoc }) => {
  if (!doc?.slug) {
    req.payload.logger.warn(`Tenant document ${doc?.id} is missing required fields for asset generation.`);
    return;
  }
  
  pendingTenants.set(doc.slug, {
    timestamp: Date.now(),
    tenant: doc,
    payload: req.payload
  });
  
  if (!global.assetProcessingTimeout) {
    global.assetProcessingTimeout = setTimeout(processAllPendingTenants, DEBOUNCE_TIME);
  }

  // Handle Edge Config domain mapping updates
  (async () => {
    try {
      const oldDomain = previousDoc?.domain;
      const newDomain = doc.domain;
      
      if (oldDomain !== newDomain || !previousDoc) {
        req.payload.logger.info(`Updating Edge Config domain mapping for tenant: ${doc.slug}`);
        await handleTenantDomainUpdate(newDomain, doc.slug, oldDomain);
        req.payload.logger.info(`Edge Config updated for tenant: ${doc.slug}`);
      }
    } catch (error) {
      req.payload.logger.error(`Error updating Edge Config for tenant ${doc.slug}:`, error);
    }
  })();

  // Revalidate tags asynchronously to avoid issues with Next.js render cycle
  (async () => {
    try {
      req.payload.logger.info(`Attempting to revalidate tags for tenant: ${doc.slug}`);
      revalidateTag(TENANT_THEME_CONFIG_TAG(doc.slug));
      revalidateTag(TENANT_CSS_TAG(doc.slug));
      req.payload.logger.info(`Successfully revalidated tags for tenant: ${doc.slug}`);
    } catch (error) {
      req.payload.logger.error(`Error revalidating tags for tenant ${doc.slug} in afterChange hook:`, error);
    }
  })();

  return;
};

async function processAllPendingTenants() {
  global.assetProcessingTimeout = null;
  
  const now = Date.now();
  const tenantsToProcess: Tenant[] = [];
  let payloadInstance: Payload | null = null;
  
  pendingTenants.forEach((data, slug) => {
    if (now - data.timestamp >= DEBOUNCE_TIME) {
      tenantsToProcess.push(data.tenant);
      payloadInstance = data.payload;
      pendingTenants.delete(slug);
    }
  });
  
  if (pendingTenants.size > 0) {
    global.assetProcessingTimeout = setTimeout(processAllPendingTenants, DEBOUNCE_TIME);
  }
  
  if (tenantsToProcess.length > 0 && payloadInstance) {
    try {
      const currentPayload = payloadInstance as Payload;
      currentPayload.logger.info(`Processing assets for ${tenantsToProcess.length} tenants`);
      
      await Promise.all(tenantsToProcess.map(tenant => 
        processAndUploadTenantAssets(tenant, currentPayload) // Changed function name here
      ));
      
      await updateManifestAndVersions(currentPayload);
      
    } catch (error: any) {
       if (payloadInstance) {
         (payloadInstance as Payload).logger.error(`Batch asset processing error: ${error?.message || error}`);
       }
    }
  }
}

// Asset processing for a single tenant (CSS and Theme Config JSON)
async function processAndUploadTenantAssets(tenant: Tenant, payload: Payload) { // Renamed and updated
  const cssFileName = `tenant-styles/${tenant.slug}.css`;
  const configFileName = `tenant-configs/${tenant.slug}.json`; // New config file name
  let cssSuccess = false;
  let configSuccess = false;

  try {
    payload.logger.info(`Processing assets for tenant ${tenant.slug}`);

    // 1. Generate and Upload CSS
    payload.logger.info(`Generating CSS for tenant ${tenant.slug}`);
    const css = generateTenantCSS(tenant);
    const cssUploadResult = await r2.uploadFile(cssFileName, css, {
      contentType: 'text/css',
      cacheControl: 'public, max-age=3600', // Existing cache for CSS
    });
    
    if (!cssUploadResult.success) {
      payload.logger.error(`Failed to upload CSS for ${tenant.slug}: ${cssUploadResult.error}`);
    } else {
      payload.logger.info(`Successfully uploaded CSS for ${tenant.slug}.`);
      cssSuccess = true;
    }

    // 2. Prepare and Upload Tenant Theme Configuration JSON
    const themeConfig = {
      slug: tenant.slug,
      colors: tenant.colors, // Include colors as per plan, can be adjusted
      typography: {
        headingFont: tenant.typography?.headingFont ? {
          name: tenant.typography.headingFont.name,
          weights: tenant.typography.headingFont.weights?.map(w => w.weight),
          subsets: tenant.typography.headingFont.subsets?.map(s => s.subset),
        } : undefined,
        bodyFont: tenant.typography?.bodyFont ? {
          name: tenant.typography.bodyFont.name,
          weights: tenant.typography.bodyFont.weights?.map(w => w.weight),
          subsets: tenant.typography.bodyFont.subsets?.map(s => s.subset),
        } : undefined,
      },
      // Add any other configurations the layout might need from the tenant
    };
    console.log(themeConfig);
    
    payload.logger.info(`Uploading theme config for tenant ${tenant.slug} to ${configFileName}`);
    const configUploadResult = await r2.uploadFile(configFileName, JSON.stringify(themeConfig, null, 2), {
      contentType: 'application/json',
      cacheControl: 'public, max-age=300', // Cache for config as per plan
    });

    if (!configUploadResult.success) {
      payload.logger.error(`Failed to upload theme config for ${tenant.slug}: ${configUploadResult.error}`);
    } else {
      payload.logger.info(`Successfully uploaded theme config for ${tenant.slug}.`);
      configSuccess = true;
    }
    
    return cssSuccess && configSuccess; // Return overall success status

  } catch (error: any) {
    payload.logger.error(`Error processing assets for tenant ${tenant.slug}: ${error?.message || error}`);
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
