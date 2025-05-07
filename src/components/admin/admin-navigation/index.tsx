"use client"
import { AdminViewServerProps } from 'payload'
import Link from 'next/link'
import * as React from 'react'
import { usePathname } from 'next/navigation'
import { Icon } from '@/graphics/Icon'
import { 
  LayoutGrid, 
  Settings, 
  FileText, 
  DollarSign, 
  Image, 
  LayoutDashboard,
  Menu,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Define icon components for different categories
const StructureIcon = () => <LayoutGrid className="h-4 w-4" />
const ConfigIcon = () => <Settings className="h-4 w-4" />
const ContentIcon = () => <FileText className="h-4 w-4" />
const SalesIcon = () => <DollarSign className="h-4 w-4" />
const MediaIcon = () => <Image className="h-4 w-4" />
const DashboardIcon = () => <LayoutDashboard className="h-4 w-4" />

// Interface for navigation categories
interface NavCategory {
  key: string;
  label: string;
  icon: () => React.ReactNode;
  entities: {
    collections?: string[];
    globals?: string[];
  };
}

function AdminNavigation(props: AdminViewServerProps) {
  const { visibleEntities } = props;
  const [activeGroup, setActiveGroup] = React.useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  // Define collection categories
  const navCategories: NavCategory[] = [
    {
      key: 'dashboard',
      label: 'Nadzorna plošča',
      icon: DashboardIcon,
      entities: {}
    },
    {
      key: 'structure',
      label: 'Struktura',
      icon: StructureIcon,
      entities: {
        collections: ['pages', 'redirects', 'menus'],
        globals: ['navbar', 'footer']
      }
    },
    {
      key: 'config',
      label: 'Konfiguracija',
      icon: ConfigIcon,
      entities: {
        collections: ['tenants', 'users'],
        globals: ['business-info']
      }
    },
    {
      key: 'content',
      label: 'Vsebina',
      icon: ContentIcon,
      entities: {
        collections: ['projects', 'services', 'testimonials', 'faq-items', 'ctas', 'machinery', 'opening-hours', 'banners', 'forms'],
      }
    },
    {
      key: 'media',
      label: 'Medijska knjižnica',
      icon: MediaIcon,
      entities: {
        collections: ['media']
      }
    },
    {
      key: 'sales',
      label: 'Prodaja',
      icon: SalesIcon,
      entities: {
        collections: ['pricelists', 'form-submissions']
      }
    }
  ];

  // Filter visible collections and globals for each category
  const filterVisibleEntities = (category: NavCategory) => {
    const filtered: { collections: string[]; globals: string[] } = {
      collections: [],
      globals: []
    };

    if (visibleEntities && visibleEntities.collections && category.entities.collections) {
      filtered.collections = category.entities.collections.filter(col => 
        visibleEntities.collections.includes(col as any)
      );
    }

    if (visibleEntities && visibleEntities.globals && category.entities.globals) {
      filtered.globals = category.entities.globals.filter(glob => 
        visibleEntities.globals.includes(glob as any)
      );
    }

    return filtered;
  };

  return (
    <div className="relative admin-navigation-container">
      <div className="md:hidden flex items-center p-3 bg-white shadow fixed top-0 left-0 right-0 z-40 mobile-menu-toggle">
        <Menu className="w-6 h-6 mr-2" />
        <span className="font-medium">Menu</span>
      </div>
      
      <nav className="w-70 bg-white h-screen fixed top-0 left-0 shadow flex flex-col z-50 admin-navigation transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out">
        <div className="p-5 border-b border-gray-200 admin-logo">
          <Link href="/admin" className="no-underline flex items-center">
            <span className="text-lg font-semibold text-gray-800 logo-text flex gap-2"><Icon></Icon> Obrtnik na spletu</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 nav-groups">
          <div className="px-4 mb-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              asChild
            >
              <Link href="/admin">
                <LayoutDashboard className="shrink-0" />
                <span>Nadzorna plošča</span>
              </Link>
            </Button>
          </div>

          {navCategories.filter(category => category.key !== 'dashboard').map((category) => {
            const visibleItems = filterVisibleEntities(category);
            const hasItems = visibleItems.collections.length > 0 || visibleItems.globals.length > 0;
            
            const isActiveCategory = [...(category.entities.collections || []), ...(category.entities.globals || [])].some(slug => 
              pathname.startsWith(`/admin/collections/${slug}`) || pathname.startsWith(`/admin/globals/${slug}`)
            );

            React.useEffect(() => {
              if (isActiveCategory && activeGroup === null) {
                setActiveGroup(category.key);
              }
            }, [isActiveCategory, category.key, activeGroup]);

            if (!hasItems) return null;
            
            return (
              <div key={category.key} className={`mb-2 nav-group ${activeGroup === category.key ? 'active' : ''}`}>
                <div 
                  className={`flex items-center py-2.5 px-4 cursor-pointer rounded-md mx-2 transition-colors duration-200 hover:bg-accent hover:text-accent-foreground group-header ${activeGroup === category.key ? 'bg-accent/50' : ''}`} 
                  onClick={() => setActiveGroup(activeGroup === category.key ? null : category.key)}
                >
                  <div className="flex items-center gap-3">
                    <category.icon />
                    <span className="flex-1 font-medium text-sm group-label">{category.label}</span>
                  </div>
                  <div className={`transition-transform duration-300 ${activeGroup === category.key ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in group-items ${activeGroup === category.key ? 'max-h-screen' : 'max-h-0'}`}>
                  {visibleItems.collections.map((slug) => (
                    <Link 
                      href={`/admin/collections/${slug}`} 
                      key={`collections-${slug}`}
                      className={`block py-2 px-4 pl-12 text-sm transition-colors duration-200 hover:bg-accent hover:text-accent-foreground no-underline ${pathname === `/admin/collections/${slug}` ? 'bg-accent/50 font-medium' : 'text-foreground'}`}
                    >
                      <span className="item-label">{formatLabel(slug)}</span>
                    </Link>
                  ))}
                  
                  {visibleItems.globals.map((slug) => (
                    <Link 
                      href={`/admin/globals/${slug}`} 
                      key={`globals-${slug}`}
                      className={`block py-2 px-4 pl-12 text-sm transition-colors duration-200 hover:bg-accent hover:text-accent-foreground no-underline ${pathname === `/admin/globals/${slug}` ? 'bg-accent/50 font-medium' : 'text-foreground'}`}
                    >
                      <span className="item-label">{formatLabel(slug)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-gray-200 admin-nav-footer">
          <div className="flex items-center tenant-info">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm mr-3 tenant-avatar">A1</div>
            <div className="text-sm text-foreground whitespace-nowrap overflow-hidden text-overflow-ellipsis max-w-xs tenant-name">A1 INŠTALACIJE d.o.o.</div>
          </div>
        </div>
      </nav>
      
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${isMobileMenuOpen ? 'block' : 'hidden'} mobile-overlay`} onClick={() => setIsMobileMenuOpen(false)}></div>
    </div>
  );
}

// Helper function to format slugs as labels
function formatLabel(slug: string): string {
  const labels: { [key: string]: string } = {
    'tenants': 'Stranke',
    'users': 'Uporabniki',
    'media': 'Slike',
    'projects': 'Projekti',
    'services': 'Storitve',
    'testimonials': 'Mnenja strank',
    'faq-items': 'Pogosta vprašanja',
    'ctas': 'CTA elementi',
    'machinery': 'Stroji',
    'opening-hours': 'Odpiralni časi',
    'pages': 'Strani',
    'redirects': 'Preusmeritve',
    'pricelists': 'Ceniki',
    'banners': 'Oglasne pasice',
    'menus': 'Meniji',
    'forms': 'Obrazci',
    'form-submissions': 'Oddaje obrazcev',
    'business-info': 'Podatki o podjetju',
    'navbar': 'Navigacija',
    'footer': 'Noga'
  };
  
  return labels[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default AdminNavigation