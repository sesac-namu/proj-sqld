export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Test {
  id: number;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  finishedAt: string | null;
  userId: string;
}

export interface TestUI {
  id: string;
  title?: string;
  description?: string;
  totalQuestions?: number;
  createdAt: string;
  isFinished: boolean;
  score?: number | null;
}

export interface QuizListItem {
  id: number;
  testId: number;
  quizId: number;
  quizNumber: number;
  solvedAt: string | null;
  solved: boolean;
  userChoices: unknown[];
}

export interface QuizDetail {
  quizId: number;
  solvedAt: string | null;
  category: number;
  tags: string;
  title: string;
  contentImg: string;
  contentText: string;
  choices1: string;
  choices2: string;
  choices3: string;
  choices4: string;
  multiple: boolean;
}

export interface Quiz {
  id: number;
  quizNumber: number;
  question: string;
  contentImg?: string;
  contentText?: string;
  options?: string[];
  questionType: string;
  category?: number;
  multiple?: boolean;
  tags?: string;
}

export interface QuizResultResponse {
  quiz: Array<{
    id: number;
    category: number;
    tags: string;
    title: string;
    content_img: string;
    content_text: string;
    choices1: string;
    choices2: string;
    choices3: string;
    choices4: string;
    multiple: boolean;
    answer_explanation: string;
  }>;
  testQuiz: {
    id: number;
    testId: number;
    quizId: number;
    quizNumber: number;
    solvedAt: string;
  };
  userChoices: unknown[];
  answers: number[];
}

export interface TestResultResponse {
  test: Test;
  quizList: Array<{
    quiz: {
      id: number;
      category: number;
      tags: string;
      title: string;
      content_img: string;
      content_text: string;
      choices1: string;
      choices2: string;
      choices3: string;
      choices4: string;
      multiple: boolean;
      answer_explanation: string;
    };
    answers: number[];
    userChoices: unknown[];
  }>;
}

export interface QuizResult {
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
  quiz?: {
    id: number;
    title: string;
    choices: string[];
    multiple: boolean;
  };
}

