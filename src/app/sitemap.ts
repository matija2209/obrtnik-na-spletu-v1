import type { MetadataRoute } from 'next'

// Replace with your actual domain
const BASE_URL = 'https://www.rezanje-betona.si/';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'yearly', // Adjust as needed
      priority: 1, // Adjust as needed
    },
    // Add more routes here, for example:
    // {
    //   url: `${BASE_URL}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
    // {
    //   url: `${BASE_URL}/contact`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.5,
    // },
  ]
} 