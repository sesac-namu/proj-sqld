// src/app/login/page.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // 리다이렉션을 위해
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; // useAuth 훅 임포트

export default function SigninPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();

  // 이미 로그인 상태면 다른 페이지로 리다이렉트 (예: 마이페이지 또는 홈)
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/mypage"); // 또는 '/'
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const identifier = formData.get("identifier") as string; // 타입 단언
    const password = formData.get("password") as string; // 타입 단언
    console.log("Login attempt:", { identifier, password });

    // --- 실제 API 호출 로직 (주석 처리된 예시) ---
    // try {
    //   const response = await fetch('/api/auth/login', { // 실제 API 엔드포인트로 변경
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ identifier, password }),
    //   });
    //   if (response.ok) {
    //     const data = await response.json();
    //     login({ username: data.user.username }); // API 응답에서 사용자 정보 받아와서 login 함수 호출
    //     // router.push('/mypage'); // AuthContext의 useEffect에서 처리하거나 여기서 직접 리다이렉트
    //   } else {
    //     // 로그인 실패 처리
    //     const errorData = await response.json();
    //     alert(`로그인 실패: ${errorData.message || '아이디 또는 비밀번호를 확인해주세요.'}`);
    //   }
    // } catch (error) {
    //   console.error('Login error:', error);
    //   alert('로그인 중 오류가 발생했습니다.');
    // }
    // --- API 호출 로직 끝 ---

    // 시뮬레이션: 임의의 아이디로 로그인 성공 처리
    if (identifier && password) {
      // 간단한 유효성 검사
      login({ username: identifier }); // 입력한 아이디를 username으로 사용
      // router.push('/mypage'); // AuthContext의 useEffect에서 처리하도록 변경
    } else {
      alert("아이디와 비밀번호를 입력해주세요.");
    }
  };

  // 로그인 폼 렌더링 (isLoggedIn이 false일 때만)
  if (isLoggedIn) {
    // useEffect에서 리다이렉트하므로, 로딩 상태 등을 보여줄 수 있음
    return (
      <div className="p-10 text-center">로그인 정보를 확인 중입니다...</div>
    );
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-800">
          로그인
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          또는{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            새 계정 만들기
          </Link>
        </p>
      </div>

      {/* ------------------------- */}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                ID
              </label>
              <div className="mt-2">
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  className="block w-full rounded-md border-0 px-3 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="ID"
                />
              </div>
            </div>

            {/* ------------------------- */}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 px-3 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
