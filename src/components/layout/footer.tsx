import Image from 'next/image';
import Link from 'next/link';
import CurrentYear from '../misc/current-year';
import Logo from '../common/logo';
import { getLogoUrl } from '@/lib/payload';
import type { BusinessInfo, Footer as FooterType, Navbar as NavbarType, Media, Menu, MenuSectionItem } from '@payload-types';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, LocateIcon, Phone, Mail } from 'lucide-react';
import { getImageUrl } from '@/utilities/getImageUrl';

// Define the props for the Footer component
interface FooterProps {
  footerData: FooterType | null;
  businessInfoData: BusinessInfo | null;
  navbarData: NavbarType | null;
}

// Legal links (consider moving to Footer global if needed)
const legalLinks = [
  { text: 'Zasebnost', href: '/zasebnost' },
  { text: 'Pogoji uporabe', href: '/pogoji-uporabe' }
];

// Map social platform values to icons
const socialIconMap: { [key: string]: React.ElementType } = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
  // google: SomeGoogleIcon, // Add appropriate icon if needed
};

async function Footer({ footerData, businessInfoData, navbarData }: FooterProps) {
  // Calculate logo URLs using businessInfoData prop
  const logoDarkUrl = await  getLogoUrl(businessInfoData, 'dark');
  // Removed footerData.logo logic, using only businessInfoData logo
  const footerLogoUrl = logoDarkUrl; // Use the dark logo by default for footer

  // Format copyright text
  const copyrightText = footerData?.copyrightText
    ? footerData.copyrightText.replace('{{year}}', new Date().getFullYear().toString())
    : `© ${new Date().getFullYear()} ${businessInfoData?.companyName ?? 'Vaše Podjetje'}, Vse Pravice pridržane.`;

  return (
    <footer className="bg-gray-100 text-gray-800 py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top section: Logo, Description, Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Basic Info */}
          <div className="flex flex-col items-start space-y-4">
            {footerLogoUrl && businessInfoData && <Logo logoSrc={footerLogoUrl} location="footer" title={businessInfoData.companyName ?? undefined} />}
            {businessInfoData && (
              <div className="text-sm space-y-1">
                <p className="font-semibold">{businessInfoData.companyName}</p>
                {businessInfoData.vatId && <p>Davčna št.: {businessInfoData.vatId}</p>}
                {businessInfoData.businessId && <p>Matična št.: {businessInfoData.businessId}</p>}
              </div>
            )}
          </div>

          {/* Dynamic Menu Sections */}
          {footerData?.menuSections && footerData.menuSections.map((section, index) => {
            // Ensure the menu relation is populated and has items
            const menu = section.menu as Menu; // Type assertion, ensure populated
            const menuItems = menu?.menuItems;

            if (!menuItems || menuItems.length === 0) {
              return null; // Don't render section if menu is empty or not populated
            }

            return (
              <div key={section.id || index} className="space-y-2 text-sm">
                {/* Optional Section Title */}
                {section.title && (
                  <p className="font-semibold text-gray-900 mb-2">{section.title}</p>
                )}
                {/* Menu Items */}
                <ul className="space-y-2">
                  {menuItems.map((item, itemIndex) => (
                    <li key={item.id || itemIndex}>
                      <Link
                        href={item.href || '#'} // Use href directly from menu item
                        className="hover:text-blue-600 transition-colors"
                      >
                        {item.title} {/* Use title directly */}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Contact Info (conditional) - Moved potentially to adjust grid layout */}
          {footerData?.showContactInFooter !== false && (
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-gray-900 mb-2">Kontakt</p>
              <a
                href={`tel:${businessInfoData?.phoneNumber}`}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Phone size={16} /> {businessInfoData?.phoneNumber}
              </a>
              <a
                href={`mailto:${businessInfoData?.email}`}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Mail size={16} /> {businessInfoData?.email}
              </a>
              <p className="flex items-center gap-2">
                <LocateIcon size={16} /> {businessInfoData?.location}
              </p>
            </div>
          )}

          {/* Social Links - derived from socialMenu */}
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-900 mb-2">Povežite se z nami</p>
            <div className="flex space-x-4">
              {/* Type assertion used here, ensure footerData includes a populated socialMenu */}
              {(footerData as any)?.socialMenu?.menuItems?.map((link: any, index: number) => { // Added explicit types
                // Use link.title (lowercase) as the key for socialIconMap
                const platformKey = link.title?.toLowerCase();
                const IconComponent = platformKey ? socialIconMap[platformKey] : null;
                const url = link.href || '#'; // Use href for the link URL

                return IconComponent ? (
                  <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                    <IconComponent size={20} />
                    <span className="sr-only">{link.title}</span> {/* Use title for screen reader */}
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* Bottom section: Copyright and Legal */}
        <div className="mt-8 pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p className="text-center md:text-left mb-4 md:mb-0">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
} 

export default Footer;