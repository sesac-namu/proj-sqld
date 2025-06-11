import { headers } from "next/headers";
import { serverFetch } from "@/lib/fetch";

export default async function MyPageStatistics() {
  const header = await headers();
  const [finishedTests, answerRate] = await Promise.all([
    serverFetch<number>("/api/test/stats/finished", {
      headers: header,
    }),
    serverFetch<number>("/api/test/stats/answer-rate", {
      headers: header,
    }),
  ]);

  return (
    <div className="rounded-xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
      <h3 className="mb-6 flex items-center text-lg font-bold text-gray-800">
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        학습 현황
      </h3>
      <div className="space-y-4">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {finishedTests.data || 0}회
              </div>
              <div className="text-sm font-medium text-blue-600">
                완료한 모의고사
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {(answerRate.data || 0) * 100}%
              </div>
              <div className="text-sm font-medium text-emerald-600">정답률</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <svg
                className="h-6 w-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">0일</div>
              <div className="text-sm font-medium text-purple-600">
                연속 학습
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
