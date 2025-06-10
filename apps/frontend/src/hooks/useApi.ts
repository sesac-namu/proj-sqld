// hooks/useApi.ts

import { useCallback, useState } from "react";
import { apiErrorHandler, quizApi, testApi, userApi } from "@/lib/api";

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
  const { data: user, loading, error, execute } = useApiState();

  const fetchUser = useCallback(async () => {
    return execute(() => userApi.getMe());
  }, [execute]);

  return { user, loading, error, fetchUser };
}

export function useTestList() {
  const { data: tests, loading, error, execute } = useApiState();

  const fetchTests = useCallback(async () => {
    return execute(() => testApi.getList());
  }, [execute]);

  const createTest = useCallback(async () => {
    const newTest = await execute(() => testApi.create());

    await fetchTests();
    return newTest;
  }, [execute, fetchTests]);

  return { tests, loading, error, fetchTests, createTest };
}

export function useTest(testId: string) {
  const { data: test, loading, error, execute } = useApiState();

  const fetchTest = useCallback(async () => {
    if (!testId) return;
    return execute(() => testApi.getById(testId));
  }, [testId, execute]);

  const checkFinished = useCallback(async () => {
    if (!testId) return;
    return execute(() => testApi.isFinished(testId));
  }, [testId, execute]);

  const getQuizList = useCallback(async () => {
    if (!testId) return;
    return execute(() => testApi.getQuizList(testId));
  }, [testId, execute]);

  const getResult = useCallback(async () => {
    if (!testId) return;
    return execute(() => testApi.getResult(testId));
  }, [testId, execute]);

  const finishTest = useCallback(
    async (data?: any) => {
      if (!testId) return;
      return execute(() => testApi.finish(testId, data));
    },
    [testId, execute],
  );

  return {
    test,
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
  const { data: quiz, loading, error, execute } = useApiState();
  const [submitting, setSubmitting] = useState(false);

  const fetchQuiz = useCallback(async () => {
    if (!testId || !quizNumber) return;
    return execute(() => quizApi.getById(testId, quizNumber));
  }, [testId, quizNumber, execute]);

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
    return execute(() => quizApi.getResult(testId, quizNumber));
  }, [testId, quizNumber, execute]);

  return {
    quiz,
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

  const call = useCallback(async (apiCall: () => Promise<any>) => {
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
