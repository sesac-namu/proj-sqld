// src/hooks/useApi.ts

import { useCallback, useState } from "react";
import {
  apiErrorHandler,
  Quiz,
  quizApi,
  QuizListItem,
  QuizResult,
  Test,
  testApi,
  TestResult,
  TestUI,
  User,
  userApi,
} from "@/lib/api";

// 🔥🔥🔥🔥🔥 기본 API 상태 관리 훅
function useApiState<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = apiErrorHandler.getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// 🔥🔥🔥🔥🔥 사용자 정보 훅
export function useUser() {
  const { data: user, loading, error, execute } = useApiState<User>();

  const fetchUser = useCallback(async () => {
    return execute(() => userApi.getMe());
  }, [execute]);

  return { user, loading, error, fetchUser };
}

// 🔥🔥🔥🔥🔥 테스트 목록 훅 (TestUI 타입 사용)
export function useTestList() {
  const { data: tests, loading, error, execute } = useApiState<TestUI[]>();

  const fetchTests = useCallback(async () => {
    return execute(() => testApi.getList());
  }, [execute]);

  const createTest = useCallback(async () => {
    // 새 테스트 생성은 별도의 API 호출이므로 execute를 사용하지 않음
    const newTest = await testApi.create();
    // 새 테스트 생성 후 목록 새로고침
    await fetchTests();
    return newTest;
  }, [fetchTests]);

  return { tests, loading, error, fetchTests, createTest };
}

// 🔥🔥🔥🔥🔥 특정 테스트 훅 - 각 기능별로 분리된 상태 관리
export function useTest(testId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 각각 별도의 상태 관리
  const [test, setTest] = useState<Test | null>(null);
  const [isFinished, setIsFinished] = useState<{ isFinished: boolean } | null>(
    null,
  );
  const [quizList, setQuizList] = useState<QuizListItem[] | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const fetchTest = useCallback(async () => {
    if (!testId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await testApi.getById(testId);
      setTest(result);
      return result;
    } catch (err) {
      const errorMessage = apiErrorHandler.getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [testId]);

  const checkFinished = useCallback(async () => {
    if (!testId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await testApi.isFinished(testId);
      setIsFinished(result);
      return result;
    } catch (err) {
      const errorMessage = apiErrorHandler.getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [testId]);

  const getQuizList = useCallback(async () => {
    if (!testId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await testApi.getQuizList(testId);
      setQuizList(result);
      return result;
    } catch (err) {
      const errorMessage = apiErrorHandler.getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [testId]);

  const getResult = useCallback(async () => {
    if (!testId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await testApi.getResult(testId);
      setTestResult(result);
      return result;
    } catch (err) {
      const errorMessage = apiErrorHandler.getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [testId]);

  const finishTest = useCallback(
    async (data?: Record<string, unknown>) => {
      if (!testId) return;
      setLoading(true);
      setError(null);
      try {
        const result = await testApi.finish(testId, data);
        return result;
      } catch (err) {
        const errorMessage = apiErrorHandler.getErrorMessage(err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [testId],
  );

  return {
    test,
    isFinished,
    quizList,
    testResult,
    loading,
    error,
    fetchTest,
    checkFinished,
    getQuizList,
    getResult,
    finishTest,
  };
}

// 🔥🔥🔥🔥🔥 퀴즈 훅 - Quiz 타입 사용
export function useQuiz(testId: string, quizNumber: number) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quiz 타입으로 상태 관리
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const fetchQuiz = useCallback(async () => {
    if (!testId || !quizNumber) return;
    setLoading(true);
    setError(null);
    try {
      // API에서 Quiz 타입으로 변환된 데이터를 받음
      const result = await quizApi.getById(testId, quizNumber);
      setQuiz(result);
      return result;
    } catch (err) {
      const errorMessage = apiErrorHandler.getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [testId, quizNumber]);

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (!testId || !quizNumber || !answer) return;

      setSubmitting(true);
      try {
        const result = await quizApi.submitAnswer(testId, quizNumber, answer);
        return result;
      } catch (err) {
        apiErrorHandler.showError(err);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [testId, quizNumber],
  );

  const getResult = useCallback(async () => {
    if (!testId || !quizNumber) return;
    setLoading(true);
    setError(null);
    try {
      const result = await quizApi.getResult(testId, quizNumber);
      setQuizResult(result);
      return result;
    } catch (err) {
      const errorMessage = apiErrorHandler.getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [testId, quizNumber]);

  return {
    quiz,
    quizResult,
    loading,
    error,
    submitting,
    fetchQuiz,
    submitAnswer,
    getResult,
  };
}

// 🔥🔥🔥🔥🔥 간단한 API 호출 훅 (일회성 호출용)
export function useApiCall() {
  const [loading, setLoading] = useState(false);

  const call = useCallback(async (apiCall: () => Promise<unknown>) => {
    setLoading(true);
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      apiErrorHandler.showError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, call };
}
