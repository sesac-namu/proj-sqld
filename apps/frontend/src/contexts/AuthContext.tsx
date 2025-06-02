// src/contexts/AuthContext.tsx
"use client";

// Context는 클라이언트 사이드에서 상태를 다루므로 'use client'
import { useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  user: { username: string } | null; // 간단한 사용자 정보 (확장 가능)
  login: (userData: { username: string }) => void; // 로그인 시 사용자 정보 저장
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();

  // 애플리케이션 시작 시 로컬 스토리지 등에서 로그인 상태 복원 (선택 사항)
  useEffect(() => {
    // 예시: localStorage에 'userToken'이 있으면 로그인 상태로 간주
    // const token = localStorage.getItem('userToken');
    // const storedUser = localStorage.getItem('userData');
    // if (token && storedUser) {
    //   setIsLoggedIn(true);
    //   setUser(JSON.parse(storedUser));
    // }
    // 실제 구현 시에는 더 안전한 방법 (httpOnly 쿠키, 서버 세션 등) 고려
  }, []);

  const login = (userData: { username: string }) => {
    setIsLoggedIn(true);
    setUser(userData);
    // 예시: localStorage.setItem('userToken', 'dummy_token');
    // localStorage.setItem('userData', JSON.stringify(userData));
    console.log(`${userData.username}님 로그인 성공 (Context)`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    // 예시: localStorage.removeItem('userToken');
    // localStorage.removeItem('userData');
    console.log("로그아웃 (Context)");
    router.push("/"); // 로그아웃 후 홈으로 이동
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
