import { AdminViewServerProps } from 'payload'
import React from 'react'
import Link from 'next/link'
import { getLatestFormSubmissions, DashboardFormSubmission } from '@/lib/payload';
import {
  LayoutDashboard,
  Pyramid,
  Settings,
  FileText,
  Users,
  Library,
  Globe,
  FileClock,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';

// Icon mapping for categories
const categoryIcons = {
  content: FileText,
  structure: Pyramid,
  sales: Users, // Or ShoppingCart if more appropriate for sales category itself
  config: Settings,
};

// Interface for navigation categories
interface DashboardNavCategory {
  key: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>; // Updated to use Lucide icon type
  collectionSlugs?: string[];
  globalSlugs?: string[];
  color?: string; // Added for category-specific coloring
}

const dashboardNavCategories: DashboardNavCategory[] = [
  {
    key: 'content',
    label: 'Kategorije vsebine',
    icon: categoryIcons.content,
    collectionSlugs: ['projects', 'services', 'testimonials', 'faq-items', 'ctas', 'machinery', 'opening-hours', 'banners', 'forms'],
    color: 'bg-blue-600',
  },
  {
    key: 'structure',
    label: 'Struktura spletne strani',
    icon: categoryIcons.structure,
    collectionSlugs: ['pages', 'redirects', 'menus'],
    globalSlugs: ['navbar', 'footer'],
    color: 'bg-green-500',
  },
  {
    key: 'sales',
    label: 'Prodaja in Povpraševanja',
    icon: categoryIcons.sales,
    collectionSlugs: ['pricelists', 'form-submissions'],
    color: 'bg-orange-600',
  },
  {
    key: 'config',
    label: 'Konfiguracija',
    icon: categoryIcons.config,
    collectionSlugs: ['tenants', 'users'],
    globalSlugs: ['business-info'],
    color: 'bg-purple-600',
  },
];

// Reusable Components

interface DashboardHeaderProps {
  fullName: string;
  email: string;
  roles: string[];
  tenantName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ fullName, email, roles, tenantName }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-5 border-b border-gray-200">
    <div className="mb-4 md:mb-0">
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">Pozdravljeni, {fullName}</h1>
      <p className="text-gray-600 text-base m-0">Namizje za <span className="font-semibold text-blue-600">{tenantName}</span></p>
    </div>
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold mr-4">
        {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
      </div>
      <div className="text-sm">
        <p className="font-semibold text-base mb-0.5">{fullName}</p>
        <p className="m-0 text-sm text-gray-600">{email}</p>
        <p className="m-0 text-sm text-gray-600">{roles.join(', ')}</p>
      </div>
    </div>
  </div>
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg p-5 shadow-md flex items-center transform transition duration-300 ease-in-out hover:translate-y-[-5px] hover:shadow-lg">
    <div className={`w-12 h-12 rounded-md flex items-center justify-center mr-4 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <h3 className="text-2xl font-bold mb-0.5">{value}</h3>
      <p className="m-0 text-gray-600 text-sm">{title}</p>
    </div>
  </div>
);

interface CategoryLinksProps {
  categoryKey: string;
  label: string;
  collections: string[];
  globals: string[];
  color: string;
}

const CategoryLinks: React.FC<CategoryLinksProps> = ({ categoryKey, label, collections, globals, color }) => (
  <div className="bg-white rounded-lg p-5 shadow-md">
    <h2 className="mb-5 text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">{label}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {collections.map(slug => (
        <Link
          href={`/admin/collections/${slug}`}
          key={`${categoryKey}-collection-${slug}`}
          className={`p-4 rounded-md flex justify-between items-center text-white no-underline font-medium transition duration-300 ease-in-out hover:translate-y-[-3px] hover:brightness-110 ${color}`}
        >
          <span className="text-sm">{slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      ))}
      {globals.map(slug => (
        <Link
          href={`/admin/globals/${slug}`}
          key={`${categoryKey}-global-${slug}`}
          className={`p-4 rounded-md flex justify-between items-center text-white no-underline font-medium transition duration-300 ease-in-out hover:translate-y-[-3px] hover:brightness-110 ${color}`}
        >
          <span className="text-sm">{slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      ))}
    </div>
  </div>
);

interface RecentUpdatesListProps {
  updates: DashboardFormSubmission[];
}

const RecentUpdatesList: React.FC<RecentUpdatesListProps> = ({ updates }) => (
  <div className="bg-white rounded-lg p-5 shadow-md">
    <h2 className="mb-5 text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">Nedavne posodobitve</h2>
    <div className="flex flex-col gap-2">
      {updates.map((update, index) => (
        <Link
          href={`/admin/collections/form-submissions/${update.formId}`} // Assuming formId is the correct link target
          key={index}
          className="flex justify-between items-center p-4 rounded-md bg-gray-50 no-underline text-gray-800 transition duration-300 ease-in-out hover:bg-gray-100 hover:translate-x-1"
        >
          <div>
            <h4 className="m-0 mb-1 text-base">{update.formTitle}</h4>
            <p className="m-0 text-xs text-gray-600">{update.submissionTime}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </Link>
      ))}
    </div>
  </div>
);


// Main Dashboard Component
async function Dashboard(props: AdminViewServerProps) {
  const { user, visibleEntities } = props;

  // Extract user information
  const userInfo = user as any; // Consider defining a more specific type for user
  const fullName = `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`.trim();
  const email = userInfo?.email || '';
  const roles = userInfo?.roles || [];
  const tenantInfo = userInfo?.tenants?.[0]?.tenant;
  const tenantName = tenantInfo?.name || 'Vaš Tenant'; // Fallback tenant name
  // const tenantColors = tenantInfo?.colors || {}; // Not directly used in this refactor, but available

  // Count items in collections
  const collectionsCount = visibleEntities?.collections?.length || 0;
  const globalsCount = visibleEntities?.globals?.length || 0;

  // Filter visible collections and globals based on dashboard categories
  const filterVisibleEntitiesForDashboard = (category: DashboardNavCategory) => {
    const filteredCollections = category.collectionSlugs
      ? visibleEntities?.collections?.filter(slug => category.collectionSlugs?.includes(slug)) || []
      : [];
    const filteredGlobals = category.globalSlugs
      ? visibleEntities?.globals?.filter(slug => category.globalSlugs?.includes(slug)) || []
      : [];
    return {
      collections: filteredCollections,
      globals: filteredGlobals,
      label: category.label,
      key: category.key,
      icon: category.icon,
      color: category.color || 'bg-gray-500', // Fallback color
    };
  };

  const categorizedEntities = dashboardNavCategories.map(filterVisibleEntitiesForDashboard);

  const recentUpdates = await getLatestFormSubmissions();

  // Find specific categories for stat cards
  const salesCategory = categorizedEntities.find(category => category.key === 'sales');
  const salesItemsCount = (salesCategory?.collections?.length || 0) + (salesCategory?.globals?.length || 0);
  const recentUpdatesCount = recentUpdates.length; // Count actual updates

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <DashboardHeader
        fullName={fullName}
        email={email}
        roles={roles}
        tenantName={tenantName}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Zbirke" value={collectionsCount} icon={Library} color="bg-blue-600" />
        <StatCard title="Globalni elementi" value={globalsCount} icon={Globe} color="bg-green-500" />
        <StatCard title="Nedavne posodobitve" value={recentUpdatesCount} icon={FileClock} color="bg-purple-600" />
        <StatCard title="Prodaja" value={salesItemsCount} icon={ShoppingCart} color="bg-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">
          {categorizedEntities
            .filter(category => ['content', 'structure'].includes(category.key))
            .map(category => (
              <CategoryLinks
                key={category.key}
                categoryKey={category.key}
                label={category.label}
                collections={category.collections}
                globals={category.globals}
                color={category.color}
              />
            ))}
        </div>

        <div className="flex flex-col gap-5">
          <RecentUpdatesList updates={recentUpdates} />
          {categorizedEntities
            .filter(category => ['sales', 'config'].includes(category.key))
            .map(category => (
              <CategoryLinks
                key={category.key}
                categoryKey={category.key}
                label={category.label}
                collections={category.collections}
                globals={category.globals}
                color={category.color}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;