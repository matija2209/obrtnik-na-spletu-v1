"use client"
import { Menu, X, Phone } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/common/logo';
import { cn } from '@/lib/utils';
import GoogleIcon from '@/components/common/icons/google-icon';
import { Cta } from '@payload-types';
import CtaButton from '@/components/ui/cta-button';

// Define the NavItem interface
interface NavItem {
  title: string;
  href: string;
  hasChildren?: boolean;
  children?: {
    title: string;
    href: string;
    description: string;
    icon?: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[];
  description?: string;
}

const reviewLink = "https://search.google.com/local/writereview?placeid=ChIJq2Y3G3QyZUcRfDWJZ6f8-KI";


// Updated Mobile Navigation Component with nested links
const MobileNav = ({ 
  isScrolled, 
  navItems,
  currentLogoSrc,
  mainCta,
  // Add business info props
  companyName,
  phoneNumber,
  email,
  location
}: { 
  isScrolled: boolean, 
  navItems: NavItem[],
  currentLogoSrc?: string,
  mainCta?: Cta,
  // Define types for new props
  companyName?: string,
  phoneNumber?: string,
  email?: string,
  location?: string
}) => {
    // State for managing expanded submenus
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
    
    const toggleExpanded = (title: string) => {
      setExpandedMenus(prev => ({
        ...prev,
        [title]: !prev[title]
      }));
    };
    
    return (
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`fixed top-4 right-4 z-50 rounded-full w-10 h-10 flex items-center justify-center ${isScrolled ? 'bg-white text-gray-800 shadow-md' : 'text-white'}`}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs p-0">
            <SheetHeader className="px-4 py-3">
              <SheetTitle className="sr-only">Glavni meni</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center">
                  {currentLogoSrc && <Logo logoSrc={currentLogoSrc} location="mobile-menu" />}
                </div>
              </div>
  
              <nav className="flex-1 overflow-y-auto py-4">
                <div className="space-y-1 px-2">
                  {navItems.map((item) => (
                    <div key={item.title}>
                      {item.hasChildren ? (
                        <>
                          <button 
                            onClick={() => toggleExpanded(item.title)}
                            className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium transition-colors text-gray-700 hover:text-primary"
                          >
                            {item.title}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`h-4 w-4 transition-transform ${expandedMenus[item.title] ? 'rotate-180' : ''}`}
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </button>
                          
                          {expandedMenus[item.title] && (
                            <div className="pl-4 mt-1 space-y-1 border-l-2 border-gray-100 ml-4">
                              {item.children?.map((child) => (
                                <SheetClose asChild key={child.href}>
                                  <Link
                                    href={child.href}
                                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:text-primary"
                                    >
                                    {child.title}
                                  </Link>
                                </SheetClose>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            className="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors relative group text-gray-700 hover:text-primary"
                            >
                            {item.title}
                          </Link>
                        </SheetClose>
                      )}
                    </div>
                  ))}
                  
                  {/* Replace hardcoded buttons with dynamic CtaButton */}
                  {mainCta && (
                    <div className="mt-4 space-y-2 px-2">
                       <SheetClose asChild>
                          {/* Render the dynamic CtaButton */} 
                          {/* Wrapping in a div to maintain structure, adjust as needed */} 
                          <div className="w-full">
                            <CtaButton mainCta={mainCta} />
                          </div>
                       </SheetClose>
                    </div>
                  )}
                </div>
              </nav>
  
              {/* Divider and Contact Info - Use dynamic data */}
              <div className="mt-auto border-t border-gray-100 px-4 py-4">
                <div className="space-y-1 text-sm text-gray-600">
                  {/* Use dynamic companyName */}
                  <p className="font-semibold text-gray-700">{companyName}</p>
                  {/* Use dynamic phoneNumber */}
                  {phoneNumber && <a href={`tel:${phoneNumber.replace(/\s+/g, '')}`} className="block hover:text-primary">{phoneNumber}</a>}
                  {/* Use dynamic email */}
                  {email && <a href={`mailto:${email}`} className="block hover:text-primary">{email}</a>}
                  {/* Use dynamic location */}
                  {location && <p>{location}</p>}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  };

  
export default MobileNav