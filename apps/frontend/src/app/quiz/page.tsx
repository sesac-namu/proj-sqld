// src/app/quiz/page.tsx

'use client'; // 상태 관리를 위해 클라이언트 컴포넌트

import Link from 'next/link';

// 가상 퀴즈 데이터 (나중에 실제 데이터로 교체)
const quizzes = [
  {
    id: 'sqld-2023-1',
    title: 'SQLD 2023년 제 1회 기출',
    description: '최신 SQLD 기출문제로 실력을 점검하세요.',
    questionCount: 50,
  },
  {
    id: 'data-modeling-basics',
    title: '데이터 모델링 기초',
    description: '데이터 모델링의 핵심 개념을 학습합니다.',
    questionCount: 20,
  },
  {
    id: 'sql-select-advanced',
    title: '고급 SQL SELECT문',
    description: '다양한 SELECT문 활용법을 연습합니다.',
    questionCount: 30,
  },
];

export default function QuizListPage() {
  return (
    <div>
      <h1 className='text-3xl font-bold text-slate-700 mb-8 mt-5'>문제 목록</h1>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className='bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow'
          >
            <h2 className='text-xl font-semibold text-slate-800 mb-2'>{quiz.title}</h2>
            <p className='text-sm text-slate-600 mb-4'>{quiz.description}</p>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-xs text-slate-500'>{quiz.questionCount} 문제</span>
              <Link
                href={`/quiz/${quiz.id}`}
                className='inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors'
              >
                풀기 시작
              </Link>
            </div>
          </div>
        ))}
      </div>
      {quizzes.length === 0 && (
        <p className='text-center text-slate-500 mt-10'>준비된 퀴즈가 없습니다.</p>
      )}
    </div>
  );
}
