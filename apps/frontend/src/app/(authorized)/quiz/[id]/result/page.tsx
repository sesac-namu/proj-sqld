// app/(authorized)/quiz/[id]/result/page.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { apiErrorHandler, testApi, TestResult } from "@/lib/api";

export default function QuizResultPage() {
  const params = useParams();
  const testId = params.id as string;

  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 테스트 결과 가져오기
  const fetchTestResult = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔥 테스트 결과 로딩 시작:", testId);
      const result = await testApi.getResult(testId);
      console.log("✅ 테스트 결과:", result);
      setTestResult(result);
    } catch (err) {
      console.error("❌ 테스트 결과 로딩 에러:", err);
      const errorMessage = apiErrorHandler.getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    if (testId) {
      fetchTestResult();
    }
  }, [testId, fetchTestResult]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-lg text-slate-600">
          시험지 결과를 불러오는 중...
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center">
        <div className="mb-4 text-red-500">오류: {error}</div>
        <div className="space-x-3">
          <button
            onClick={fetchTestResult}
            className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            다시 시도
          </button>
          <Link
            href="/quiz"
            className="rounded-md bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (!testResult) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center">
        <div className="mb-4 text-slate-600">시험 결과를 찾을 수 없습니다.</div>
        <Link
          href="/quiz"
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-50 border-green-200";
    if (percentage >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">
            SQLD 시험 #{testId} 결과
          </h1>
          <div className="space-x-3">
            <Link
              href={`/quiz/${testId}`}
              className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              다시 풀기
            </Link>
            <Link
              href="/quiz"
              className="rounded-md bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
            >
              목록으로..
            </Link>
          </div>
        </div>

        <div className="mt-2 text-sm text-slate-500">
          완료일:{" "}
          {testResult.test.finishedAt
            ? new Date(testResult.test.finishedAt).toLocaleString("ko-KR")
            : "알 수 없음"}
        </div>
      </div>

      {/* 결과 요약 */}
      <div
        className={`mb-8 rounded-lg border-2 p-6 ${getScoreBgColor(testResult.percentage)}`}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-700">
              {testResult.totalQuestions}
            </div>
            <div className="text-sm text-slate-600">총 문제수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {testResult.correctAnswers}
            </div>
            <div className="text-sm text-slate-600">정답수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {testResult.totalQuestions - testResult.correctAnswers}
            </div>
            <div className="text-sm text-slate-600">오답수</div>
          </div>
          <div className="text-center">
            <div
              className={`text-3xl font-bold ${getScoreColor(testResult.percentage)}`}
            >
              {testResult.percentage.toFixed(1)}%
            </div>
            <div className="text-sm text-slate-600">정답률</div>
          </div>
        </div>

        {/* 점수 */}
        <div className="mt-4 text-center">
          <div className="text-sm text-slate-600">최종 점수</div>
          <div
            className={`text-4xl font-bold ${getScoreColor(testResult.percentage)}`}
          >
            {testResult.score}점
          </div>
        </div>
      </div>

      {/* 문제별 상세 결과 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">문제별 상세 결과</h2>

        {testResult.quizResults.map((quizResult, index) => {
          const quiz = quizResult.quiz;
          const questionNumber = index + 1;

          return (
            <div
              key={quiz.id}
              className={`rounded-lg border-2 p-6 ${
                quizResult.isCorrect
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              {/* 문제 헤더 */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    문제 {questionNumber}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="rounded bg-slate-200 px-2 py-1">
                      {quiz.tags}
                    </span>
                    <span className="rounded bg-slate-200 px-2 py-1">
                      카테고리 {quiz.category}
                    </span>
                  </div>
                </div>
                <div
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    quizResult.isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {quizResult.isCorrect ? "✅ 정답" : "❌ 오답"}
                </div>
              </div>

              {/* 문제 내용 */}
              <div className="mb-4">
                <h4 className="mb-3 text-base font-medium text-slate-800">
                  {quiz.title}
                </h4>

                {/* 문제 이미지 */}
                {quiz.content_img && (
                  <div className="mb-4">
                    <img
                      src={quiz.content_img}
                      alt="문제 이미지"
                      className="mx-auto max-w-full rounded border"
                    />
                  </div>
                )}

                {/* 문제 추가 텍스트 */}
                {quiz.content_text && (
                  <div className="mb-4 rounded bg-slate-100 p-3 text-sm text-slate-700">
                    {quiz.content_text}
                  </div>
                )}
              </div>

              {/* 선택지 */}
              <div className="mb-4 space-y-2">
                {[
                  { label: "①", text: quiz.choices1 },
                  { label: "②", text: quiz.choices2 },
                  { label: "③", text: quiz.choices3 },
                  { label: "④", text: quiz.choices4 },
                ].map((choice, choiceIndex) => {
                  const choiceNumber = (choiceIndex + 1).toString();
                  const isCorrect = quizResult.correctAnswer === choiceNumber;
                  const isUserChoice = quizResult.userAnswer === choiceNumber;

                  return (
                    <div
                      key={choiceIndex}
                      className={`rounded border p-3 ${
                        isCorrect
                          ? "border-green-400 bg-green-100 font-semibold"
                          : isUserChoice
                            ? "border-red-400 bg-red-100"
                            : "border-gray-200 bg-white"
                      }`}
                    >
                      <span className="font-medium">{choice.label}</span>{" "}
                      {choice.text}
                      {isCorrect && (
                        <span className="ml-2 text-green-600">✅ 정답</span>
                      )}
                      {isUserChoice && !isCorrect && (
                        <span className="ml-2 text-red-600">❌ 내 답</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 답안 정보 */}
              <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded bg-green-100 p-3">
                  <div className="text-sm font-semibold text-green-700">
                    정답
                  </div>
                  <div className="text-green-800">
                    {quizResult.correctAnswer}번
                  </div>
                </div>
                <div className="rounded bg-slate-100 p-3">
                  <div className="text-sm font-semibold text-slate-700">
                    내 답
                  </div>
                  <div className="text-slate-800">
                    {quizResult.userAnswer
                      ? `${quizResult.userAnswer}번`
                      : "답하지 않음"}
                  </div>
                </div>
              </div>

              {/* 해설 */}
              {quizResult.explanation && (
                <div className="rounded bg-blue-50 p-4">
                  <div className="mb-2 text-sm font-semibold text-blue-700">
                    해설
                  </div>
                  <div className="text-blue-800">{quizResult.explanation}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 액션 버튼 */}
      <div className="mt-12 flex justify-center space-x-4">
        <Link
          href={`/quiz/${testId}`}
          className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
        >
          다시 풀어보기
        </Link>
        <Link
          href="/quiz"
          className="rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-600"
        >
          다른 문제 풀기
        </Link>
      </div>
    </div>
  );
}
