import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ko } from "date-fns/locale";
import { headers } from "next/headers";
import { serverFetch } from "@/lib/fetch";

interface TestResult {
  testId: number;
  finishedAt: string;
  answerCount: number;
  correctCount: number;
  score: number;
}

interface WeeklyData {
  data: {
    items: TestResult[];
  };
}

interface MonthlyData {
  data: {
    items: TestResult[];
  };
}

export default async function StatisticsPage() {
  const header = await headers();

  const [finishedTests, answerRate, weeklyData, monthlyData] =
    await Promise.all([
      serverFetch<number>("/api/stats/finished", { headers: header }),
      serverFetch<number>("/api/stats/answer-rate", { headers: header }),
      serverFetch<WeeklyData>("/api/stats/weekly", { headers: header }),
      serverFetch<MonthlyData>("/api/stats/monthly", { headers: header }),
    ]);

  // 이번 주 날짜 범위 계산
  const currentDate = new Date();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // 월요일 시작
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // 이번 달 날짜 범위 계산
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // 주간 통계 계산
  const weeklyTests = weeklyData?.data?.data.items || [];
  const weeklyAvgScore =
    weeklyTests.length > 0
      ? Math.round(
          weeklyTests.reduce((sum, test) => sum + test.score, 0) /
            weeklyTests.length,
        )
      : 0;

  // 월간 통계 계산
  const monthlyTests = monthlyData?.data?.data.items || [];
  const monthlyAvgScore =
    monthlyTests.length > 0
      ? Math.round(
          monthlyTests.reduce((sum, test) => sum + test.score, 0) /
            monthlyTests.length,
        )
      : 0;

  // 일별 학습 데이터 (이번 주)
  const dailyProgress = weekDays.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayTests = weeklyTests.filter(
      (test) => format(new Date(test.finishedAt), "yyyy-MM-dd") === dayStr,
    );
    return {
      date: day,
      count: dayTests.length,
      avgScore:
        dayTests.length > 0
          ? Math.round(
              dayTests.reduce((sum, test) => sum + test.score, 0) /
                dayTests.length,
            )
          : 0,
    };
  });

  // 연속 학습일 계산
  let consecutiveDays = 0;
  const today = format(new Date(), "yyyy-MM-dd");
  const allTests = [...weeklyTests, ...monthlyTests];
  const uniqueDates = [
    ...new Set(
      allTests.map((test) => format(new Date(test.finishedAt), "yyyy-MM-dd")),
    ),
  ].sort();

  for (let i = uniqueDates.length - 1; i >= 0; i--) {
    const expectedDate = format(
      new Date(Date.now() - (uniqueDates.length - 1 - i) * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd",
    );
    if (uniqueDates[i] === expectedDate) {
      consecutiveDays++;
    } else {
      break;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            📊 학습 통계
          </h1>
          <p className="text-gray-600">
            당신의 모의고사 학습 현황을 한눈에 확인하세요
          </p>
        </div>

        {/* 주요 통계 카드 */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* 완료한 모의고사 */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {finishedTests.data || 0}
                </div>
                <div className="mt-1 text-sm font-medium text-blue-600">
                  완료한 모의고사
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                <svg
                  className="h-7 w-7 text-blue-600"
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

          {/* 전체 정답률 */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-emerald-600">
                  {answerRate.data || 0}%
                </div>
                <div className="mt-1 text-sm font-medium text-emerald-600">
                  전체 정답률
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100">
                <svg
                  className="h-7 w-7 text-emerald-600"
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

          {/* 이번 주 평균 점수 */}
          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {weeklyAvgScore}점
                </div>
                <div className="mt-1 text-sm font-medium text-purple-600">
                  이번 주 평균
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100">
                <svg
                  className="h-7 w-7 text-purple-600"
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
            </div>
          </div>

          {/* 연속 학습일 */}
          <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-red-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {consecutiveDays}일
                </div>
                <div className="mt-1 text-sm font-medium text-orange-600">
                  연속 학습
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100">
                <svg
                  className="h-7 w-7 text-orange-600"
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* 이번 주 학습 현황 */}
          <div className="rounded-xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
            <h3 className="mb-6 flex items-center text-lg font-bold text-gray-800">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              이번 주 학습 현황
            </h3>

            <div className="space-y-3">
              {dailyProgress.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="min-w-[60px] text-sm font-medium text-gray-600">
                      {format(day.date, "EEE", { locale: ko })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(day.date, "MM/dd")}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      {day.count}회 완료
                    </div>
                    {day.count > 0 && (
                      <div className="text-sm font-semibold text-blue-600">
                        평균 {day.avgScore}점
                      </div>
                    )}
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, day.count) }).map(
                        (_, i) => (
                          <div
                            key={i}
                            className="h-2 w-2 rounded-full bg-blue-400"
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {weeklyTests.length > 0 && (
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <h4 className="mb-2 text-sm font-medium text-blue-800">
                  이번 주 요약
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">총 모의고사:</span>
                    <span className="ml-2 font-semibold">
                      {weeklyTests.length}회
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-600">평균 점수:</span>
                    <span className="ml-2 font-semibold">
                      {weeklyAvgScore}점
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 월간 성과 */}
          <div className="rounded-xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
            <h3 className="mb-6 flex items-center text-lg font-bold text-gray-800">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600">
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
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              이번 달 성과
            </h3>

            {monthlyTests.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-emerald-50 p-4">
                    <div className="text-2xl font-bold text-emerald-600">
                      {monthlyTests.length}
                    </div>
                    <div className="text-sm text-emerald-600">
                      완료한 모의고사
                    </div>
                  </div>
                  <div className="rounded-lg bg-teal-50 p-4">
                    <div className="text-2xl font-bold text-teal-600">
                      {monthlyAvgScore}점
                    </div>
                    <div className="text-sm text-teal-600">평균 점수</div>
                  </div>
                </div>

                {/* 최근 시험 결과 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    최근 시험 결과
                  </h4>
                  <div className="max-h-40 space-y-2 overflow-y-auto">
                    {monthlyTests
                      .sort(
                        (a, b) =>
                          new Date(b.finishedAt).getTime() -
                          new Date(a.finishedAt).getTime(),
                      )
                      .slice(0, 5)
                      .map((test, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded bg-gray-50 p-2"
                        >
                          <div className="text-sm text-gray-600">
                            {format(new Date(test.finishedAt), "MM/dd HH:mm")}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {test.score}점
                            </span>
                            <div
                              className={`h-2 w-2 rounded-full ${
                                test.score >= 80
                                  ? "bg-green-400"
                                  : test.score >= 60
                                    ? "bg-yellow-400"
                                    : "bg-red-400"
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="mb-2 text-gray-400">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  이번 달 완료한 모의고사가 없습니다
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  첫 모의고사를 시작해보세요!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 학습 팁 */}
        <div className="mt-8 rounded-xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
          <h3 className="mb-4 flex items-center text-lg font-bold text-gray-800">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600">
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            학습 팁
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-yellow-50 p-4">
              <h4 className="mb-2 font-medium text-yellow-800">꾸준한 학습</h4>
              <p className="text-sm text-yellow-700">
                매일 조금씩이라도 꾸준히 학습하는 것이 중요합니다.
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="mb-2 font-medium text-blue-800">복습의 중요성</h4>
              <p className="text-sm text-blue-700">
                틀린 문제는 반드시 다시 풀어보고 이해해야 합니다.
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <h4 className="mb-2 font-medium text-green-800">목표 설정</h4>
              <p className="text-sm text-green-700">
                명확한 목표를 설정하고 단계적으로 달성해나가세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
