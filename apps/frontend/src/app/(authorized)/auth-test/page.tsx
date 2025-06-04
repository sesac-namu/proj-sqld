"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AuthTestPage() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSession = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Getting session...");
      const session = await authClient.getSession();
      console.log("Session result:", session);

      setSessionData(session);

      if (session.error) {
        setError(session.error.message || "Unknown error");
      }
    } catch (err) {
      console.error("Error getting session:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setSessionData(null);
      console.log("Signed out successfully");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">인증 테스트</h1>

      <div className="space-y-4">
        <button
          onClick={handleGetSession}
          disabled={loading}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
        >
          {loading ? "Loading..." : "세션 가져오기"}
        </button>

        <button
          onClick={handleSignOut}
          className="ml-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          로그아웃
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded border border-red-400 bg-red-100 p-4 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {sessionData && (
        <div className="mt-6">
          <h2 className="mb-2 text-xl font-semibold">세션 데이터:</h2>
          <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm">
            {JSON.stringify(sessionData, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 rounded bg-blue-50 p-4">
        <h3 className="font-semibold">디버깅 정보:</h3>
        <p>브라우저 개발자 도구의 콘솔과 네트워크 탭을 확인하세요.</p>
        <p>Application 탭에서 쿠키 상태도 확인할 수 있습니다.</p>
      </div>
    </div>
  );
}
