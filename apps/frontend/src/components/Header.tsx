// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext"; // useAuth 훅 임포트

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

      {/* 모바일 Drawer 네비게이션 */}
      {isDrawerOpen && (
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
                SQLD CBT
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
                {currentNavLinks.map((link, index) => (
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
      )}
    </>
  );
}
