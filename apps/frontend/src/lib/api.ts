// lib/api.ts

// 🔥 기본 API 호출 함수
async function apiCall(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API 호출 에러:", error);
    throw error;
  }
}

// 🔥🔥🔥🔥🔥 테스트 관련 API
export const testApi = {
  // 테스트 목록 가져오기
  async getList() {
    return apiCall("/api/test");
  },

  // 새 테스트 생성
  async create() {
    return apiCall("/api/test/create", { method: "POST" });
  },

  // 특정 테스트 정보 가져오기
  async getById(testId: string) {
    return apiCall(`/api/test/${testId}`);
  },

  // 테스트 완료 여부 확인
  async isFinished(testId: string) {
    return apiCall(`/api/test/${testId}/is-finished`);
  },

  // 퀴즈 리스트 가져오기
  async getQuizList(testId: string) {
    return apiCall(`/api/test/${testId}/quiz-list`);
  },

  // 테스트 결과 가져오기
  async getResult(testId: string) {
    return apiCall(`/api/test/${testId}/result`);
  },

  // 테스트 완료 처리
  async finish(testId: string, data?: any) {
    return apiCall(`/api/test/${testId}`, {
      method: "POST",
      body: JSON.stringify(data || {}),
    });
  },
};

// 🔥🔥🔥🔥🔥 퀴즈 관련 API
export const quizApi = {
  // 특정 퀴즈 정보 가져오기
  async getById(testId: string, quizNumber: number) {
    return apiCall(`/api/test/${testId}/${quizNumber}`);
  },

  // 퀴즈 답안 제출
  async submitAnswer(testId: string, quizNumber: number, answer: string) {
    return apiCall(`/api/test/${testId}/${quizNumber}`, {
      method: "POST",
      body: JSON.stringify({ answer }),
    });
  },

  // 퀴즈 결과 가져오기 (사용자 답, 정답, 해설)
  async getResult(testId: string, quizNumber: number) {
    return apiCall(`/api/test/${testId}/${quizNumber}/result`);
  },
};

// 🔥🔥🔥🔥🔥 에러 처리 헬퍼
export const apiErrorHandler = {
  // 사용자 친화적 에러 메시지
  getErrorMessage(error: any): string {
    if (error.message?.includes("404")) {
      return "요청한 데이터를 찾을 수 없습니다.";
    }
    if (error.message?.includes("500")) {
      return "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
    if (error.message?.includes("Network")) {
      return "네트워크 연결을 확인해주세요.";
    }
    return error.message || "알 수 없는 오류가 발생했습니다.";
  },

  // 에러 알림 표시
  showError(error: any) {
    const message = this.getErrorMessage(error);
    alert(message); // 나중에 toast 라이브러리로 변경 가능
  },
};
