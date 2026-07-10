'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Icon, IconName } from '@/components/ui/Icon';

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  // Optional path prefix that, when matched, marks this item as active
  activePrefix?: string;
}

interface SidebarNavProps {
  items: NavItem[];
  onNavigate?: () => void;
}

export function SidebarNav({ items, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab');

  function isItemActive(item: NavItem): boolean {
    // 1. Items with an activePrefix match by EITHER:
    //    a) pathname prefix — e.g. /dashboard/products/[id]/edit
    //    b) the ?tab= query param — e.g. /dashboard?tab=products (the list view)
    if (item.activePrefix) {
      if (pathname.startsWith(item.activePrefix)) return true;
      if (item.href.includes('tab=')) {
        const tab = item.href.split('tab=')[1];
        return activeTab === tab;
      }
      return false;
    }

    // 2. Tab-only items (no prefix) match purely on ?tab=.
    if (item.href.includes('tab=')) {
      const tab = item.href.split('tab=')[1];
      return activeTab === tab;
    }

    // 3. Dashboard home: active only on exact /dashboard with no tab.
    return pathname === '/dashboard' && !activeTab;
  }

  return (
    <ul className="flex flex-col" style={{ listStyle: 'none', gap: '6px' }}>
      {items.map((item) => {
        const isActive = isItemActive(item);

        return (
          <li key={item.label}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
