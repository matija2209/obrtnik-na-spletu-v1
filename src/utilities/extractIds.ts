/**
 * Utility functions to extract IDs from PayloadCMS relationship fields
 * that can contain either numbers (IDs) or full objects after population
 */

export type IdOrObject<T = any> = number | (T & { id: number });

/**
 * Extract ID from a single item that can be either an ID or a populated object
 */
export function extractId<T>(item: IdOrObject<T>): number | null {
  if (!item) {
    return null;
  }
  if (typeof item === 'number' || typeof item === 'string') {
    return Number(item);
  }
  return item.id;
}

/**
 * Extract IDs from an array of items that can be either IDs or populated objects
 */
export function extractIds<T>(items: IdOrObject<T>[]): number[] {
  return items.map(extractId).filter((id): id is number => id !== null);
}

/**
 * Extract IDs from a nullable array, returning an empty array if null/undefined
 */
export function extractIdsFromNullable<T>(items: IdOrObject<T>[] | null | undefined): number[] {
  if (!items || !Array.isArray(items)) {
    return [];
  }
  return extractIds(items);
}

/**
 * Extract ID from a single nullable item
 */
export function extractIdFromNullable<T>(item: IdOrObject<T> | null | undefined): number | null {
  if (!item) {
    return null;
  }
  return extractId(item);
}

/**
 * Check if an item is a populated object (not just an ID)
 */
export function isPopulatedObject<T>(item: IdOrObject<T>): item is T & { id: number } {
  return typeof item === 'object' && item !== null && 'id' in item;
}

/**
 * Filter out any items that are just IDs, returning only populated objects
 */
export function getPopulatedObjects<T>(items: IdOrObject<T>[]): (T & { id: number })[] {
  return items.filter(isPopulatedObject);
}

/**
 * Get populated objects from a nullable array
 */
export function getPopulatedObjectsFromNullable<T>(items: IdOrObject<T>[] | null | undefined): (T & { id: number })[] {
  if (!items || !Array.isArray(items)) {
    return [];
  }
  return getPopulatedObjects(items);
} 