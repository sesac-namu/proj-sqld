// src/components/Header.tsx
"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import DrawerNavigation from "@/navigations/DrawerNavigation";

interface NavLinkItem {
  href?: string;
  label: string;
  action?: () => void; // 로그아웃과 같은 액션용
  type?: "link" | "button";
  requiresAuth?: boolean; // 로그인 시에만 보일 링크
  guestOnly?: boolean; // 비로그인 시에만 보일 링크
}

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isLoggedIn, logout, user } = useAuth(); // user 정보도 가져올 수 있음

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = () => {
    logout();
    if (isDrawerOpen) toggleDrawer(); // Drawer가 열려있으면 닫기
  };

  const allNavLinks: NavLinkItem[] = [
    { href: "/quiz", label: "문제 목록", type: "link" },
    // { href: '/study-materials', label: '학습 자료', type: 'link' },
    { href: "/mypage", label: "마이페이지", type: "link", requiresAuth: true },
    { href: "/login", label: "로그인", type: "link", guestOnly: true },
    { href: "/signup", label: "회원가입", type: "link", guestOnly: true },
    {
      label: "로그아웃",
      action: handleLogout,
      type: "button",
      requiresAuth: true,
    },
  ];

  const getFilteredNavLinks = () => {
    return allNavLinks.filter((link) => {
      if (link.requiresAuth && !isLoggedIn) return false;
      if (link.guestOnly && isLoggedIn) return false;
      return true;
    });
  };

  const currentNavLinks = getFilteredNavLinks();

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight transition-colors hover:text-blue-400"
          >
            SQLD CBT {isLoggedIn && user ? `(${user.username}님)` : ""}
          </Link>

          {/* 데스크톱 네비게이션 */}
          <ul className="hidden space-x-6 md:flex">
            {currentNavLinks.map((link, index) => (
              <li key={link.label + index}>
                {link.type === "button" ? (
                  <button
                    onClick={link.action}
                    className="text-sm font-medium transition-colors hover:text-blue-300"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={link.href!}
                    className="text-sm font-medium transition-colors hover:text-blue-300"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* 모바일 햄버거 아이콘 */}
          <div className="md:hidden">
            <button
              onClick={toggleDrawer}
              aria-label="메뉴 열기"
              className="rounded-md p-2 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isDrawerOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </header>
      {/* 분리된 DrawerNavigation 컴포넌트 사용 */}
      <DrawerNavigation
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        navLinks={currentNavLinks}
        siteTitle="SQLD CBT"
      />
    </>
  );
}
