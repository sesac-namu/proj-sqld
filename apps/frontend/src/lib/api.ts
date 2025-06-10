export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Test {
  id: string;
  title?: string;
  description?: string;
  totalQuestions?: number;
  createdAt: string;
  isFinished: boolean;
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
  options?: string[];
  questionType: string;
  difficulty?: string;
  category?: number;
  multiple?: boolean;
  tags?: string;
}

export interface QuizResult {
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  explanation?: string;
}

export interface TestResult {
  testId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  quizResults: QuizResult[];
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
    const response = await apiCall<ApiResponse<User> | User>("/api/user/me");

    if (response && typeof response === "object" && "data" in response) {
      return (response as ApiResponse<User>).data;
    }
    return response as User;
  },
};

export const testApi = {
  async getList(): Promise<Test[]> {
    const response = await apiCall<ApiResponse<Test[]> | Test[]>("/api/test");
    console.log("테스트 목록 원본 응답:", response);

    if (response && typeof response === "object" && "data" in response) {
      const apiResponse = response as ApiResponse<Test[]>;
      if (Array.isArray(apiResponse.data)) {
        return apiResponse.data;
      }
    }

    if (Array.isArray(response)) {
      return response as Test[];
    }

    return [];
  },

  async create(): Promise<Test> {
    const response = await apiCall<ApiResponse<Test> | Test>(
      "/api/test/create",
      { method: "POST" },
    );

    if (response && typeof response === "object" && "data" in response) {
      return (response as ApiResponse<Test>).data;
    }
    return response as Test;
  },

  async getById(testId: string): Promise<Test> {
    const response = await apiCall<ApiResponse<Test> | Test>(
      `/api/test/${testId}`,
    );

    if (response && typeof response === "object" && "data" in response) {
      return (response as ApiResponse<Test>).data;
    }
    return response as Test;
  },

  async isFinished(testId: string): Promise<{ isFinished: boolean }> {
    const response = await apiCall<
      ApiResponse<{ isFinished: boolean }> | { isFinished: boolean }
    >(`/api/test/${testId}/is-finished`);

    if (response && typeof response === "object" && "data" in response) {
      return (response as ApiResponse<{ isFinished: boolean }>).data;
    }
    return response as { isFinished: boolean };
  },

  async getQuizList(testId: string): Promise<QuizListItem[]> {
    const response = await apiCall<
      ApiResponse<{ quizList: QuizListItem[] }> | QuizListItem[]
    >(`/api/test/${testId}/quiz-list`);
    console.log("퀴즈 리스트 원본 응답:", response);

    if (response && typeof response === "object" && "data" in response) {
      const apiResponse = response as ApiResponse<{ quizList: QuizListItem[] }>;
      if (
        apiResponse.data &&
        "quizList" in apiResponse.data &&
        Array.isArray(apiResponse.data.quizList)
      ) {
        return apiResponse.data.quizList;
      }
      if (Array.isArray(apiResponse.data)) {
        return apiResponse.data as unknown as QuizListItem[];
      }
    }

    if (Array.isArray(response)) {
      return response as QuizListItem[];
    }

    console.warn("퀴즈 리스트 형태를 인식할 수 없음:", response);
    return [];
  },

  async getResult(testId: string): Promise<TestResult> {
    const response = await apiCall<ApiResponse<TestResult> | TestResult>(
      `/api/test/${testId}/result`,
    );

    if (response && typeof response === "object" && "data" in response) {
      return (response as ApiResponse<TestResult>).data;
    }
    return response as TestResult;
  },

  async finish(
    testId: string,
    data?: Record<string, unknown>,
  ): Promise<unknown> {
    const response = await apiCall(`/api/test/${testId}`, {
      method: "POST",
      body: JSON.stringify(data || {}),
    });

    if (response && typeof response === "object" && "data" in response) {
      return (response as ApiResponse<unknown>).data;
    }
    return response;
  },
};

export const quizApi = {
  async getById(testId: string, quizNumber: number): Promise<Quiz> {
    const response = await apiCall<ApiResponse<{ quiz: QuizDetail }>>(
      `/api/test/${testId}/${quizNumber}`,
    );
    console.log(`퀴즈 ${quizNumber} 상세 정보:`, response);

    let quizDetail: QuizDetail;

    if (response && typeof response === "object" && "data" in response) {
      const apiResponse = response as ApiResponse<{ quiz: QuizDetail }>;
      if (apiResponse.data && "quiz" in apiResponse.data) {
        quizDetail = apiResponse.data.quiz;
      } else {
        throw new Error("퀴즈 데이터를 찾을 수 없습니다.");
      }
    } else {
      throw new Error("응답 형식이 올바르지 않습니다.");
    }

    const quiz: Quiz = {
      id: quizDetail.quizId,
      quizNumber: quizNumber,
      question: quizDetail.title,
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
    answer: string,
  ): Promise<unknown> {
    const response = await apiCall(`/api/test/${testId}/${quizNumber}`, {
      method: "POST",
      body: JSON.stringify({ answer }),
    });

    if (response && typeof response === "object" && "data" in response) {
      return (response as ApiResponse<unknown>).data;
    }
    return response;
  },

  async getResult(testId: string, quizNumber: number): Promise<QuizResult> {
    const response = await apiCall<ApiResponse<QuizResult> | QuizResult>(
      `/api/test/${testId}/${quizNumber}/result`,
    );

    if (response && typeof response === "object" && "data" in response) {
      return (response as ApiResponse<QuizResult>).data;
    }
    return response as QuizResult;
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
