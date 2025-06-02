// src/navigations/DrawerNavigation.tsx
"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface NavLinkItem {
  href?: string;
  label: string;
  action?: () => void;
  type?: "link" | "button";
  requiresAuth?: boolean;
  guestOnly?: boolean;
}

interface DrawerNavigationProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  navLinks: NavLinkItem[];
  siteTitle?: string;
}

export default function DrawerNavigation({
  isOpen,
  toggleDrawer,
  navLinks,
  siteTitle = "SQLD CBT",
}: DrawerNavigationProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={toggleDrawer}
        aria-hidden="true"
      />
      <div className="fixed right-0 top-0 h-full w-64 bg-slate-800 p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-white"
            onClick={toggleDrawer}
          >
            {siteTitle}
          </Link>
          <button
            onClick={toggleDrawer}
            aria-label="메뉴 닫기"
            className="rounded-md p-1 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav>
          <ul className="space-y-4">
            {navLinks.map((link, index) => (
              <li key={`drawer-${link.label}-${index}`}>
                {link.type === "button" ? (
                  <button
                    onClick={() => {
                      if (link.action) link.action();
                      toggleDrawer(); // 액션 후 드로어 닫기
                    }}
                    className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={link.href!}
                    className="block rounded-md px-3 py-2 text-base font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
                    onClick={toggleDrawer} // 링크 클릭 시 드로어 닫기
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
