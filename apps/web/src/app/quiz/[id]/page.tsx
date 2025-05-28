// src/app/quiz/[id]/page.tsx
"use client"; // 상태 관리를 위해 클라이언트 컴포넌트

import { useParams } from "next/navigation"; // 클라이언트 컴포넌트에서 파라미터 가져오기
import { useState, useEffect } from "react";
import Link from "next/link";

// 가상 문제 데이터 (실제로는 id에 따라 동적으로 가져와야 함)
const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "데이터베이스의 3단계 스키마 구조에 해당하지 않는 것은?",
    options: ["외부 스키마", "개념 스키마", "내부 스키마", "물리적 스키마"],
    answer: "물리적 스키마",
    explanation:
      "데이터베이스의 3단계 스키마는 외부, 개념, 내부 스키마로 구성됩니다. 물리적 스키마는 내부 스키마의 구현과 관련된 하위 레벨입니다.",
  },
  {
    id: 2,
    question: "다음 중 DDL(Data Definition Language)에 해당하는 명령어는?",
    options: ["SELECT", "INSERT", "CREATE", "UPDATE"],
    answer: "CREATE",
    explanation:
      "CREATE, ALTER, DROP 등은 테이블 구조나 제약조건을 정의하는 DDL 명령어입니다.",
  },
  // ... 더 많은 문제들
];

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface QuizData {
  title: string;
  questions: Question[];
}

// 가상 퀴즈 세트 데이터 (id에 따라 다른 데이터를 반환하도록 할 수 있음)
const getQuizDataById = (id: string): QuizData | null => {
  if (id === "sqld-2023-1") {
    return {
      title: "SQLD 2023년 제 1회 기출",
      questions: MOCK_QUESTIONS.slice(0, 2), // 예시로 2문제만 사용
    };
  }
  if (id === "data-modeling-basics") {
    return {
      title: "데이터 모델링 기초",
      questions: MOCK_QUESTIONS.slice(1, 2).concat(MOCK_QUESTIONS.slice(0, 1)), // 순서 변경 예시
    };
  }
  return null;
};

export default function QuizPage() {
  const params = useParams();
  const quizId = params.id as string; // params.id는 string | string[] 일 수 있으므로 타입 단언

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  useEffect(() => {
    if (quizId) {
      const data = getQuizDataById(quizId);
      setQuizData(data);
    }
  }, [quizId]);

  if (!quizData) {
    return (
      <div className="mt-20 text-center">
        <p className="text-xl text-slate-600">퀴즈를 불러오는 중...</p>
        <p className="mt-2 text-sm text-slate-400">
          또는 해당 ID의 퀴즈를 찾을 수 없습니다.
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

  const handleAnswerSelect = (option: string) => {
    if (showAnswer) return; // 이미 정답을 확인했으면 선택 변경 불가
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      alert("답을 선택해주세요.");
      return;
    }
    setShowAnswer(true);
    if (selectedAnswer === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizFinished(true);
    }
  };

  if (isQuizFinished) {
    return (
      <div className="mx-auto mt-10 max-w-lg rounded-lg bg-white p-8 text-center shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-700">퀴즈 완료!</h2>
        <p className="mb-4 text-xl">
          총 <span className="font-semibold">{quizData.questions.length}</span>
          문제 중<span className="font-semibold text-green-600"> {score}</span>
          문제를 맞혔습니다.
        </p>
        <p className="mb-8 text-lg">
          정답률:{" "}
          <span className="font-semibold">
            {((score / quizData.questions.length) * 100).toFixed(1)}%
          </span>
        </p>
        <Link
          href="/quiz"
          className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
        >
          다른 퀴즈 풀기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-6 shadow-xl md:p-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-700">
        {quizData.title}
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        문제 {currentQuestionIndex + 1} / {quizData.questions.length}
      </p>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold leading-relaxed text-slate-800">
          Q. {currentQuestion.question}
        </h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={showAnswer}
              className={`block w-full rounded-md border p-3 text-left transition-all ${
                selectedAnswer === option
                  ? "border-blue-400 bg-blue-100 ring-2 ring-blue-300"
                  : "border-slate-300 bg-white hover:bg-slate-50"
              } ${
                showAnswer && option === currentQuestion.answer
                  ? "border-green-500 bg-green-100 font-semibold text-green-700"
                  : ""
              } ${
                showAnswer &&
                selectedAnswer === option &&
                option !== currentQuestion.answer
                  ? "border-red-500 bg-red-100 text-red-700"
                  : ""
              } ${showAnswer ? "cursor-not-allowed" : "cursor-pointer"} `}
            >
              {index + 1}. {option}
            </button>
          ))}
        </div>
      </div>

      {showAnswer && (
        <div className="mb-6 rounded-md border border-sky-200 bg-sky-50 p-4">
          <h3 className="font-semibold text-sky-700">정답 및 해설</h3>
          <p className="mt-1 text-sm text-sky-600">
            <strong>정답:</strong> {currentQuestion.answer}
          </p>
          <p className="mt-1 text-sm text-sky-600">
            <strong>해설:</strong> {currentQuestion.explanation}
          </p>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={showAnswer ? handleNextQuestion : handleSubmitAnswer}
          className="rounded-md bg-green-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-600 disabled:bg-slate-300"
          disabled={!selectedAnswer && !showAnswer}
        >
          {showAnswer
            ? currentQuestionIndex === quizData.questions.length - 1
              ? "결과 보기"
              : "다음 문제"
            : "정답 확인"}
        </button>
        {/* 이전 문제 버튼은 필요시 추가 */}
      </div>
    </div>
  );
}
