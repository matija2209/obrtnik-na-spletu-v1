# How to Actually Use Vercel Edge Config in Production (With Real Gotchas)

I was building a multi-tenant SaaS platform where each client gets their own custom domain. Initially, I hardcoded domain-to-tenant mappings directly in my Next.js middleware. Every time I onboarded a new client, I had to update the code and redeploy the entire application. After dealing with this pain point for months, I decided to implement Vercel Edge Config to make domain mapping dynamic.

The official documentation covers the basics, but I ran into several gotchas that aren't well documented. This guide walks you through the complete implementation, including the authentication pitfalls and integration patterns I discovered along the way.

## The Problem: Hardcoded Domain Mappings

In my multi-tenant application, I was handling tenant routing like this in my middleware:

```typescript
// File: src/middleware.ts
export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  let tenantSlug: string | null = null;

  // Hardcoded mappings - requires redeployment for each new tenant
  if (hostname === 'client1.vercel.app') {
    tenantSlug = 'client1';
  } else if (hostname === 'client2.vercel.app') {
    tenantSlug = 'client2';
  } else if (hostname === 'client3.vercel.app') {
    tenantSlug = 'client3';
  }

  // Set tenant context and continue...
}
```

This approach worked initially, but it became a maintenance nightmare. Every new client required a code change and full redeployment. I needed a solution that would allow dynamic domain mapping without touching the codebase.

## Enter Vercel Edge Config

Edge Config is Vercel's key-value store designed for data that's accessed frequently but updated infrequently. It runs at the edge globally and provides sub-millisecond read times. Perfect for domain mappings that need to be fast but don't change often.

The key advantage over alternatives like Redis or external databases is that Edge Config runs directly on Vercel's edge network without additional API calls or latency.

## Setting Up Edge Config

First, create an Edge Config in your Vercel dashboard. Navigate to your project's Storage tab and create a new Edge Config. I named mine `payload-multi-tenant` to reflect its purpose.

Once created, you'll get an ID that looks like `ecfg_te3v8ffuwn4nomdzmx8r1lfr3hr0`. This ID is crucial for both reading data via the SDK and managing data via the REST API.

### Gotcha #1: Two Different Token Types

This is where I hit the first major gotcha. Vercel Edge Config requires two different types of authentication tokens:

1. **Edge Config Read Access Token**: Used by the `@vercel/edge-config` SDK to read data
2. **Vercel API Token**: Used by the REST API to create, update, and delete Edge Config items

I initially tried using the same token for both operations and spent hours debugging "Not authorized" errors. The Edge Config dashboard has a separate "Tokens" tab where you create read access tokens specifically for the SDK.

### Environment Configuration

Here's the environment setup you'll need:

```env
# File: .env
# Edge Config for tenant domain mappings
EDGE_CONFIG_ID=ecfg_te3v8ffuwn4nomdzmx8r1lfr3hr0
VERCEL_API_TOKEN=your_vercel_api_token_here
EDGE_CONFIG=https://edge-config.vercel.com/ecfg_te3v8ffuwn4nomdzmx8r1lfr3hr0?token=your_read_access_token_here
```

The `EDGE_CONFIG` variable contains the full connection string that the SDK uses. The `VERCEL_API_TOKEN` is used for programmatic updates via REST API.

Install the Edge Config SDK:

```bash
npm install @vercel/edge-config
```

## Creating Edge Config Utility Functions

Rather than calling the Vercel API directly throughout my application, I created utility functions to handle Edge Config operations:

```typescript
// File: src/lib/edge-config.ts
const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID;
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional for team accounts

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
```

These utility functions handle the REST API calls for managing Edge Config data. The upsert operation handles both creating new mappings and updating existing ones, which simplifies the logic in my CMS hooks.

### Gotcha #2: Team ID Requirements

If your Vercel project is under a team (not a personal account), you must include the `teamId` parameter in your API calls. The "Not Found" errors I encountered were actually because I was missing the team ID in my API requests.

