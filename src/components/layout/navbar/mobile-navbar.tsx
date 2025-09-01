"use client"
import { Menu, Phone } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/common/logo';
import { cn } from '@/lib/utils';
import CtaButton from '@/components/ui/cta-button';
import { getEffectiveScrolled } from '@/utils/navbar-helpers';
import type { MobileNavProps } from './types';

// Updated Mobile Navigation Component with nested links
const MobileNav = ({ 
  isScrolled, 
  navItems,
  currentLogo,
  mainCta,
  companyName,
  phoneNumber,
  email,
  location,
  showLogoImage = true,
  showLogoText = true,
  isTransparent = false
}: MobileNavProps) => {
    // State for managing expanded submenus
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
    
    const toggleExpanded = (title: string) => {
      setExpandedMenus(prev => ({
        ...prev,
        [title]: !prev[title]
      }));
    };

    // Calculate effective scrolled state for menu button styling
    const effectiveScrolled = getEffectiveScrolled(isScrolled, isTransparent);
    
    return (
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "fixed top-4 right-4 z-50 rounded-full w-10 h-10 flex items-center justify-center transition-colors",
                effectiveScrolled 
                  ? 'bg-white text-gray-800 shadow-md hover:bg-gray-50' 
                  : 'text-white bg-black/10 hover:bg-black/20 backdrop-blur-sm'
              )}
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
              {/* Logo section - conditionally render based on settings */}
              {(showLogoImage || showLogoText) && (
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <Logo 
                      logo={showLogoImage ? currentLogo : null} 
                      title={showLogoText ? companyName : ''}
                      location="mobile-menu" 
                    />
                  </div>
                </div>
              )}
  
              <nav className="flex-1 overflow-y-auto py-4">
                <div className="space-y-1 px-2">
                  {navItems.map((item) => (
                    <div key={item.title}>
                      {item.hasChildren ? (
                        <>
                          <button 
                            onClick={() => toggleExpanded(item.title)}
                            className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium transition-colors text-gray-700 hover:text-primary hover:bg-gray-50"
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
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                expandedMenus[item.title] ? 'rotate-180' : ''
                              )}
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </button>
                          
                          <div className={cn(
                            "overflow-hidden transition-all duration-200 ease-in-out",
                            expandedMenus[item.title] 
                              ? "max-h-96 opacity-100" 
                              : "max-h-0 opacity-0"
                          )}>
                            <div className="pl-4 mt-1 space-y-1 border-l-2 border-gray-100 ml-4">
                              {item.children?.map((child) => (
                                <SheetClose asChild key={child.href}>
                                  <Link
                                    href={child.href}
                                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:text-primary hover:bg-gray-50"
                                  >
                                    {child.title}
                                  </Link>
                                </SheetClose>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            className="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors relative group text-gray-700 hover:text-primary hover:bg-gray-50"
                          >
                            {item.title}
                          </Link>
                        </SheetClose>
                      )}
                    </div>
                  ))}
                  
                  {/* CTA Button section */}
                  {mainCta && (
                    <div className="mt-6 px-2">
                      <SheetClose asChild>
                        <div className="w-full">
                          <CtaButton mainCta={mainCta}/>
                        </div>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </nav>
  
              {/* Contact Info Footer - conditionally render if data exists */}
              {(companyName || phoneNumber || email || location) && (
                <div className="mt-auto border-t border-gray-100 px-4 py-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    {companyName && (
                      <p className="font-semibold text-gray-700">{companyName}</p>
                    )}
                    {phoneNumber && (
                      <a 
                        href={`tel:${phoneNumber.replace(/\s+/g, '')}`} 
                        className="hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        {phoneNumber}
                      </a>
                    )}
                    {email && (
                      <a 
                        href={`mailto:${email}`} 
                        className="block hover:text-primary transition-colors"
                      >
                        {email}
                      </a>
                    )}
                    {location && (
                      <p className="text-gray-500">{location}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  };

  
export default MobileNav