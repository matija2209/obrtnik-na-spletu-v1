/**
 * Generate product URL from slug
 */
export const getProductUrl = (slug?: string | null): string => {
  return slug ? `/izdelki/${slug}` : "/izdelki"
};