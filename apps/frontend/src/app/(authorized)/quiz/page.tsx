// src/app/quiz/page.tsx

"use client";

import Link from "next/link";

// 가상 퀴즈 데이터 (나중에 실제 데이터로 교체)
const quizzes = [
  {
    id: "sqld-2023-1",
    title: "SQLD 2023년 제 1회 기출",
    description: "최신 SQLD 기출문제로 실력을 점검하세요.",
    questionCount: 50,
  },
  {
    id: "data-modeling-basics",
    title: "데이터 모델링 기초",
    description: "데이터 모델링의 핵심 개념을 학습합니다.",
    questionCount: 20,
  },
  {
    id: "sql-select-advanced",
    title: "고급 SQL SELECT문",
    description: "다양한 SELECT문 활용법을 연습합니다.",
    questionCount: 30,
  },
];

export default function QuizListPage() {
  return (
    <div>
      <h1 className="ml-10 mt-5 text-3xl font-bold text-slate-700">
        문제 목록
      </h1>
      <div className="grid gap-6 p-7 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
          >
            <h2 className="mb-2 text-xl font-semibold text-slate-800">
              {quiz.title}
            </h2>
            <p className="mb-4 text-sm text-slate-600">{quiz.description}</p>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {quiz.questionCount} 문제
              </span>
              <Link
                href={`/quiz/${quiz.id}`}
                className="inline-block rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
              >
                풀기 시작
              </Link>
            </div>
          </div>
        ))}
      </div>
      {quizzes.length === 0 && (
        <p className="mt-10 text-center text-slate-500">
          준비된 퀴즈가 없습니다.
        </p>
      )}
    </div>
  );
}
