import type { Cta } from '@payload-types';

/**
 * Validates an array potentially containing CTAs (or their IDs) and returns an array of valid Cta objects.
 * Payload relationship fields can store either the full object or just the ID (number).
 * This function filters out any IDs and ensures only populated Cta objects remain.
 *
 * @param ctas - The array potentially containing numbers (IDs) or Cta objects.
 * @returns An array containing only valid Cta objects, or undefined if the input is not an array or is empty after filtering.
 */
export function validateCtas(ctas: (number | Cta)[] | undefined | null): Cta[] | undefined {
  if (!Array.isArray(ctas)) {
    return undefined;
  }

  const validCtas = ctas.filter(
    (cta): cta is Cta => typeof cta === 'object' && cta !== null && 'id' in cta // Check if it's a populated object
  );

  return validCtas.length > 0 ? validCtas : undefined;
} 