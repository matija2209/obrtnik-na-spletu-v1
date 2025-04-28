import { getFaqItems } from "@/lib/payload";

const faqData = [{
  question: 'Kako poteka izvedba vaših del?',
  answer: 'Naša dela izvajamo brez tresljajev in prahu, kar zagotavlja čistočo in varnost. Pred vsakim posegom ustrezno zaščitimo prostor. Po končanem delu poskrbimo tudi za odvoz odvečnega materiala in po potrebi izvedemo strukturne ojačitve z lamelami ali traverzami.'
}]

// Generate FAQ Schema from faqData
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
}; 