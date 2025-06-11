"use client";

import { useState } from "react";

export default function TestPage() {
  // 상태들
  const [user, setUser] = useState(null);
  const [tests, setTests] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isFinished, setIsFinished] = useState(null);
  const [quizList, setQuizList] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [testId, setTestId] = useState("");
  const [quizNumber, setQuizNumber] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥🔥🔥🔥🔥 사용자 정보 가져오기
  const handleGetUser = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/me");
      const userData = await response.json();
      setUser(userData);
      alert("사용자 정보를 가져왔습니다!");
    } catch (error) {
      alert("사용자 정보 가져오기 실패");
      console.log("에러:", error);
    }
    setLoading(false);
  };

  // 🔥🔥🔥🔥🔥 테스트 목록 가져오기
  const handleGetTests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test");
      const testsData = await response.json();
      setTests(testsData);
      alert("테스트 목록을 가져왔습니다!");
    } catch (error) {
      alert("테스트 목록 가져오기 실패");
      console.log("에러:", error);
    }
    setLoading(false);
  };

  // 🔥🔥🔥🔥🔥 새 테스트 만들기
  const handleCreateTest = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test/create", { method: "POST" });
      const newTest = await response.json();
      alert("새 테스트가 만들어졌습니다!");
      console.log("새 테스트:", newTest);
      handleGetTests(); // 목록 새로고침
    } catch (error) {
      alert("새 테스트 만들기 실패");
      console.log("에러:", error);
    }
    setLoading(false);
  };

  // 🔥🔥🔥🔥🔥 특정 테스트 정보 가져오기 (GET /api/test/[testId])
  const handleGetSpecificTest = async () => {
    if (!testId) {
      alert("테스트 ID를 입력해주세요!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/test/${testId}`);
      const testData = await response.json();
      setSelectedTest(testData);
      alert(`테스트 ${testId} 정보를 가져왔습니다!`);
    } catch (error) {
      alert("테스트 정보 가져오기 실패");
      console.log("에러:", error);
    }
    setLoading(false);
  };

  // 🔥🔥🔥🔥🔥 테스트 완료 여부 확인 (GET /api/test/[testId]/is-finished)
  const handleCheckIsFinished = async () => {
    if (!testId) {
      alert("테스트 ID를 입력해주세요!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/test/${testId}/is-finished`);
      const result = await response.json();
      setIsFinished(result);
      alert(`테스트 완료 여부를 확인했습니다!`);
    } catch (error) {
      alert("테스트 완료 여부 확인 실패");
      console.log("에러:", error);
    }
    setLoading(false);
  };

  // 🔥🔥🔥🔥🔥 퀴즈 리스트 가져오기 (GET /api/test/[testId]/quiz-list)
  const handleGetQuizList = async () => {
    if (!testId) {
      alert("테스트 ID를 입력해주세요!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/test/${testId}/quiz-list`);
      const result = await response.json();
      setQuizList(result);
      alert(`퀴즈 리스트를 가져왔습니다!`);
    } catch (error) {
      alert("퀴즈 리스트 가져오기 실패");
      console.log("에러:", error);
    }
    setLoading(false);
  };

  // 🔥🔥🔥🔥🔥 테스트 결과 가져오기 (GET /api/test/[testId]/result)
  const handleGetTestResult = async () => {
    if (!testId) {
      alert("테스트 ID를 입력해주세요!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/test/${testId}/result`);
      const result = await response.json();
      setTestResult(result);
      alert(`테스트 결과를 가져왔습니다!`);
    } catch (error) {
      alert("테스트 결과 가져오기 실패");
      console.log("에러:", error);
    }
    setLoading(false);
  };

  // 🔥🔥🔥🔥🔥 특정 퀴즈 조회 (GET /api/test/[testId]/[quizNumber])
  const handleGetQuiz = async () => {
    if (!testId || !quizNumber) {
      alert("테스트 ID와 퀴즈 번호를 모두 입력해주세요!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/test/${testId}/${quizNumber}`);
      const result = await response.json();
      setQuiz(result);
      alert(`퀴즈 ${quizNumber}번 정보를 가져왔습니다!`);
    } catch (error) {
      alert("퀴즈 조회 실패");
      console.log("에러:", error);
    }
    setLoading(false);
  };

  // 🔥🔥🔥🔥🔥 퀴즈 답안 제출 (POST /api/test/[testId]/[quizNumber])
  const handleSubmitAnswer = async () => {
    if (!testId || !quizNumber || !answer) {
      alert("테스트 ID, 퀴즈 번호, 답안을 모두 입력해주세요!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/test/${testId}/${quizNumber}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer: answer }),
      });
      const result = await response.json();
      setSubmitResult(result);
      alert(`퀴즈 ${quizNumber}번 답안이 제출되었습니다!`);
    } catch (error) {
      alert("답안 제출 실패");
      console.log("에러:", error);
    }
    setLoading(false);
  };

  // 🔥🔥🔥🔥🔥 퀴즈 결과 조회 (GET /api/test/[testId]/[quizNumber]/result)
  const handleGetQuizResult = async () => {
    if (!testId || !quizNumber) {
      alert("테스트 ID와 퀴즈 번호를 모두 입력해주세요!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/test/${testId}/${quizNumber}/result`);
      const result = await response.json();
      setQuizResult(result);
      alert(`퀴즈 ${quizNumber}번 결과를 가져왔습니다!`);
    } catch (error) {
      alert("퀴즈 결과 조회 실패");
      console.log("에러:", error);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-6xl p-5">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        API 테스트 페이지
      </h1>

      {/* 기본 버튼들 */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={handleGetUser}
          disabled={loading}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "로딩중..." : "👤 사용자 정보 가져오기"}
        </button>

        <button
          onClick={handleGetTests}
          disabled={loading}
          className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "로딩중..." : "📋 테스트 목록 가져오기"}
        </button>

        <button
          onClick={handleCreateTest}
          disabled={loading}
          className="rounded-lg bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "로딩중..." : "➕ 새 테스트 생성"}
        </button>
      </div>

      {/* API 테스트 섹션들 */}
      <div className="space-y-6">
        {/* 🔥🔥🔥🔥🔥 5단계: 특정 테스트 조회 */}
        <div className="rounded-lg border-2 border-gray-800 bg-gray-50 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            🔍 5단계: 특정 테스트 조회 (GET /api/test/[testId])
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="테스트 ID 입력"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="w-48 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleGetSpecificTest}
              disabled={loading || !testId}
              className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "로딩중..." : "테스트 조회"}
            </button>
          </div>
        </div>

        {/* 🔥🔥🔥🔥🔥 6단계: 테스트 완료 여부 확인 */}
        <div className="rounded-lg border-2 border-orange-500 bg-orange-50 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            🏁 6단계: 테스트 완료 여부 확인 (GET /api/test/[testId]/is-finished)
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="테스트 ID 입력"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="w-48 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleCheckIsFinished}
              disabled={loading || !testId}
              className="rounded-md bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "로딩중..." : "완료 여부 확인"}
            </button>
          </div>
        </div>

        {/* 🔥🔥🔥🔥🔥 7단계: 퀴즈 리스트 가져오기 */}
        <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            📋 7단계: 퀴즈 리스트 가져오기 (GET /api/test/[testId]/quiz-list)
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="테스트 ID 입력"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="w-48 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleGetQuizList}
              disabled={loading || !testId}
              className="rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "로딩중..." : "퀴즈 리스트 가져오기"}
            </button>
          </div>
        </div>

        {/* 🔥🔥🔥🔥🔥 8단계: 테스트 결과 가져오기 */}
        <div className="rounded-lg border-2 border-purple-500 bg-purple-50 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            🏆 8단계: 테스트 결과 가져오기 (GET /api/test/[testId]/result)
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="테스트 ID 입력"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="w-48 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleGetTestResult}
              disabled={loading || !testId}
              className="rounded-md bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "로딩중..." : "테스트 결과 가져오기"}
            </button>
          </div>
        </div>

        {/* 🔥🔥🔥🔥🔥 9단계: 특정 퀴즈 조회 */}
        <div className="rounded-lg border-2 border-red-500 bg-red-50 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            📝 9단계: 특정 퀴즈 조회 (GET /api/test/[testId]/[quizNumber])
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="테스트 ID"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="w-36 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="number"
              placeholder="퀴즈 번호 (1, 2, 3...)"
              value={quizNumber}
              onChange={(e) => setQuizNumber(e.target.value)}
              className="w-40 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleGetQuiz}
              disabled={loading || !testId || !quizNumber}
              className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "로딩중..." : "퀴즈 조회"}
            </button>
          </div>
        </div>

        {/* 🔥🔥🔥🔥🔥 10단계: 퀴즈 답안 제출 */}
        <div className="rounded-lg border-2 border-yellow-500 bg-yellow-50 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            ✅ 10단계: 퀴즈 답안 제출 (POST /api/test/[testId]/[quizNumber])
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="테스트 ID"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="w-32 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="number"
              placeholder="퀴즈 번호"
              value={quizNumber}
              onChange={(e) => setQuizNumber(e.target.value)}
              className="w-28 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="text"
              placeholder="답안 (A, B, C, D 또는 1, 2, 3, 4)"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-48 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={loading || !testId || !quizNumber || !answer}
              className="rounded-md bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "로딩중..." : "답안 제출"}
            </button>
          </div>
        </div>

        {/* 🔥🔥🔥🔥🔥 11단계: 퀴즈 결과 조회 */}
        <div className="rounded-lg border-2 border-teal-500 bg-teal-50 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            📊 11단계: 퀴즈 결과 조회 (GET
            /api/test/[testId]/[quizNumber]/result)
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="테스트 ID"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="w-36 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="number"
              placeholder="퀴즈 번호"
              value={quizNumber}
              onChange={(e) => setQuizNumber(e.target.value)}
              className="w-36 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleGetQuizResult}
              disabled={loading || !testId || !quizNumber}
              className="rounded-md bg-teal-500 px-4 py-2 text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "로딩중..." : "퀴즈 결과 조회"}
            </button>
          </div>
        </div>
      </div>

      {/* 결과 표시 영역 */}
      <div className="mt-8 space-y-6">
        {/* 🔥🔥🔥🔥🔥 사용자 정보 */}
        {user && (
          <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-4">
            <h2 className="mb-3 text-xl font-bold text-gray-800">
              👤 사용자 정보
            </h2>
            <pre className="overflow-x-auto rounded border bg-white p-3 text-sm text-gray-700">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        {/* 🔥🔥🔥🔥🔥 테스트 목록 */}
        {tests && (
          <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4">
            <h2 className="mb-3 text-xl font-bold text-gray-800">
              📋 테스트 목록
            </h2>
            <pre className="overflow-x-auto rounded border bg-white p-3 text-sm text-gray-700">
              {JSON.stringify(tests, null, 2)}
            </pre>
          </div>
        )}

        {/* 🔥🔥🔥🔥🔥 선택된 테스트 정보 */}
        {selectedTest && (
          <div className="rounded-lg border-2 border-purple-500 bg-purple-50 p-4">
            <h2 className="mb-3 text-xl font-bold text-gray-800">
              🔍 선택된 테스트 정보
            </h2>
            <pre className="overflow-x-auto rounded border bg-white p-3 text-sm text-gray-700">
              {JSON.stringify(selectedTest, null, 2)}
            </pre>
          </div>
        )}

        {/* 🔥🔥🔥🔥🔥 테스트 완료 여부 */}
        {isFinished && (
          <div className="rounded-lg border-2 border-orange-500 bg-orange-50 p-4">
            <h2 className="mb-3 text-xl font-bold text-gray-800">
              🏁 테스트 완료 여부
            </h2>
            <pre className="overflow-x-auto rounded border bg-white p-3 text-sm text-gray-700">
              {JSON.stringify(isFinished, null, 2)}
            </pre>
          </div>
        )}

        {/* 🔥🔥🔥🔥🔥 퀴즈 리스트 */}
        {quizList && (
          <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4">
            <h2 className="mb-3 text-xl font-bold text-gray-800">
              📋 퀴즈 리스트
            </h2>
            <pre className="overflow-x-auto rounded border bg-white p-3 text-sm text-gray-700">
              {JSON.stringify(quizList, null, 2)}
            </pre>
          </div>
        )}

        {/* 🔥🔥🔥🔥🔥 테스트 결과 */}
        {testResult && (
          <div className="rounded-lg border-2 border-purple-500 bg-purple-50 p-4">
            <h2 className="mb-3 text-xl font-bold text-gray-800">
              🏆 테스트 결과
            </h2>
            <pre className="overflow-x-auto rounded border bg-white p-3 text-sm text-gray-700">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        {/* 🔥🔥🔥🔥🔥 특정 퀴즈 정보 */}
        {quiz && (
          <div className="rounded-lg border-2 border-red-500 bg-red-50 p-4">
            <h2 className="mb-3 text-xl font-bold text-gray-800">
              📝 특정 퀴즈 정보
            </h2>
            <pre className="overflow-x-auto rounded border bg-white p-3 text-sm text-gray-700">
              {JSON.stringify(quiz, null, 2)}
            </pre>
          </div>
        )}

        {/* 🔥🔥🔥🔥🔥 답안 제출 결과 */}
        {submitResult && (
          <div className="rounded-lg border-2 border-yellow-500 bg-yellow-50 p-4">
            <h2 className="mb-3 text-xl font-bold text-gray-800">
              ✅ 답안 제출 결과
            </h2>
            <pre className="overflow-x-auto rounded border bg-white p-3 text-sm text-gray-700">
              {JSON.stringify(submitResult, null, 2)}
            </pre>
          </div>
        )}

        {/* 🔥🔥🔥🔥🔥 퀴즈 결과 (사용자 답, 정답, 해설) */}
        {quizResult && (
          <div className="rounded-lg border-2 border-teal-500 bg-teal-50 p-4">
            <h2 className="mb-3 text-xl font-bold text-gray-800">
              📊 퀴즈 결과 (사용자 답 vs 정답)
            </h2>
            <pre className="overflow-x-auto rounded border bg-white p-3 text-sm text-gray-700">
              {JSON.stringify(quizResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
