'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Icon, IconName } from '@/components/ui/Icon';

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

interface SidebarNavProps {
  items: NavItem[];
  onNavigate?: () => void;
}

export function SidebarNav({ items, onNavigate }: SidebarNavProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  return (
    <ul className="flex flex-col" style={{ listStyle: 'none', gap: '6px' }}>
      {items.map((item) => {
        const tab = item.href.includes('tab=') ? item.href.split('tab=')[1] : 'dashboard';
        const isActive = activeTab === tab;
        
        return (
          <li key={item.href}>
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
