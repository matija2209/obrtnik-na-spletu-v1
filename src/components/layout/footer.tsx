import Image from 'next/image';
import Link from 'next/link';
import CurrentYear from '../misc/current-year';
import Logo from '../common/logo';
import { getBusinessInfo, getLogoUrl, getNavbar } from '@/lib/payload';
import type { BusinessInfo, Navbar } from '../../../payload-types';

// Legal links
const legalLinks = [
  { text: 'Zasebnost', href: '/zasebnost' },
  { text: 'Pogoji uporabe', href: '/pogoji-uporabe' }
];

async function Footer() {
  const businessInfo = await getBusinessInfo() as BusinessInfo;
  const navbarData = await getNavbar() as Navbar;
  
  // Map navigation items from navbar data
  const navigationLinks = navbarData.navItems?.map(item => ({
    text: item.title,
    href: item.hasChildren ? '#' : item.href || '#'
  })) || [];

    // Calculate logo URLs on the server

    const logoDarkUrl = getLogoUrl(businessInfo, 'dark');
  
  
  return (
    <footer className="bg-gray-100 text-gray-800 py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Logo and Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo */}
          <div className="flex flex-col items-start">
            <Logo logoSrc={logoDarkUrl}  location="footer" />
            <div className="text-sm space-y-1 mt-4">
              <p className="font-semibold">{businessInfo.companyName}</p>
              <p>Davčna številka: {businessInfo.vatId}</p>
              <p>Matična: {businessInfo.businessId}</p>
              <p>Datum vpisa: {businessInfo.registryDate}</p>
              <p>{businessInfo.location}</p>
            </div>
          </div>

          {/* Company Description */}
          <div className="col-span-1 md:col-span-2 space-y-3 text-sm">
            <p className="font-semibold text-gray-900 mb-2">Zakaj Izbrati Nas</p>
            
              <p>{businessInfo.companyAbout}</p>
          </div>
        </div>

        {/* Contact and Navigation */}
        <div className="mt-8 pt-8 border-t border-gray-300 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-900 mb-2">Kontakt</p>
            <a
              href={`tel:${businessInfo.phoneNumber}`}
              className="block hover:text-blue-600 transition-colors"
            >
              Iztok: {businessInfo.phoneNumber}
            </a>
            <a
              href={`mailto:${businessInfo.email}`}
              className="block hover:text-blue-600 transition-colors"
            >
              {businessInfo.email}
            </a>
            <p className="mt-2">
              {businessInfo.location}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-900 mb-2">Navigacija</p>
            <ul className="space-y-2">
              {navigationLinks.map((link, index) => (
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

          {/* Legal */}
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-900 mb-2">Pravno</p>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
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

          {/* Support */}
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-900 mb-2">Podpora</p>
            <p>Kontaktirajte nas za ponudbo:</p>
            <a
              href={`tel:${businessInfo.phoneNumber}`}
              className="block hover:text-blue-600 transition-colors"
            >
              {businessInfo.phoneNumber}
            </a>
            <a
              href={`mailto:${businessInfo.email}`}
              className="block hover:text-blue-600 transition-colors"
            >
              {businessInfo.email}
            </a>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-sm text-gray-600 text-center">
          © <CurrentYear /> {businessInfo.companyName}, Vse Pravice pridržane.
        </p>
      </div>
    </footer>
  );
} 

export default Footer;