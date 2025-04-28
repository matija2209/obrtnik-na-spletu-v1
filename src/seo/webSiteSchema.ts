import { serviceSchema } from "./serviceSchema";

// Define WebSite schema
export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": serviceSchema.name, // Reuse name from serviceSchema
  "url": serviceSchema.url, // Reuse url from serviceSchema
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${serviceSchema.url}?s={search_term_string}`, // Example search URL structure
    "query-input": "required name=search_term_string"
  }
}; 