export interface TestResult {
  test: Test;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  quizResults: Array<{
    quiz: {
      id: number;
      category: number;
      tags: string;
      title: string;
      content_img: string;
      content_text: string;
      choices1: string;
      choices2: string;
      choices3: string;
      choices4: string;
      multiple: boolean;
      answer_explanation: string;
    };
    isCorrect: boolean;
    correctAnswer: string;
    userAnswer: string;
    explanation: string;
  }>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

async function apiCall<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    console.log(`🚀 API 호출: ${options.method || "GET"} ${url}`);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    console.log(`📡 응답 상태: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorDetails = "";
      try {
        const errorBody = await response.text();
        console.log("❌ 에러 응답 내용:", errorBody);
        errorDetails = errorBody;
      } catch {
        console.log("❌ 에러 응답을 읽을 수 없음");
      }

      throw new Error(
        `API Error: ${response.status} ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ""}`,
      );
    }

    const data = await response.json();
    console.log("✅ 응답 데이터:", data);
    return data;
  } catch (error) {
    console.error("🔥 API 호출 에러:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "네트워크 연결 오류: 백엔드 서버가 실행 중인지 확인해주세요.",
      );
    }

    throw error;
  }
}

export const userApi = {
  async getMe(): Promise<User> {
    const response = await apiCall<ApiResponse<User>>("/api/user/me");
    return response.data;
  },
};

export const testApi = {
  async getList(): Promise<TestUI[]> {
    const response = await apiCall<ApiResponse<Test[]>>("/api/test");
    console.log("테스트 목록 원본 응답:", response);

    const testsWithRealStatus = await Promise.all(
      response.data.map(async (test: Test): Promise<TestUI> => {
        try {
          console.log(`🔥 테스트 ${test.id} 퀴즈 리스트 확인 중...`);

          const quizListResponse = await apiCall<
            ApiResponse<{ quizList: QuizListItem[] }>
          >(`/api/test/${test.id}/quiz-list`);

          const quizList = quizListResponse.data.quizList;
          console.log(`테스트 ${test.id} 퀴즈 리스트:`, quizList);

          const totalQuizzes = quizList.length;
          const solvedQuizzes = quizList.filter(
            (quiz) => quiz.solved === true,
          ).length;
          const isReallyFinished =
            totalQuizzes > 0 && solvedQuizzes === totalQuizzes;

          console.log(`✅ 테스트 ${test.id} 실제 완료 상태:`, {
            총문제수: totalQuizzes,
            푼문제수: solvedQuizzes,
            백엔드_finishedAt: test.finishedAt,
            백엔드_score: test.score,
            실제_완료상태: isReallyFinished,
          });

          return {
            id: test.id.toString(),
            title: `SQLD 테스트 #${test.id}`,
            description: "SQLD 자격증 시험 대비 문제입니다.",
            totalQuestions: totalQuizzes,
            createdAt: test.createdAt,
            isFinished: isReallyFinished,
            score: test.score,
          } as TestUI;
        } catch (error) {
          console.warn(`❌ 테스트 ${test.id} 퀴즈 리스트 확인 실패:`, error);

          return {
            id: test.id.toString(),
            title: `SQLD 테스트 #${test.id}`,
            description: "SQLD 자격증 시험 대비 문제입니다.",
            totalQuestions: undefined,
            createdAt: test.createdAt,
            isFinished: false,
            score: test.score,
          } as TestUI;
        }
      }),
    );

    console.log("✅ 최종 변환된 테스트 목록:", testsWithRealStatus);
    return testsWithRealStatus;
  },

  async create(): Promise<{ testId: number; createdAt: string }> {
    const response = await apiCall<
      ApiResponse<{ test: { testId: number; createdAt: string } }>
    >("/api/test/create", { method: "POST" });
    return response.data.test;
  },

  async getById(testId: string): Promise<Test> {
    const response = await apiCall<ApiResponse<{ test: Test }>>(
      `/api/test/${testId}`,
    );
    return response.data.test;
  },

  async isFinished(testId: string): Promise<{ isFinished: boolean }> {
    const response = await apiCall<ApiResponse<{ isFinished: boolean }>>(
      `/api/test/${testId}/is-finished`,
    );
    return response.data;
  },

  async getQuizList(testId: string): Promise<QuizListItem[]> {
    const response = await apiCall<ApiResponse<{ quizList: QuizListItem[] }>>(
      `/api/test/${testId}/quiz-list`,
    );
    console.log("퀴즈 리스트 원본 응답:", response);
    return response.data.quizList;
  },

  async getResult(testId: string): Promise<TestResult> {
    const response = await apiCall<ApiResponse<TestResultResponse>>(
      `/api/test/${testId}/result`,
    );
    const resultData = response.data;

    const quizResults = resultData.quizList.map((item) => {
      const quiz = item.quiz;

      const correctAnswerIndex =
        item.answers && Array.isArray(item.answers) && item.answers.length > 0
          ? item.answers[0]
          : 1;

      const safeAnswerIndex: number =
        typeof correctAnswerIndex === "number" &&
        correctAnswerIndex >= 1 &&
        correctAnswerIndex <= 4
          ? correctAnswerIndex
          : 1;

      const answerLetters: readonly string[] = ["A", "B", "C", "D"];
      const correctAnswerLetter: string = answerLetters[
        safeAnswerIndex - 1
      ] as string;

      return {
        quiz: quiz,
        isCorrect: false,
        correctAnswer: correctAnswerLetter,
        userAnswer: "",
        explanation: quiz.answer_explanation.replace(/^해설:\s*/, ""),
      };
    });

    const correctCount = quizResults.filter((r) => r.isCorrect).length;

    return {
      test: resultData.test,
      totalQuestions: resultData.quizList.length,
      correctAnswers: correctCount,
      score: resultData.test.score || 0,
      percentage:
        resultData.quizList.length > 0
          ? (correctCount / resultData.quizList.length) * 100
          : 0,
      quizResults: quizResults,
    };
  },

  async finish(
    testId: string,
    data?: Record<string, unknown>,
  ): Promise<{ ok: boolean }> {
    const response = await apiCall<{ ok: boolean }>(`/api/test/${testId}`, {
      method: "POST",
      body: JSON.stringify(data || {}),
    });
    return response;
  },
};

