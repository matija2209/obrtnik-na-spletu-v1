import Image from 'next/image';
import Link from 'next/link';
import CurrentYear from '../misc/current-year';
import Logo from '../common/logo';
import { getLogoUrl } from '@/lib/payload';
import type { BusinessInfo, Footer as FooterType, Navbar as NavbarType, Media } from '@payload-types';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, LocateIcon, Phone, Mail } from 'lucide-react';
import { getImageUrl } from '@/utilities/getImageUrl';

// Define the props for the Footer component
interface FooterProps {
  footerData: FooterType;
  businessInfoData: BusinessInfo;
  navbarData: NavbarType;
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
  // Use navbarData prop for navigation links (as per original logic)
  const navigationLinks = navbarData.navItems?.map(item => ({
    text: item.title,
    href: item.hasChildren ? '#' : item.href || '#'
  })) || [];

  // Use footerData for quick links if available, otherwise use navbarData
  const quickLinks = footerData.quickLinks && footerData.quickLinks.length > 0 
    ? footerData.quickLinks.map(link => ({ text: link.label, href: link.url }))
    : navigationLinks;

  // Calculate logo URLs using businessInfoData prop
  const logoDarkUrl = getLogoUrl(businessInfoData, 'dark');
  const footerLogoUrl = footerData.logo && typeof footerData.logo === 'object' 
    ? getImageUrl(footerData.logo as Media) 
    : logoDarkUrl;

  // Format copyright text
  const copyrightText = footerData.copyrightText
    ? footerData.copyrightText.replace('{{year}}', new Date().getFullYear().toString())
    : `© ${new Date().getFullYear()} ${businessInfoData.companyName}, Vse Pravice pridržane.`;

  return (
    <footer className="bg-gray-100 text-gray-800 py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top section: Logo, Description, Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Basic Info */}
          <div className="flex flex-col items-start space-y-4">
            <Logo logoSrc={footerLogoUrl ?? logoDarkUrl} location="footer" title={businessInfoData.companyName} />
            <div className="text-sm space-y-1">
              <p className="font-semibold">{businessInfoData.companyName}</p>
              {businessInfoData.vatId && <p>Davčna št.: {businessInfoData.vatId}</p>}
              {businessInfoData.businessId && <p>Matična št.: {businessInfoData.businessId}</p>}
              {/* Add other info if needed */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-900 mb-2">Hitre Povezave</p>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:text-blue-600 transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info (conditional) */}
          {footerData.showContactInFooter !== false && (
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-gray-900 mb-2">Kontakt</p>
              <a
                href={`tel:${businessInfoData.phoneNumber}`}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Phone size={16} /> {businessInfoData.phoneNumber}
              </a>
              <a
                href={`mailto:${businessInfoData.email}`}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Mail size={16} /> {businessInfoData.email}
              </a>
              <p className="flex items-center gap-2">
                <LocateIcon size={16} /> {businessInfoData.location}
              </p>
            </div>
          )}

          {/* Social Links */}
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-900 mb-2">Povežite se z nami</p>
            <div className="flex space-x-4">
              {footerData.socialLinks?.map((link, index) => {
                const IconComponent = socialIconMap[link.platform];
                return IconComponent ? (
                  <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                    <IconComponent size={20} />
                    <span className="sr-only">{link.platform}</span>
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
          {footerData.showPrivacyLinks !== false && (
            <div className="flex space-x-4">
              {legalLinks.map((link, index) => (
                <Link key={index} href={link.href} className="hover:text-blue-600">
                  {link.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
} 

export default Footer;