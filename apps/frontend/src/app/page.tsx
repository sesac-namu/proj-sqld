// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      className='flex min-h-screen flex-col items-center justify-center 
                  p-24 bg-gradient-to-br from-slate-900 to-slate-700 text-white'
    >
      <div className='text-center'>
        <h1 className='text-5xl font-bold mb-8'>SQLD CBT</h1>
        <p className='text-xl mb-12'>
          SQLD 자격증 합격을 위한 최고의 연습 플랫폼에 오신 것을 환영합니다!
        </p>
        <Link href='/quiz'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white 
                        font-bold py-3 px-6 rounded-lg text-lg shadow-md 
                        hover:shadow-lg transition duration-300 ease-in-out 
                        transform hover:scale-105 animate-pulse'
          >
            학습 바로가기
          </button>
        </Link>
      </div>
    </main>
  );
}
