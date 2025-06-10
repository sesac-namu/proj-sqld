// app/(authorized)/quiz/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { apiErrorHandler, quizApi, testApi } from "@/lib/api";

interface Quiz {
  id: number;
  quizNumber: number;
  question: string;
  options?: string[];
  questionType: string;
}

interface QuizData {
  title: string;
  totalQuestions: number;
  questions: Quiz[];
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
  const [quizResult, setQuizResult] = useState<any>(null);

  // 테스트 데이터 로드 (useCallback으로 메모이제이션)
  const loadQuizData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. 테스트 정보 가져오기
      const testInfo = await testApi.getById(testId);

      // 2. 퀴즈 리스트 가져오기
      const quizList = await testApi.getQuizList(testId);

      if (!quizList || quizList.length === 0) {
        throw new Error("이 테스트에는 문제가 없습니다.");
      }

      // 3. 각 퀴즈 상세 정보 가져오기 (첫 번째 문제만 먼저)
      const firstQuiz = await quizApi.getById(
        testId,
        quizList[0].quizNumber || 1,
      );

      setQuizData({
        title: testInfo.title || `SQLD 테스트 #${testId}`,
        totalQuestions: quizList.length,
        questions: [{ ...firstQuiz, quizNumber: quizList[0].quizNumber || 1 }],
      });
    } catch (err) {
      const errorMessage = apiErrorHandler.getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [testId]);

  // 다음 문제 로드
  const loadNextQuestion = async (questionIndex: number) => {
    try {
      if (!quizData) return;

      const quizList = await testApi.getQuizList(testId);
      const nextQuizNumber = quizList[questionIndex].quizNumber;
      const nextQuiz = await quizApi.getById(testId, nextQuizNumber);

      setQuizData((prev: QuizData | null) => ({
        ...prev!,
        questions: [
          ...prev!.questions,
          { ...nextQuiz, quizNumber: nextQuizNumber },
        ],
      }));
    } catch (err) {
      apiErrorHandler.showError(err);
    }
  };

  useEffect(() => {
    if (testId) {
      loadQuizData();
    }
  }, [testId, loadQuizData]);

  // 답안 선택
  const handleAnswerSelect = (option: string) => {
    if (showAnswer) return;
    setSelectedAnswer(option);
  };

  // 답안 제출
  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !quizData) {
      alert("답을 선택해주세요.");
      return;
    }

    const currentQuestion = quizData.questions[currentQuestionIndex];
    if (!currentQuestion) {
      alert("문제를 불러올 수 없습니다.");
      return;
    }

    setSubmitting(true);
    try {
      // 답안 제출
      await quizApi.submitAnswer(
        testId,
        currentQuestion.quizNumber,
        selectedAnswer,
      );

      // 퀴즈 결과 가져오기 (정답, 해설 등)
      const result = await quizApi.getResult(
        testId,
        currentQuestion.quizNumber,
      );
      setQuizResult(result);

      // 정답 확인
      if (result.isCorrect) {
        setScore(score + 1);
      }

      setShowAnswer(true);
    } catch (err) {
      apiErrorHandler.showError(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 다음 문제로
  const handleNextQuestion = async () => {
    setShowAnswer(false);
    setSelectedAnswer(null);
    setQuizResult(null);

    if (currentQuestionIndex < quizData!.totalQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1;

      // 다음 문제 데이터가 없으면 로드
      if (!quizData!.questions[nextIndex]) {
        await loadNextQuestion(nextIndex);
      }

      setCurrentQuestionIndex(nextIndex);
    } else {
      // 테스트 완료 처리
      try {
        await testApi.finish(testId);
        setIsQuizFinished(true);
      } catch (err) {
        apiErrorHandler.showError(err);
      }
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-lg text-slate-600">퀴즈를 불러오는 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center">
        <div className="mb-4 text-red-500">오류: {error}</div>
        <Link
          href="/quiz"
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          문제 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="mt-20 text-center">
        <p className="text-xl text-slate-600">
          퀴즈 데이터를 찾을 수 없습니다.
        </p>
        <Link
          href="/quiz"
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          문제 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  // currentQuestion이 undefined인 경우 처리
  if (!currentQuestion) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center">
        <div className="mb-4 text-red-500">문제를 불러올 수 없습니다.</div>
        <Link
          href="/quiz"
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          문제 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  // 퀴즈 완료 화면
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

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-6 shadow-xl md:p-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-700">
        {quizData.title}
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        문제 {currentQuestionIndex + 1} / {quizData.totalQuestions}
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
          Q. {currentQuestion.question}
        </h2>

        {/* 객관식 문제 */}
        {currentQuestion.options && currentQuestion.options.length > 0 && (
          <div className="space-y-3">
            {currentQuestion.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option.charAt(0))} // A, B, C, D
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
        {(!currentQuestion.options || currentQuestion.options.length === 0) && (
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