For personal/hobby accounts, you can omit the `teamId` parameter entirely.

## Updating the Middleware

Now I could replace my hardcoded mappings with dynamic Edge Config lookups:

```typescript
// File: src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/edge-config'

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  
  let tenantSlug: string | null = null;

  // Check Edge Config for hostname mapping first
  if (process.env.EDGE_CONFIG) {
    try {
      const edgeConfigSlug = await get(hostname) as string | undefined;
      if (edgeConfigSlug) {
        tenantSlug = edgeConfigSlug;
        console.log(`Found tenant '${tenantSlug}' from Edge Config for hostname '${hostname}'`);
      }
    } catch (error) {
      console.error('Error fetching from Edge Config:', error);
    }
  }
  
  // Fallback to hardcoded mappings if no Edge Config result
  if (!tenantSlug) {
    if (hostname === 'client1.vercel.app') {
      tenantSlug = 'client1';
    } else if (hostname === 'client2.vercel.app') {
      tenantSlug = 'client2';
    }
    // ... other hardcoded mappings
  }

  // Continue with tenant routing logic...
}
```

The middleware now attempts to resolve the domain through Edge Config first, then falls back to hardcoded mappings if Edge Config is unavailable or returns no result. This approach provides a smooth migration path and ensures reliability.

### Gotcha #3: Connection String vs Manual Configuration

The Edge Config SDK requires either a connection string in the `EDGE_CONFIG` environment variable or manual configuration. I initially tried to configure it manually and ran into "No connection string provided" errors.

The connection string format is specific: `https://edge-config.vercel.com/[config-id]?token=[read-token]`. You get this from the Edge Config dashboard, but make sure you're using the read access token, not the API token.

## Automatic Synchronization with Payload CMS

The real power comes from automatically keeping Edge Config in sync with your CMS data. I integrated Edge Config updates directly into my Payload CMS collection hooks.

### After Change Hook

The after change hook handles both creating new tenants and updating existing ones:

```typescript
// File: src/collections/Tenants/hooks/afterChange.ts
import { CollectionAfterChangeHook } from 'payload';
import type { Tenant } from '@payload-types';
import { handleTenantDomainUpdate } from '@/lib/edge-config';

const afterChangeHook: CollectionAfterChangeHook<Tenant> = async ({ doc, req, previousDoc }) => {
  if (!doc?.slug) {
    req.payload.logger.warn(`Tenant document ${doc?.id} is missing required fields.`);
    return;
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

  // Other hook logic...
};
```

This hook compares the old and new domain values. If they're different, or if this is a new tenant, it updates the Edge Config mapping accordingly.

### After Delete Hook

When tenants are deleted, their domain mappings should be removed from Edge Config:

```typescript
// File: src/collections/Tenants/hooks/afterDelete.ts
import { CollectionAfterDeleteHook } from 'payload';
import type { Tenant } from '@payload-types';
import { deleteDomainMapping } from '@/lib/edge-config';

const afterDeleteHook: CollectionAfterDeleteHook<Tenant> = async ({ doc, req }) => {
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
```

The delete hook ensures that when tenants are removed from the CMS, their domain mappings are also cleaned up from Edge Config, preventing stale data.

### Gotcha #4: Asynchronous Hook Execution

Initially, I tried to make the Edge Config updates synchronous within the hook execution. This caused timeouts and blocked the CMS interface. Wrapping the Edge Config operations in async immediately-invoked function expressions (IIFE) allows the hook to complete quickly while the Edge Config updates happen in the background.

## Domain Update Handler

The domain update logic handles the complexity of managing domain changes:

```typescript
// File: src/lib/edge-config.ts (additional function)
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
```

This function handles three scenarios: creating new mappings, updating existing mappings, and removing old mappings when domains change. The logic ensures that Edge Config stays clean and accurate.

## Integration with Collection Configuration

To activate the hooks, you need to register them in your Payload collection configuration:

