'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: 'dashboard', label: 'Dashboard', exact: true },
    { href: '/admin/services', icon: 'services', label: 'Services' },
    { href: '/admin/locations', icon: 'location', label: 'Locations' },
    { href: '/admin/blogs', icon: 'blog', label: 'Blogs' },
    { href: '/admin/leads', icon: 'users', label: 'Leads' },
    { href: '/admin/settings', icon: 'services', label: 'Settings' },
  ];

  const isActive = (href, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Gupta Furniture" 
            className="h-10 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center text-white" style={{ backgroundColor: 'var(--primary)' }}>
              <Icon name="lightning" className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">Admin</div>
              <div className="text-xs text-gray-500">Gupta Furniture</div>
            </div>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                active
                  ? 'text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              style={active ? { backgroundColor: 'var(--primary)' } : {}}
            >
              <Icon name={item.icon} className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        <div className="my-4 border-t border-gray-200"></div>
        
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Icon name="home" className="w-5 h-5" />
          <span className="font-medium">View Site</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            window.location.href = '/admin/login';
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-200 rounded-md hover:bg-red-50 transition-colors mb-3"
        >
          <Icon name="logout" className="w-4 h-4" />
          Logout
        </button>
        <div className="text-xs text-gray-500 text-center">
          <div className="font-medium mb-1">Admin Panel v1.0</div>
          <div>© 2025 Gupta Furniture</div>
        </div>
      </div>
    </aside>
  );
}
