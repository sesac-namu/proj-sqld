// app/(authorized)/quiz/page.tsx
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiErrorHandler, testApi } from "@/lib/api";

interface Test {
  id: string;
  title?: string;
  description?: string;
  totalQuestions?: number;
  isFinished: boolean;
  createdAt: string;
}

export default function QuizListPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // 테스트 목록 가져오기 (useCallback으로 메모이제이션)
  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await testApi.getList();

      // 🔥 데이터 구조 디버깅 - 실제 받은 데이터 확인
      console.log("받은 데이터:", data);
      console.log("데이터 타입:", typeof data);
      console.log("배열인가?:", Array.isArray(data));

      // 🔥 안전하게 배열로 변환
      let testsArray: Test[] = [];

      if (Array.isArray(data)) {
        // 데이터가 배열인 경우
        testsArray = data;
      } else if (data && typeof data === "object") {
        // 데이터가 객체인 경우 (예: { tests: [...] } 형태)
        if (data.tests && Array.isArray(data.tests)) {
          testsArray = data.tests;
        } else if (data.data && Array.isArray(data.data)) {
          testsArray = data.data;
        } else {
          // 객체를 배열로 변환 시도
          testsArray = Object.values(data).filter(
            (item) => item && typeof item === "object" && "id" in item,
          ) as Test[];
        }
      }

      console.log("최종 배열:", testsArray);
      setTests(testsArray);
    } catch (err) {
      const errorMessage = apiErrorHandler.getErrorMessage(err);
      setError(errorMessage);
      console.error("API 호출 에러:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 새 테스트 생성
  const createNewTest = async () => {
    setCreating(true);
    try {
      const newTestData = await testApi.create();
      console.log("생성된 테스트:", newTestData);
      alert("새 테스트가 생성되었습니다!");
      // 목록 새로고침
      await fetchTests();
    } catch (err) {
      apiErrorHandler.showError(err);
      console.error("테스트 생성 에러:", err);
    } finally {
      setCreating(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-lg text-slate-600">
          테스트 목록을 불러오는 중...
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center">
        <div className="mb-4 text-red-500">오류: {error}</div>
        <button
          onClick={fetchTests}
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="ml-10 mr-10 mt-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-700">문제 목록</h1>
        <button
          onClick={createNewTest}
          disabled={creating}
          className="rounded-lg bg-green-500 px-6 py-2 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating ? "생성 중..." : "새 테스트 시작"}
        </button>
      </div>

      {/* 🔥 디버깅 정보 표시 (개발 중에만) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mx-10 mb-4 rounded bg-gray-100 p-4 text-sm">
          <div>
            <strong>디버깅 정보:</strong>
          </div>
          <div>tests 타입: {typeof tests}</div>
          <div>tests 길이: {Array.isArray(tests) ? tests.length : "N/A"}</div>
          <div>배열 여부: {Array.isArray(tests) ? "Yes" : "No"}</div>
        </div>
      )}

      {/* 테스트 목록 */}
      <div className="grid gap-6 p-7 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(tests) && tests.length > 0 ? (
          tests.map((test) => (
            <div
              key={test.id}
              className="rounded-lg border bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
            >
              <h2 className="mb-2 text-xl font-semibold text-slate-800">
                {test.title || `SQLD 테스트 #${test.id}`}
              </h2>
              <p className="mb-4 text-sm text-slate-600">
                {test.description || "SQLD 자격증 시험 대비 문제입니다."}
              </p>

              {/* 테스트 정보 */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{test.totalQuestions || "??"} 문제</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      test.isFinished
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {test.isFinished ? "완료" : "진행 가능"}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  생성일:{" "}
                  {test.createdAt
                    ? new Date(test.createdAt).toLocaleDateString()
                    : "알 수 없음"}
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex gap-2">
                <Link
                  href={`/quiz/${test.id}`}
                  className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                >
                  {test.isFinished ? "다시 풀기" : "풀기 시작"}
                </Link>

                {test.isFinished && (
                  <Link
                    href={`/quiz/${test.id}/result`}
                    className="rounded-md bg-purple-500 px-3 py-2 text-sm text-white transition-colors hover:bg-purple-600"
                  >
                    결과
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          // 🔥 안전한 빈 상태 처리
          <div className="col-span-full py-12 text-center">
            <p className="mb-4 text-slate-500">
              {Array.isArray(tests)
                ? "아직 테스트가 없습니다."
                : "테스트 데이터를 불러올 수 없습니다."}
            </p>
            <button
              onClick={createNewTest}
              disabled={creating}
              className="rounded-lg bg-green-500 px-6 py-2 text-white transition-colors hover:bg-green-600 disabled:opacity-50"
            >
              {creating ? "생성 중..." : "첫 번째 테스트 만들기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
