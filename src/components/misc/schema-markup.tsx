export default function SchemaMarkup() {
  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'D-Print d.o.o.',
    url: 'https://www.D-Print.si',
    logo: 'https://www.D-Print.si/logo.png',
    description: 'Inženirsko podjetje specializirano za razvoj programske opreme za preračun strojnih elementov.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Seliška cesta 6b',
      addressLocality: 'Bled',
      postalCode: '4260',
      addressCountry: 'SI'
    },
    vatID: 'SI 20511230',
    email: 'info@D-Print.si',
    telephone: '+38659123456', // Replace with actual phone number
    sameAs: [
      'https://www.facebook.com/D-Print', // Replace with actual social media URLs
      'https://www.linkedin.com/company/D-Print'
    ],
    // Define the company's service areas
    areaServed: [
      'Slovenia', 'Croatia', 'Bosnia and Herzegovina',
      'North Macedonia', 'Albania', 'Bulgaria'
    ]
  };

  // Professional service schema
  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'D-Print d.o.o.',
    url: 'https://www.D-Print.si',
    // Services offered
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Inženirske storitve',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Razvoj programske opreme',
            description: 'Razvijamo specializirano programsko opremo za preračune strojnih elementov, prilagojeno vašim specifičnim potrebam.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Inženiring',
            description: 'Ponujamo celovite inženirske storitve za optimizacijo ležajev in gredi v vaših mehanskih sistemih.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Svetovanje',
            description: 'Naši strokovnjaki vam svetujejo pri izbiri najboljših rešitev za celotne pogonske sklope.'
          }
        }
      ]
    },
    // Official representative information
    brand: {
      '@type': 'Brand',
      name: 'KISSsoft',
      description: 'Uradni zastopnik programske opreme KISSsoft® za Slovenijo, Hrvaško, Bosno in Hercegovino, Severno Makedonijo, Albanijo in Bolgarijo.'
    }
  };

  // Local business schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'EngineeringBusiness',
    name: 'D-Print d.o.o.',
    image: 'https://www.D-Print.si/images/office.jpg',
    '@id': 'https://www.D-Print.si',
    url: 'https://www.D-Print.si',
    telephone: '+38659123456', // Replace with actual phone number
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Seliška cesta 6b',
      addressLocality: 'Bled',
      postalCode: '4260',
      addressCountry: 'SI'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '46.3683', // Replace with actual coordinates
      longitude: '14.1134'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
      ],
      opens: '08:00',
      closes: '16:00'
    },
    priceRange: '€€'
  };

  // Website schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'D-Print d.o.o.',
    url: 'https://www.D-Print.si',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.D-Print.si/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    inLanguage: ['sl-SI', 'en-US']
  };

  // Implement the schemas in the page
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}