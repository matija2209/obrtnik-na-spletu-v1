/**
 * Edge Config API utilities for managing tenant domain mappings
 */

const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID;
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional

if (!EDGE_CONFIG_ID || !VERCEL_API_TOKEN) {
  console.warn('Missing EDGE_CONFIG_ID or VERCEL_API_TOKEN environment variables');
}

/**
 * Update or create a domain mapping in Edge Config
 */
export async function upsertDomainMapping(domain: string, slug: string): Promise<boolean> {
  if (!EDGE_CONFIG_ID || !VERCEL_API_TOKEN) {
    console.error('Edge Config not configured');
    return false;
  }

  try {
    const url = `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items${TEAM_ID ? `?teamId=${TEAM_ID}` : ''}`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            operation: 'upsert',
            key: domain,
            value: slug,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Edge Config upsert failed:', error);
      return false;
    }

    console.log(`Edge Config updated: ${domain} -> ${slug}`);
    return true;
  } catch (error) {
    console.error('Edge Config upsert error:', error);
    return false;
  }
}

/**
 * Delete a domain mapping from Edge Config
 */
export async function deleteDomainMapping(domain: string): Promise<boolean> {
  if (!EDGE_CONFIG_ID || !VERCEL_API_TOKEN) {
    console.error('Edge Config not configured');
    return false;
  }

  try {
    const url = `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items${TEAM_ID ? `?teamId=${TEAM_ID}` : ''}`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            operation: 'delete',
            key: domain,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Edge Config delete failed:', error);
      return false;
    }

    console.log(`Edge Config deleted: ${domain}`);
    return true;
  } catch (error) {
    console.error('Edge Config delete error:', error);
    return false;
  }
}

/**
 * Handle domain mapping updates when tenant domain/slug changes
 */
export async function handleTenantDomainUpdate(
  newDomain: string | undefined,
  newSlug: string,
  oldDomain?: string
): Promise<void> {
  // Remove old domain mapping if it changed
  if (oldDomain && oldDomain !== newDomain) {
    await deleteDomainMapping(oldDomain);
  }

  // Add new domain mapping if domain exists
  if (newDomain) {
    await upsertDomainMapping(newDomain, newSlug);
  }
}