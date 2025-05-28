// src/app/page.tsx

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-24 text-white">
      <div className="text-center">
        <h1 className="mb-8 animate-pulse text-5xl font-bold">SQLD CBT</h1>
        <p className="mb-12 text-xl">
          SQLD 자격증 합격을 위한 최고의 연습 플랫폼에 오신 것을 환영합니다!
        </p>
        <button className="transform rounded-lg bg-blue-500 px-6 py-3 text-lg font-bold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 hover:shadow-lg">
          학습 시작하기
        </button>
      </div>
    </main>
  );
}
