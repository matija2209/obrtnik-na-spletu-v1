# How to Set Up Payload CMS for Instant Development Iteration and Live Preview on Vercel

I was working on a multi-tenant Payload CMS project recently when I realized I needed a development workflow that would let me iterate on schema changes instantly while still being able to share live previews with stakeholders via Vercel. The default migration-based approach felt too slow for rapid prototyping, but I still needed the ability to deploy previews without breaking anything.

After experimenting with different approaches, I discovered a simple 5-step workflow that gives you the best of both worlds: instant local development with automatic schema syncing, plus seamless Vercel preview deployments using a shared database. This setup is perfect for solo development or small teams who prioritize development speed during the prototyping phase.

## The Problem with Traditional Workflows

Most Payload CMS guides push you toward migrations from day one, which makes sense for production environments. But during active development, this creates friction. Every schema change requires creating a migration, running it locally, then ensuring it runs correctly on deployment. For rapid iteration, this overhead adds up quickly.

On the other hand, if you use Payload's built-in schema auto-sync locally but try to deploy to Vercel, you run into the classic "relation does not exist" errors because Vercel runs in production mode where auto-sync is disabled.

## The Shared Database Solution

The key insight is using the same database for both your local development and Vercel preview environments. This eliminates schema synchronization issues entirely because both environments connect to the same PostgreSQL instance.

Here's how to set this up in your environment configuration:

```bash
# File: .env
DATABASE_URL=postgresql://username:password@host:port/database_name
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

Make sure your Vercel project uses the same `DATABASE_URL` environment variable. This shared database approach means when you update the schema locally, Vercel automatically has access to the updated structure.

## The 5-Step Development Workflow

Once you have the shared database configured, your development cycle becomes incredibly streamlined. Here's the workflow I use for every schema change:

```bash
# 1. Make your changes in collection files or payload.config.ts
# 2. Generate the database schema
pnpm payload generate:db-schema

# 3. Update TypeScript types (optional but recommended)
pnpm payload generate:types

# 4. Start development server (auto-syncs database schema)
pnpm dev

# 5. Deploy to Vercel - uses the already-updated shared database
```

This workflow leverages Payload's automatic schema synchronization that happens when you run the development server. The `pnpm dev` command not only starts your Next.js server but also ensures your database schema matches your collection definitions.

## Understanding Schema Auto-Sync

When you run `pnpm dev`, Payload performs several important operations behind the scenes. It compares your current collection definitions against the existing database schema and applies any necessary changes automatically. This includes creating new tables, adding columns, updating relationships, and modifying field types.

The `generate:db-schema` command creates a TypeScript representation of your database schema that Payload's PostgreSQL adapter uses to understand how to structure queries and relationships. While this step isn't always required, it ensures consistency between your configuration and the generated schema file.

The `generate:types` command updates your TypeScript definitions based on your collections, which provides better IDE support and type safety throughout your application.

## Vercel Integration Benefits

Because Vercel connects to the same database that you've already updated locally, deployments become seamless. Your Vercel preview environments automatically have access to the current schema state without requiring any migration steps or additional configuration.

This setup is particularly powerful for client presentations or stakeholder reviews. You can iterate on schema changes locally, test them immediately, then push to Vercel for a live demo URL without worrying about database synchronization issues.

## When This Approach Works Best

This workflow is ideal during the active development phase when you're frequently adjusting your content model, adding new collections, or refining field structures. It's particularly effective for solo developers or small teams working on the same codebase who need to move quickly without the overhead of formal migration management.

The shared database approach works well when you're the primary developer or when your team coordinates schema changes effectively. Since everyone shares the same database state, there's no confusion about which schema version is current.

## Production Transition Strategy

While this approach is excellent for development velocity, you'll eventually want to transition to a migration-based workflow for production deployments. When you're ready to move beyond the prototyping phase, you can create your initial migration from the current schema state and begin using formal database migrations for future changes.

This transition preserves all your development work while establishing the controlled change management that production environments require.

## Conclusion

This 5-step workflow transforms Payload CMS development into a rapid iteration cycle where schema changes take seconds instead of minutes. By using a shared database between local and Vercel environments, you eliminate the complexity of schema synchronization while maintaining the ability to share live previews effortlessly.

The key is recognizing that development workflows don't need to mirror production constraints. During active development, prioritize speed and flexibility. You can always transition to more formal processes when your application architecture stabilizes.

Let me know in the comments if you have questions about setting up this workflow, and subscribe for more practical development guides.

Thanks, Matija