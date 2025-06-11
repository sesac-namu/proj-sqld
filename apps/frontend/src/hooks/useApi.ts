// apps/frontend/src/hooks/useApi.ts

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

export function useUser() {
  const { data: user, loading, error, execute } = useApiState<User>();

  const fetchUser = useCallback(async () => {
    return execute(() => userApi.getMe());
  }, [execute]);

  return { user, loading, error, fetchUser };
}

export function useTestList() {
  const { data: tests, loading, error, execute } = useApiState<TestUI[]>();

  const fetchTests = useCallback(async () => {
    return execute(() => testApi.getList());
  }, [execute]);

  const createTest = useCallback(async () => {
    const newTest = await testApi.create();
    await fetchTests();
    return newTest;
  }, [fetchTests]);

  return { tests, loading, error, fetchTests, createTest };
}

export function useTest(testId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

export function useQuiz(testId: string, quizNumber: number) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const fetchQuiz = useCallback(async () => {
    if (!testId || !quizNumber) return;
    setLoading(true);
    setError(null);
    try {
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
    async (answers: number[]) => {
      if (!testId || !quizNumber || answers.length === 0) return;

      setSubmitting(true);
      try {
        const result = await quizApi.submitAnswer(testId, quizNumber, answers);
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
