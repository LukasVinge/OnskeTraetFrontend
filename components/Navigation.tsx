"use client";

import { Home, Settings, TreePine, List } from 'lucide-react';
import { Button } from './ui/button';
import { usePathname, useRouter } from "next/navigation";

interface NavigationProps {
  currentPage: string;
  onNavigate?: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { id: 'wishlists-overview', label: 'Wishlists', icon: List, path: '/main/wishlist' },
    { id: 'wishlist', label: 'My Wishes', icon: Home, path: '/main/wishlist/current' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/main/settings' },
  ];

  type NavItem = typeof navItems[0];

  const handleClick = (item: NavItem) => {
    if (pathname === item.path) return;
    if (onNavigate) onNavigate(item.id);
    router.push(item.path);
  };

  const handleLogoClick = () => {
    // Change destination here if you want another root path
    router.push("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-green-200/50 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo (clickable) */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={handleLogoClick}
            role="button"
          >
            <div className="p-1.5 bg-gradient-to-br from-green-500 to-green-600 rounded-xl transition-transform active:scale-95">
              <TreePine className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              ØnskeTræet
            </span>
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center gap-2 cursor-pointer">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={
                    item.path === pathname || currentPage === item.id
                      ? 'default'
                      : 'ghost'
                  }
                  onClick={() => handleClick(item)}
                  className={
                    item.path === pathname || currentPage === item.id
                      ? 'gap-2 bg-gradient-to-r from-green-600 to-green-700'
                      : 'gap-2'
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden cursor-pointer sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
