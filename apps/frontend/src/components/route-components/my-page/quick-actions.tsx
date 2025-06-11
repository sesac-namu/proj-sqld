import Link from "next/link";

export default function MyPageQuickAction() {
  return (
    <div className="rounded-xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
      <h3 className="mb-4 flex items-center text-lg font-bold text-gray-800">
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-600">
          <svg
            className="h-4 w-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        퀵 액션
      </h3>
      <div className="space-y-3">
        <Link
          href="/quiz"
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:from-indigo-600 hover:to-purple-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span>퀴즈 풀기</span>
        </Link>
        <button className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:from-emerald-600 hover:to-teal-700">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span>학습 통계</span>
        </button>
      </div>
    </div>
  );
}
