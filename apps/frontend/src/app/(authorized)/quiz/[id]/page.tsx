"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  apiErrorHandler,
  Quiz,
  quizApi,
  QuizListItem,
  QuizResult,
  Test,
  testApi,
} from "@/lib/api";

interface QuizData {
  title: string;
  totalQuestions: number;
  currentQuiz: Quiz | null;
  quizList: QuizListItem[];
}

export default function QuizPage() {
  const params = useParams();
  const testId = params.id as string;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const [debugInfo, setDebugInfo] = useState<string>("");

  const loadQuizData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDebugInfo("로딩 시작...");

    try {
      console.log("🔥 테스트 데이터 로딩 시작:", testId);
      setDebugInfo(`테스트 ID: ${testId} 로딩 중...`);

      console.log("1. 테스트 정보 요청 중...");
      setDebugInfo("1. 테스트 정보 요청 중...");
      const testInfo: Test = await testApi.getById(testId);
      console.log("✅ 테스트 정보:", testInfo);
      setDebugInfo(`1. 테스트 정보 완료: ${JSON.stringify(testInfo, null, 2)}`);

      console.log("2. 퀴즈 리스트 요청 중...");
      setDebugInfo("2. 퀴즈 리스트 요청 중...");
      const quizList: QuizListItem[] = await testApi.getQuizList(testId);
      console.log("✅ 퀴즈 리스트:", quizList);
      setDebugInfo(`2. 퀴즈 리스트 완료: ${JSON.stringify(quizList, null, 2)}`);

      if (!quizList || quizList.length === 0) {
        throw new Error("이 테스트에는 문제가 없습니다.");
      }

      const firstQuizItem = quizList[0];
      console.log("🔥 첫 번째 퀴즈 아이템:", firstQuizItem);
      setDebugInfo(
        `3. 첫 번째 퀴즈 아이템: ${JSON.stringify(firstQuizItem, null, 2)}`,
      );

      if (!firstQuizItem || typeof firstQuizItem.quizNumber === "undefined") {
        throw new Error("첫 번째 퀴즈 정보가 올바르지 않습니다.");
      }

      console.log("3. 첫 번째 퀴즈 상세 정보 요청 중...");
      setDebugInfo(
        `3. 퀴즈 상세 정보 요청 중... (quizNumber: ${firstQuizItem.quizNumber})`,
      );

      const firstQuiz: Quiz = await quizApi.getById(
        testId,
        firstQuizItem.quizNumber,
      );
      console.log("✅ 첫 번째 퀴즈 상세:", firstQuiz);
      setDebugInfo(
        `3. 퀴즈 상세 정보 완료: ${JSON.stringify(firstQuiz, null, 2)}`,
      );

      const finalQuizData = {
        title: testInfo.title || `SQLD 테스트 #${testId}`,
        totalQuestions: quizList.length,
        currentQuiz: firstQuiz,
        quizList: quizList,
      };

      setQuizData(finalQuizData);
      setDebugInfo(
        `✅ 모든 데이터 로딩 완료: ${JSON.stringify(finalQuizData, null, 2)}`,
      );
      console.log("✅ 퀴즈 데이터 설정 완료", finalQuizData);
    } catch (err) {
      console.error("❌ 퀴즈 데이터 로딩 에러:", err);
      const errorMessage = apiErrorHandler.getErrorMessage(err);
      setError(errorMessage);
      setDebugInfo(`❌ 에러: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [testId]);

  const loadNextQuestion = async (questionIndex: number) => {
    try {
      if (!quizData) return;

      console.log(`🔥 다음 문제 로딩: ${questionIndex}`);

      const nextQuizItem = quizData.quizList[questionIndex];
      if (!nextQuizItem) {
        throw new Error("다음 문제 정보를 찾을 수 없습니다.");
      }

      const nextQuiz: Quiz = await quizApi.getById(
        testId,
        nextQuizItem.quizNumber,
      );

      setQuizData((prev) =>
        prev
          ? {
              ...prev,
              currentQuiz: nextQuiz,
            }
          : null,
      );

      console.log("✅ 다음 문제 로딩 완료:", nextQuiz);
    } catch (err) {
      console.error("❌ 다음 문제 로딩 에러:", err);
      apiErrorHandler.showError(err);
    }
  };

  useEffect(() => {
    if (testId) {
      loadQuizData();
    }
  }, [testId, loadQuizData]);

  const handleAnswerSelect = (option: string) => {
    if (showAnswer) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !quizData?.currentQuiz) {
      alert("답을 선택해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      console.log("🔥 답안 제출:", selectedAnswer);

      await quizApi.submitAnswer(
        testId,
        quizData.currentQuiz.quizNumber,
        selectedAnswer,
      );

      const result: QuizResult = await quizApi.getResult(
        testId,
        quizData.currentQuiz.quizNumber,
      );
      setQuizResult(result);

      if (result.isCorrect) {
        setScore((prev) => prev + 1);
      }

      setShowAnswer(true);
      console.log("✅ 답안 제출 완료:", result);
    } catch (err) {
      console.error("❌ 답안 제출 에러:", err);
      apiErrorHandler.showError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    setShowAnswer(false);
    setSelectedAnswer(null);
    setQuizResult(null);

    if (currentQuestionIndex < quizData!.totalQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1;
      await loadNextQuestion(nextIndex);
      setCurrentQuestionIndex(nextIndex);
    } else {
      try {
        await testApi.finish(testId);
        setIsQuizFinished(true);
      } catch (err) {
        apiErrorHandler.showError(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center">
        <div className="mb-4 text-lg text-slate-600">퀴즈를 불러오는 중...</div>
        {/* 🔥🔥🔥 디버깅 정보 표시 */}
        <div className="w-full max-w-2xl rounded bg-gray-100 p-4 text-sm">
          <strong>디버깅 정보:</strong>
          <pre className="mt-2 whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center">
        <div className="mb-4 text-red-500">오류: {error}</div>
        {/* 🔥🔥🔥 디버깅 정보 표시 */}
        <div className="mb-4 w-full max-w-2xl rounded bg-gray-100 p-4 text-sm">
          <strong>디버깅 정보:</strong>
          <pre className="mt-2 whitespace-pre-wrap">{debugInfo}</pre>
        </div>
        <Link
          href="/quiz"
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          문제 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (!quizData || !quizData.currentQuiz) {
    return (
      <div className="mt-20 text-center">
        <p className="text-xl text-slate-600">
          퀴즈 데이터를 찾을 수 없습니다.
        </p>
        {/* 🔥🔥🔥 디버깅 정보 표시 */}
        <div className="mx-auto mt-4 w-full max-w-2xl rounded bg-gray-100 p-4 text-sm">
          <strong>디버깅 정보:</strong>
          <pre className="mt-2 whitespace-pre-wrap">{debugInfo}</pre>
          <div className="mt-4">
            <strong>quizData:</strong>
            <pre className="mt-2 whitespace-pre-wrap">
              {JSON.stringify(quizData, null, 2)}
            </pre>
          </div>
        </div>
        <Link
          href="/quiz"
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          문제 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (isQuizFinished) {
    return (
      <div className="mx-auto mt-10 max-w-lg rounded-lg bg-white p-8 text-center shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-700">퀴즈 완료!</h2>
        <p className="mb-4 text-xl">
          총 <span className="font-semibold">{quizData.totalQuestions}</span>
          문제 중<span className="font-semibold text-green-600"> {score}</span>
          문제를 맞혔습니다.
        </p>
        <p className="mb-8 text-lg">
          정답률:{" "}
          <span className="font-semibold">
            {((score / quizData.totalQuestions) * 100).toFixed(1)}%
          </span>
        </p>
        <div className="space-y-3">
          <Link
            href={`/quiz/${testId}/result`}
            className="block rounded-md bg-purple-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-purple-600"
          >
            상세 결과 보기
          </Link>
          <Link
            href="/quiz"
            className="block rounded-md bg-blue-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
          >
            다른 퀴즈 풀기
          </Link>
        </div>
      </div>
    );
  }

  const currentQuiz = quizData.currentQuiz;

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-6 shadow-xl md:p-8">
      {/* 🔥🔥🔥 개발 중에만 디버깅 정보 표시 */}
      <div className="mb-4 rounded border border-yellow-200 bg-yellow-50 p-4 text-sm">
        <strong>디버깅 정보:</strong>
        <div className="mt-2">
          <div>
            <strong>testId:</strong> {testId}
          </div>
          <div>
            <strong>currentQuiz:</strong> {currentQuiz ? "있음" : "없음"}
          </div>
          <div>
            <strong>question:</strong> {currentQuiz?.question || "없음"}
          </div>
          <div>
            <strong>options:</strong>{" "}
            {currentQuiz?.options
              ? JSON.stringify(currentQuiz.options)
              : "없음"}
          </div>
          <div>
            <strong>multiple:</strong>{" "}
            {currentQuiz?.multiple ? "다중선택" : "단일선택"}
          </div>
        </div>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-slate-700">
        {quizData.title}
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        문제 {currentQuestionIndex + 1} / {quizData.totalQuestions}
        {currentQuiz?.multiple && (
          <span className="ml-2 text-red-500">(다중 선택)</span>
        )}
      </p>

      {/* 진행 바 */}
      <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-500 transition-all duration-300"
          style={{
            width: `${((currentQuestionIndex + 1) / quizData.totalQuestions) * 100}%`,
          }}
        ></div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold leading-relaxed text-slate-800">
          Q. {currentQuiz.question || "문제를 불러올 수 없습니다."}
        </h2>

        {/* 객관식 문제 */}
        {currentQuiz.options && currentQuiz.options.length > 0 && (
          <div className="space-y-3">
            {currentQuiz.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option.charAt(0))}
                disabled={showAnswer}
                className={`block w-full rounded-md border p-3 text-left transition-all ${
                  selectedAnswer === option.charAt(0)
                    ? "border-blue-400 bg-blue-100 ring-2 ring-blue-300"
                    : "border-slate-300 bg-white hover:bg-slate-50"
                } ${
                  showAnswer && quizResult?.correctAnswer === option.charAt(0)
                    ? "border-green-500 bg-green-100 font-semibold text-green-700"
                    : ""
                } ${
                  showAnswer &&
                  selectedAnswer === option.charAt(0) &&
                  !quizResult?.isCorrect
                    ? "border-red-500 bg-red-100 text-red-700"
                    : ""
                } ${showAnswer ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* 주관식 문제 */}
        {(!currentQuiz.options || currentQuiz.options.length === 0) && (
          <textarea
            value={selectedAnswer || ""}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            disabled={showAnswer}
            placeholder="답안을 입력해주세요..."
            className="w-full rounded-lg border p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            rows={4}
          />
        )}
      </div>

      {/* 정답 및 해설 */}
      {showAnswer && quizResult && (
        <div className="mb-6 rounded-md border border-sky-200 bg-sky-50 p-4">
          <h3 className="font-semibold text-sky-700">정답 및 해설</h3>
          <p className="mt-1 text-sm text-sky-600">
            <strong>정답:</strong> {quizResult.correctAnswer}
          </p>
          <p className="mt-1 text-sm text-sky-600">
            <strong>내 답:</strong> {quizResult.userAnswer}
          </p>
          {quizResult.explanation && (
            <p className="mt-1 text-sm text-sky-600">
              <strong>해설:</strong> {quizResult.explanation}
            </p>
          )}
          <p
            className={`mt-2 font-semibold ${quizResult.isCorrect ? "text-green-600" : "text-red-600"}`}
          >
            {quizResult.isCorrect ? "✅ 정답입니다!" : "❌ 틀렸습니다."}
          </p>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="mt-8 flex items-center justify-between">
        <Link
          href="/quiz"
          className="rounded-md bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
        >
          목록으로
        </Link>

        <button
          onClick={showAnswer ? handleNextQuestion : handleSubmitAnswer}
          className="rounded-md bg-green-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={(!selectedAnswer && !showAnswer) || submitting}
        >
          {submitting
            ? "제출 중..."
            : showAnswer
              ? currentQuestionIndex === quizData.totalQuestions - 1
                ? "결과 보기"
                : "다음 문제"
              : "정답 확인"}
        </button>
      </div>
    </div>
  );
}
