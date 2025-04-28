import { localizedMetadata } from "@/utils/metadata";

// Define the service schema data (using Slovenian locale)
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": [
    "Rezanje betona",
    "Vrtanje betona",
    "Diamantno rezanje",
    "Diamantno vrtanje",
  ],
  "provider": {
    "@type": "HomeAndConstructionBusiness", // Make type more specific
    "name": "Rezanje in vrtanje betona, Ziherl Iztok s.p.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jakčeva ulica 39",
      "addressLocality": "Ljubljana",
      "postalCode": "1000",
      "addressCountry": "SI", // Slovenia country code
    },
    "telephone": "+386 70 653 910",
    "email": "rezanje.vrtanje.betona@gmail.com",
    "url": "https://rezanje-betona.si/", // Updated base URL
    "image": "https://rezanje-betona.si/logo.PNG", // Updated image URL
    "priceRange": "Na povpraševanje", // Example, adjust as needed
    "sameAs": [ // Add social links
      "https://www.facebook.com/idealen.rez/",
      "https://g.co/kgs/VB7a8Lp"
    ],
    "openingHoursSpecification": [ // Add operating hours (by appointment)
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "09:00",
        "closes": "16:00",
        "description": "Po dogovoru" // By appointment
      }
    ]
  },
  "areaServed": {
    "@type": "AdministrativeArea",
    "name": "Slovenija (razen Štajerske)", // Description of area served
  },
  "name": localizedMetadata.sl.title, // Use title from metadata
  "description": localizedMetadata.sl.description, // Use description from metadata
  "url": "https://rezanje-betona.si/", // Updated base URL
  "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://rezanje-betona.si/#kontakt", // Updated URL template
        "inLanguage": "sl",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/IOSPlatform",
          "http://schema.org/AndroidPlatform"
        ]
      },
      "result": {
        "@type": "Reservation",
        "name": "Povpraševanje za rezanje/vrtanje betona"
      }
    }
}; 