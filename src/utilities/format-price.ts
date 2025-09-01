export const formatPrice = (price?: number | null): string | undefined => {
  if (!price) return undefined
  return new Intl.NumberFormat('sl-SI', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(price);
};