```typescript
// File: src/collections/Tenants/index.ts
import afterChangeHook from './hooks/afterChange'
import afterDeleteHook from './hooks/afterDelete'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  hooks: {
    afterChange: [afterChangeHook],
    afterDelete: [afterDeleteHook],
  },
  fields: [
    {
      name: 'domain',
      label: 'Domain',
      type: 'text',
      admin: {
        description: 'Used for domain-based tenant handling',
      },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
    },
    // Other fields...
  ],
}
```

The hooks integrate seamlessly with Payload's lifecycle events. Whenever someone creates, updates, or deletes a tenant through the admin interface, the Edge Config mappings update automatically.

### Gotcha #5: Development vs Production Environment Handling

During development, you might not always have Edge Config properly configured. I added environment checking to prevent the middleware from failing in development:

```typescript
// File: src/middleware.ts (updated section)
// Check Edge Config for hostname mapping first
if (process.env.EDGE_CONFIG) {
  try {
    const edgeConfigSlug = await get(hostname) as string | undefined;
    if (edgeConfigSlug) {
      tenantSlug = edgeConfigSlug;
      console.log(`Found tenant '${tenantSlug}' from Edge Config for hostname '${hostname}'`);
    }
  } catch (error) {
    console.error('Error fetching from Edge Config:', error);
  }
}

// Fallback to hardcoded mappings if no Edge Config result
if (!tenantSlug) {
  // Your existing hardcoded logic here
}
```

This pattern ensures that your application works in development even without Edge Config configured, while providing the performance benefits in production.

## Common Gotchas and Solutions

### Authentication Token Confusion

The biggest stumbling block was understanding that Edge Config requires two different tokens. The read access token is specifically for the SDK and has a different format than Vercel API tokens. You create read access tokens in the Edge Config dashboard under the "Tokens" tab.

### Environment Variable Loading

Edge Config connection strings must be available at build time and runtime. If you're getting "No connection string provided" errors, verify that your environment variables are properly loaded and that you've restarted your development server after adding them.

### API Response Handling

The Vercel REST API returns different error codes for different scenarios. A "forbidden" error usually means token issues, while "not_found" often indicates missing team ID parameters or incorrect Edge Config IDs.

### Propagation Delays

Edge Config updates can take a few seconds to propagate globally. In my testing, I found that updates typically appear within 2-3 seconds worldwide, but you should account for this delay in your application logic if immediate consistency is critical.

## Production Deployment

When deploying to production, make sure all three environment variables are set in your Vercel project settings:

- `EDGE_CONFIG_ID`: Your Edge Config identifier
- `VERCEL_API_TOKEN`: API token with write permissions
- `EDGE_CONFIG`: Full connection string with read token

The integration works seamlessly once deployed. New tenants can be onboarded through the CMS without any code changes or redeployments.

## Results and Benefits

After implementing Edge Config, my tenant onboarding process became completely self-service. The sales team can add new clients directly through the CMS, and their custom domains work immediately without developer intervention.

The performance impact was negligible. Edge Config reads add less than 1ms to middleware execution, and the global distribution means consistent performance worldwide.

Most importantly, I eliminated a significant operational bottleneck. What used to require code changes and deployments now happens automatically through the CMS interface.

## Conclusion

Vercel Edge Config transforms static configuration into dynamic, manageable data. The key to successful implementation is understanding the authentication model, properly handling both read and write operations, and integrating updates into your existing data management workflows.

While the documentation covers the basic API, the real-world implementation involves several gotchas around token types, environment configuration, and error handling. By building Edge Config updates directly into your CMS workflows, you create a system that stays automatically synchronized without manual intervention.

The combination of Edge Config's performance characteristics and automatic synchronization makes it an excellent choice for configuration data that needs to be fast, global, and manageable through your existing admin interfaces.

Let me know in the comments if you have questions, and subscribe for more practical development guides.

Thanks, Matija