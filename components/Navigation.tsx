"use client";

import { Home, Settings, TreePine } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";

interface NavigationProps {
  currentPage: string;
  onNavigate?: (page: string) => void; // optional if using router internally
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname(); // current path

  const navItems = [
    { id: "wishlist", label: "My Wishes", icon: Home, path: "/wishlist" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const handleClick = (item: typeof navItems[0]) => {
    // If already on the page, do nothing
    if (pathname === item.path) return;

    if (onNavigate) {
      onNavigate(item.id);
    }
    router.push(item.path);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-green-200/50 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <TreePine className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              ØnskeTræet
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => handleClick(item)}
                  className={
                    currentPage === item.id
                      ? "gap-2 bg-gradient-to-r from-green-600 to-green-700"
                      : "gap-2"
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
