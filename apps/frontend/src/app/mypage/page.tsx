// src/app/mypage/page.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 가상 사용자 데이터 (실제로는 AuthContext의 user 사용)
// const userData = {
//   username: 'sqld_master',
//   email: 'user@example.com',
//   solvedQuizzes: 15,
//   correctRate: 75.5,
// };

export default function MyPage() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/mypage'); // 로그인 후 돌아올 경로 전달 (선택 사항)

    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    // useEffect에서 리다이렉션이 일어나기 전까지 보여줄 내용
    return (
      <div className='text-center mt-20'>
        <p className='text-xl text-slate-600'>접근 권한이 없습니다. 로그인이 필요합니다.</p>
        <Link href='/login' className='mt-4 inline-block text-blue-500 hover:underline'>
          로그인 페이지로 이동
        </Link>
      </div>
    );
  }

  // ---------------------------------------------------------
  // 로그인된 사용자 정보 표시
  return (
    <div className='max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md'>
      <h1 className='text-3xl font-bold text-slate-700 mb-8'>마이페이지</h1>

      <div className='space-y-6'>
        <div>
          <h2 className='text-xl font-semibold text-slate-600'>기본 정보</h2>
          <div className='mt-2 p-4 bg-slate-50 rounded-md'>
            <p>
              <span className='font-medium'>아이디:</span> {user.username}
            </p>
            {/* <p><span className="font-medium">이메일:</span> {userData.email}</p> */}
          </div>
        </div>

        {/* <div>
          <h2 className="text-xl font-semibold text-slate-600">학습 통계</h2>
          <div className="mt-2 p-4 bg-slate-50 rounded-md">
            <p><span className="font-medium">푼 문제 수:</span> {userData.solvedQuizzes}개</p>
            <p><span className="font-medium">평균 정답률:</span> {userData.correctRate}%</p>
          </div>
        </div> */}

        <div className='mt-8 flex space-x-4'>
          <button className='py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
            정보 수정 (미구현)
          </button>
          {/* <button
            className="py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            비밀번호 변경 (미구현)
          </button> */}
        </div>
      </div>
    </div>
  );
}
