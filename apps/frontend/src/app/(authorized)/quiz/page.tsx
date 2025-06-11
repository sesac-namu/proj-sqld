"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiErrorHandler, testApi, TestUI } from "@/lib/api";

export default function QuizListPage() {
  const [tests, setTests] = useState<TestUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔥 fetchTests 시작");
      const data = await testApi.getList();
      console.log("🔥 받은 시험지 데이터:", data);

      data.forEach((test) => {
        console.log(
          `테스트 ${test.id}: 완료여부=${test.isFinished}, 점수=${test.score}`,
        );
      });

      setTests(data);
    } catch (err) {
      const errorMessage = apiErrorHandler.getErrorMessage(err);
      setError(errorMessage);
      console.error("API 호출 에러:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewTest = async () => {
    setCreating(true);
    try {
      const newTestData = await testApi.create();
      console.log("생성된 시험지:", newTestData);
      alert(`새 시험지가 생성되었습니다! (ID: ${newTestData.testId})`);

      await fetchTests();
    } catch (err) {
      apiErrorHandler.showError(err);
      console.error("테스트 생성 에러:", err);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-lg text-slate-600">
          시험지 목록을 불러오는 중...
        </div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-slate-700">SQLD 문제 목록</h1>
        <button
          onClick={createNewTest}
          disabled={creating}
          className="rounded-lg bg-green-500 px-6 py-2 font-bold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating ? "생성 중..." : "새 시험지 만들기"}
        </button>
      </div>

      {/* 🔥 디버그 정보 표시 (테스트 목적) */}
      {/* <div className="mx-10 mb-4 rounded bg-yellow-100 p-4">
        <h3 className="font-bold">디버그 정보:</h3>
        <p>총 테스트 수: {tests.length}</p>
        {tests.map((test) => (
          <div key={test.id} className="text-sm">
            테스트 {test.id}: isFinished={test.isFinished.toString()}, score=
            {test.score}
          </div>
        ))}
      </div> */}

      {/* 테스트 목록 */}
      <div className="grid gap-6 p-7 md:grid-cols-2 lg:grid-cols-3">
        {tests.length > 0 ? (
          tests.map((test) => (
            <div
              key={test.id}
              className="rounded-lg border bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
            >
              <h2 className="mb-2 text-xl font-semibold text-slate-800">
                {test.title || `SQLD 시험지 #${test.id}`}
              </h2>
              {/* <p className="mb-4 text-sm text-slate-600">
                {test.description || "SQLD 자격증 시험 대비 문제입니다."}
              </p> */}
              <p className="mb-4 text-sm text-slate-600">모의고사</p>

              {/* 테스트 정보 */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  {/* <span>SQLD 문제</span> */}
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

                {/* 🔥 디버그: 상태 정보 표시 (테스트 목적) */}
                {/* <div className="text-xs text-red-500">
                  [디버그] isFinished: {test.isFinished.toString()}, score:{" "}
                  {test.score}
                </div> */}

                {/* 점수 표시 (완료된 경우만) */}
                {test.isFinished && test.score !== null && (
                  <div className="text-xs text-slate-500">
                    점수: {test.score}점
                  </div>
                )}

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

                {/* {console.log(
                  `테스트 ${test.id} 결과 버튼 표시 여부: ${test.isFinished}`,
                )} */}

                {test.isFinished && (
                  <Link
                    href={`/quiz/${test.id}/result`}
                    className="rounded-md bg-purple-500 px-3 py-2 text-sm text-white transition-colors hover:bg-purple-600"
                  >
                    시험 결과
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="mb-4 text-slate-500">아직 테스트가 없습니다.</p>
            <button
              onClick={createNewTest}
              disabled={creating}
              className="rounded-lg bg-green-500 px-6 py-2 text-white transition-colors hover:bg-green-600 disabled:opacity-50"
            >
              {creating ? "생성 중..." : "첫 번째 시험지 만들기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
