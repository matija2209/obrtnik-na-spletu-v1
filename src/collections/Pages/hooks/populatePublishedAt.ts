import type { CollectionBeforeChangeHook } from 'payload'

export const populatePublishedAt: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  // Ensure req.data is checked correctly
  if (operation === 'create' || operation === 'update') {
    // Check if the incoming data (potentially from form submission) already has publishedAt
    // And if the existing data (if updating) doesn't have it or if it's a create operation
    const isPublished = data._status === 'published';
    
    // Set publishedAt only when the document is being published and it's not already set
    if (isPublished && !data.publishedAt) {
        const now = new Date()
        return {
            ...data,
            publishedAt: now,
        }
    }
    // If the status is changing from published to draft, clear publishedAt
    if (!isPublished && data.publishedAt) {
      return {
        ...data,
        publishedAt: null, // Clear the date when unpublishing
      }
    }
  }

  return data
} 