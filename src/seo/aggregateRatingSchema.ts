import { serviceSchema } from "./serviceSchema";

// Prepare AggregateRating data
const validTestimonials = [{
  quote: 'Naša dela izvajamo brez tresljajev in prahu, kar zagotavlja čistočo in varnost. Pred vsakim posegom ustrezno zaščitimo prostor. Po končanem delu poskrbimo tudi za odvoz odvečnega materiala in po potrebi izvedemo strukturne ojačitve z lamelami ali traverzami.',
  rating: 5
}]
const totalReviews = validTestimonials.length;
const averageRating = totalReviews > 0
  ? validTestimonials.reduce((sum, t) => sum + t.rating, 0) / totalReviews
  : 0; // Avoid division by zero

// Define AggregateRating schema only if there are valid reviews
export const aggregateRatingSchema = totalReviews > 0 ? {
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "itemReviewed": {
    "@type": "LocalBusiness",
    "name": serviceSchema.provider.name, // Reuse name from serviceSchema
    "image": serviceSchema.provider.image,
    "address": serviceSchema.provider.address,
    "telephone": serviceSchema.provider.telephone,
    "url": serviceSchema.provider.url
  },
  "ratingValue": averageRating.toFixed(1), // Format to one decimal place
  "reviewCount": totalReviews
} : null; 