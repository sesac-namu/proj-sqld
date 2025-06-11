// lib/types.ts

// 사용자 정보의 구조를 미리 정의
export interface User {
  id: string;
  name: string;
  email: string;
}

// 다른 타입들도 나중에 여기에 추가할 예정
export interface Test {
  id: string;
  title: string;
  createdAt: string;
  isFinished: boolean;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  // 등등...
}
