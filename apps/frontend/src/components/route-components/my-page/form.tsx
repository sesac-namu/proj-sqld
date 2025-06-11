"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types/db";

type MyPageFormProps = {
  user: User;
};

export default function MyPageForm({ user }: MyPageFormProps) {
  const [name, setName] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async () => {
    if (name.trim() === "") {
      return;
    }

    setIsSaving(true);
    // TODO: API 호출로 사용자 정보 업데이트
    const res = await authClient.updateUser({
      name,
    });

    if (res.error || !res.data.status) {
      console.error("사용자 정보 업데이트 실패:", res.error);
      toast.error("사용자 정보 업데이트에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    setIsSaving(false);
    setIsEditing(false);
  };

  const cancel = () => {
    setName(user.name);
    setIsEditing(false);
  };

  return (
    <form className="space-y-8">
      {/* 이메일 필드 */}
      <div className="group">
        <label className="mb-3 flex items-center text-sm font-semibold text-gray-700">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            <svg
              className="h-4 w-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </div>
          이메일 주소
        </label>
        <div className="relative">
          <div className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-4 font-medium text-gray-700 transition-all duration-200">
            {user.email}
          </div>
          <div className="absolute right-4 top-4">
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
              <svg
                className="mr-1 h-3 w-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              인증됨
            </span>
          </div>
        </div>
      </div>

      {/* 이름 필드 */}
      <div className="group">
        <label className="mb-3 flex items-center text-sm font-semibold text-gray-700">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
            <svg
              className="h-4 w-4 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          이름
        </label>
        <div className="relative">
          <input
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            disabled={!isEditing}
            className={`w-full rounded-xl border-2 px-4 py-4 font-medium transition-all duration-300 ${
              isEditing
                ? "border-blue-300 bg-white shadow-lg ring-4 ring-blue-100"
                : "border-gray-200 bg-gray-50/50 text-gray-600"
            }`}
            placeholder="이름을 입력하세요"
          />
          {isEditing && (
            <div className="absolute right-4 top-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-3 w-3 animate-pulse text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 가입일 필드 */}
      <div className="group">
        <label className="mb-3 flex items-center text-sm font-semibold text-gray-700">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            <svg
              className="h-4 w-4 text-amber-600"
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
          가입일
        </label>
        <div className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-4 font-medium text-gray-700">
          {user.createdAt.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-end space-x-4 border-t border-gray-100 pt-6">
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="group inline-flex transform cursor-pointer items-center rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:from-blue-600 hover:to-purple-700 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <svg
              className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            정보 수정하기
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={cancel}
              className="inline-flex cursor-pointer items-center rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              취소
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSaving}
              className="group inline-flex transform cursor-pointer items-center rounded-xl border border-transparent bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  저장하는 중...
                </>
              ) : (
                <>
                  <svg
                    className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  저장하기
                </>
              )}
            </button>
          </>
        )}
      </div>
    </form>
  );
}
