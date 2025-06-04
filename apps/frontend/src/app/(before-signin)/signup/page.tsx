"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const [formError, setFormError] = useState<{
    email: boolean;
    name: boolean;
    password: boolean;
    passwordConfirm: boolean;
  }>({
    email: false,
    name: false,
    password: false,
    passwordConfirm: false,
  });

  const verifyPassword = () => {
    // TODO add password verification
    return password === passwordConfirm;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const error = {
      email: false,
      name: false,
      password: false,
      passwordConfirm: false,
    };

    if (!verifyPassword()) {
      error.passwordConfirm = true;
    }

    setFormError(error);

    if (error.email || error.name || error.password || error.passwordConfirm) {
      return;
    }

    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: (ctx) => {
          router.replace("/");
        },
        onError: (ctx) => {
          setLoading(false);
          toast.error("회원가입에 실패하였습니다");
          setErrorMessage(ctx.error.error);
        },
      },
    );
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-8 text-center text-3xl font-bold text-slate-700">
        회원가입
      </h1>
      <form className="space-y-6" onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-600"
          >
            이름
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            data-error={formError.name}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-600"
          >
            이메일
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            data-error={formError.email}
          />
        </div>
        <div>
          <label
            htmlFor="``password"
            className="block text-sm font-medium text-slate-600"
          >
            비밀번호
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            data-error={formError.password}
          />
        </div>
        <div>
          <label
            htmlFor="passwordConfirm"
            className="block text-sm font-medium text-slate-600"
          >
            비밀번호 확인
          </label>
          <input
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            required
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
            data-error={formError.passwordConfirm}
          />
        </div>
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading && (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                    opacity=".25"
                  />
                  <path
                    fill="currentColor"
                    d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
                  >
                    <animateTransform
                      attributeName="transform"
                      dur="0.75s"
                      repeatCount="indefinite"
                      type="rotate"
                      values="0 12 12;360 12 12"
                    />
                  </path>
                </svg>
              </>
            )}
            {!loading && "가입하기"}
          </button>
          {errorMessage !== "" && (
            <p className="text-right text-sm text-red-500">{errorMessage}</p>
          )}
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/signin"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}