export const quizApi = {
  async getById(testId: string, quizNumber: number): Promise<Quiz> {
    const response = await apiCall<
      ApiResponse<{ quiz: QuizDetail; choices: unknown[] }>
    >(`/api/test/${testId}/${quizNumber}`);
    console.log(`퀴즈 ${quizNumber} 상세 정보:`, response);

    const quizDetail = response.data.quiz;

    const quiz: Quiz = {
      id: quizDetail.quizId,
      quizNumber: quizNumber,
      question: quizDetail.title,
      contentImg: quizDetail.contentImg,
      contentText: quizDetail.contentText,
      options: [
        `A. ${quizDetail.choices1}`,
        `B. ${quizDetail.choices2}`,
        `C. ${quizDetail.choices3}`,
        `D. ${quizDetail.choices4}`,
      ].filter((choice) => choice.length > 3),
      questionType: quizDetail.multiple ? "multiple" : "single",
      category: quizDetail.category,
      multiple: quizDetail.multiple,
      tags: quizDetail.tags,
    };

    console.log("✅ 변환된 퀴즈 데이터:", quiz);
    return quiz;
  },

  async submitAnswer(
    testId: string,
    quizNumber: number,
    answer: number, // 🔥 string → number로 변경
  ): Promise<unknown> {
    console.log("🔥 답안 제출:", {
      testId,
      quizNumber,
      answer,
      answerType: typeof answer,
    });

    // 🔥 number 타입으로 전송
    const requestData = {
      answer: answer, // 숫자 그대로 전송
    };

    console.log("🔥 전송할 데이터:", requestData);

    const response = await apiCall(`/api/test/${testId}/${quizNumber}`, {
      method: "POST",
      body: JSON.stringify(requestData),
    });

    console.log("✅ 답안 제출 성공:", response);
    return response;
  },

  // 🔥 기존 api.ts 파일에서 quizApi.getResult() 함수만 이 코드로 교체하세요
  async getResult(testId: string, quizNumber: number): Promise<QuizResult> {
    const response = await apiCall<ApiResponse<QuizResultResponse>>(
      `/api/test/${testId}/${quizNumber}/result`,
    );
    console.log(`퀴즈 ${quizNumber} 결과:`, response);

    const resultData = response.data;

    // 🔥 데이터 유효성 검사
    if (
      !resultData.quiz ||
      !Array.isArray(resultData.quiz) ||
      resultData.quiz.length === 0
    ) {
      throw new Error("퀴즈 데이터가 없습니다.");
    }

    if (
      !resultData.answers ||
      !Array.isArray(resultData.answers) ||
      resultData.answers.length === 0
    ) {
      throw new Error("정답 데이터가 없습니다.");
    }

    const firstQuiz = resultData.quiz[0];
    const firstAnswerIndex = resultData.answers[0];

    if (!firstQuiz) {
      throw new Error("첫 번째 퀴즈 데이터가 없습니다.");
    }

    // 🔥 안전한 정답 인덱스 처리
    const safeAnswerIndex: number =
      typeof firstAnswerIndex === "number" &&
      firstAnswerIndex >= 1 &&
      firstAnswerIndex <= 4
        ? firstAnswerIndex
        : 1;

    // 🔥 사용자 답안 추출
    let userAnswerIndex: number | null = null;
    if (
      resultData.userChoices &&
      Array.isArray(resultData.userChoices) &&
      resultData.userChoices.length > 0
    ) {
      userAnswerIndex =
        typeof resultData.userChoices[0] === "number"
          ? resultData.userChoices[0]
          : null;
    }

    // 🔥 A, B, C, D 형태로 변환
    const answerLetters: readonly string[] = ["A", "B", "C", "D"];
    const correctAnswerLetter: string = answerLetters[
      safeAnswerIndex - 1
    ] as string;
    const userAnswerLetter: string = userAnswerIndex
      ? (answerLetters[userAnswerIndex - 1] as string)
      : "";

    // 🔥 정답 확인
    const isCorrect =
      userAnswerIndex !== null && userAnswerIndex === safeAnswerIndex;

    // 🔥 해설에서 "해설:" 접두사 제거
    const cleanExplanation: string = firstQuiz.answer_explanation.replace(
      /^해설:\s*/,
      "",
    );

    const quizResult: QuizResult = {
      isCorrect: isCorrect,
      correctAnswer: correctAnswerLetter, // "A", "B", "C", "D"
      userAnswer: userAnswerLetter, // "A", "B", "C", "D" 또는 ""
      explanation: cleanExplanation,
      quiz: {
        id: firstQuiz.id,
        title: firstQuiz.title,
        choices: [
          firstQuiz.choices1,
          firstQuiz.choices2,
          firstQuiz.choices3,
          firstQuiz.choices4,
        ],
        multiple: firstQuiz.multiple,
      },
    };

    console.log("✅ 변환된 퀴즈 결과:", quizResult);
    return quizResult;
  },
};

export const apiErrorHandler = {
  getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error.message?.includes("네트워크 연결 오류")) {
        return "백엔드 서버가 실행되지 않고 있습니다. 백엔드 개발자에게 문의하세요.";
      }
      if (error.message?.includes("404")) {
        return "요청한 API 엔드포인트를 찾을 수 없습니다. 백엔드 API가 구현되지 않았을 수 있습니다.";
      }
      if (error.message?.includes("500")) {
        return "백엔드 서버에 오류가 발생했습니다. 백엔드 로그를 확인해주세요.";
      }
      if (error.message?.includes("401")) {
        return "인증이 필요합니다. 로그인 상태를 확인해주세요.";
      }
      if (error.message?.includes("403")) {
        return "접근 권한이 없습니다.";
      }
      return error.message;
    }
    return "알 수 없는 오류가 발생했습니다.";
  },

  showError(error: unknown) {
    const message = this.getErrorMessage(error);
    alert(message);
    console.error("에러 상세:", error);
  },
};

export const healthCheck = {
  async checkServer(): Promise<boolean> {
    try {
      const response = await fetch("/api/health", { method: "GET" });
      console.log("서버 상태:", response.status);
      return response.status === 200;
    } catch {
      console.log("서버 연결 실패");
      return false;
    }
  },

  async testEndpoints() {
    const endpoints = [
      { name: "사용자 정보", url: "/api/user/me" },
      { name: "테스트 목록", url: "/api/test" },
      { name: "테스트 생성", url: "/api/test/create", method: "POST" },
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url, {
          method: endpoint.method || "GET",
          headers: { "Content-Type": "application/json" },
        });
        console.log(
          `${endpoint.name}: ${response.status} ${response.statusText}`,
        );
      } catch {
        console.log(`${endpoint.name}: 연결 실패`);
      }
    }
  },
};
