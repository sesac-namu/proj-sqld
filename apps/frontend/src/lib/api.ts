// lib/api.ts

async function apiCall(url: string, options: RequestInit = {}) {
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
      } catch (e) {
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
    console.error(" API 호출 에러:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "네트워크 연결 오류: 백엔드 서버가 실행 중인지 확인해주세요.",
      );
    }

    throw error;
  }
}

export const userApi = {
  async getMe() {
    const response = await apiCall("/api/user/me");

    return response.data || response;
  },
};

export const testApi = {
  // 테스트 목록 가져오기
  async getList() {
    const response = await apiCall("/api/test");
    console.log("테스트 목록 원본 응답:", response);

    //  백엔드 응답 구조에 맞게 데이터 추출
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (
      response.data &&
      response.data.tests &&
      Array.isArray(response.data.tests)
    ) {
      return response.data.tests;
    } else if (Array.isArray(response)) {
      return response;
    }

    // 기본값으로 빈 배열 반환
    return [];
  },

  // 새 테스트 생성
  async create() {
    const response = await apiCall("/api/test/create", { method: "POST" });
    // 백엔드 응답 구조에 맞게 데이터 추출
    return response.data || response;
  },

  // 특정 테스트 정보 가져오기
  async getById(testId: string) {
    const response = await apiCall(`/api/test/${testId}`);
    // 백엔드 응답 구조에 맞게 데이터 추출
    return response.data || response;
  },

  // 테스트 완료 여부 확인
  async isFinished(testId: string) {
    const response = await apiCall(`/api/test/${testId}/is-finished`);
    // 백엔드 응답 구조에 맞게 데이터 추출
    return response.data || response;
  },

  //  퀴즈 리스트 가져오기 (백엔드 응답 구조에 맞게 수정)
  async getQuizList(testId: string) {
    const response = await apiCall(`/api/test/${testId}/quiz-list`);
    console.log("퀴즈 리스트 원본 응답:", response);

    //  백엔드에서 { data: { quizList: [...] } } 형태로 보내므로
    if (
      response.data &&
      response.data.quizList &&
      Array.isArray(response.data.quizList)
    ) {
      return response.data.quizList;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (Array.isArray(response)) {
      return response;
    }

    // 기본값으로 빈 배열 반환
    console.warn("퀴즈 리스트 형태를 인식할 수 없음:", response);
    return [];
  },

  // 테스트 결과 가져오기
  async getResult(testId: string) {
    const response = await apiCall(`/api/test/${testId}/result`);
    // 백엔드 응답 구조에 맞게 데이터 추출
    return response.data || response;
  },

  // 테스트 완료 처리
  async finish(testId: string, data?: any) {
    const response = await apiCall(`/api/test/${testId}`, {
      method: "POST",
      body: JSON.stringify(data || {}),
    });
    // 백엔드 응답 구조에 맞게 데이터 추출
    return response.data || response;
  },
};

//  퀴즈 관련 API
export const quizApi = {
  // 특정 퀴즈 정보 가져오기
  async getById(testId: string, quizNumber: number) {
    const response = await apiCall(`/api/test/${testId}/${quizNumber}`);
    // 백엔드 응답 구조에 맞게 데이터 추출
    return response.data || response;
  },

  // 퀴즈 답안 제출
  async submitAnswer(testId: string, quizNumber: number, answer: string) {
    const response = await apiCall(`/api/test/${testId}/${quizNumber}`, {
      method: "POST",
      body: JSON.stringify({ answer }),
    });
    // 백엔드 응답 구조에 맞게 데이터 추출
    return response.data || response;
  },

  // 퀴즈 결과 가져오기 (사용자 답, 정답, 해설)
  async getResult(testId: string, quizNumber: number) {
    const response = await apiCall(`/api/test/${testId}/${quizNumber}/result`);
    // 백엔드 응답 구조에 맞게 데이터 추출
    return response.data || response;
  },
};

//  에러 처리 헬퍼
export const apiErrorHandler = {
  // 사용자 친화적 에러 메시지
  getErrorMessage(error: any): string {
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
    return error.message || "알 수 없는 오류가 발생했습니다.";
  },

  // 에러 알림 표시
  showError(error: any) {
    const message = this.getErrorMessage(error);
    alert(message);
    console.error("에러 상세:", error);
  },
};

//  백엔드 상태 확인 함수
export const healthCheck = {
  // 백엔드 서버 상태 확인
  async checkServer() {
    try {
      const response = await fetch("/api/health", { method: "GET" });
      console.log("서버 상태:", response.status);
      return response.status === 200;
    } catch (error) {
      console.log("서버 연결 실패:", error);
      return false;
    }
  },

  // 각 API 엔드포인트 테스트
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
      } catch (error) {
        console.log(`${endpoint.name}: 연결 실패`);
      }
    }
  },
};
