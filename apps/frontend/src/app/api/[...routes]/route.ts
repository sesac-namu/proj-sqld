import type { Method } from "better-auth/react";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest, method: Method) {
  console.log(`[Auth Route] ${method} ${request.nextUrl.pathname}`);
  let body: unknown = undefined;

  const contentType = request.headers.get("content-type");

  try {
    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else if (contentType?.includes("multipart/form-data")) {
      body = await request.formData();
    } else if (
      contentType &&
      !contentType.includes("application/x-www-form-urlencoded")
    ) {
      body = await request.text();
    }
  } catch (error) {
    console.error("Error parsing request body:", error);
  }

  const pathname = request.nextUrl.pathname;
  const url = `http://localhost:8000${pathname}`;

  try {
    // 모든 헤더를 백엔드로 전달
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Access-Control-Allow-Origin
    headers["Access-Control-Allow-Origin"] = "*"; // CORS 설정 (필요시 수정)
    headers["Access-Control-Allow-Credentials"] = "true"; // 쿠키 포함 허용

    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: "include", // 쿠키 포함
    };

    // body가 있으면 추가
    if (body !== undefined) {
      if (typeof body === "string") {
        fetchOptions.body = body;
      } else if (body instanceof FormData) {
        fetchOptions.body = body;
        // FormData의 경우 content-type 헤더를 제거 (브라우저가 자동 설정)
        delete headers["content-type"];
      } else {
        fetchOptions.body = JSON.stringify(body);
        headers["content-type"] = "application/json";
      }
    }

    console.log(`[Auth Route] Forwarding to: ${url}`);
    const res = await fetch(url, fetchOptions);

    // 응답 처리
    let responseData;
    const responseContentType = res.headers.get("content-type");

    try {
      if (responseContentType?.includes("application/json")) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }
    } catch (error) {
      console.error("Error parsing response:", error);
      responseData = null;
    }

    // 응답 헤더 복사 (특히 set-cookie 헤더)
    const responseHeaders = new Headers();
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        // set-cookie 헤더는 특별 처리
        responseHeaders.append(key, value);
      } else if (
        !["content-encoding", "content-length", "transfer-encoding"].includes(
          key.toLowerCase(),
        )
      ) {
        responseHeaders.set(key, value);
      }
    });

    console.log(`[Auth Route] Response status: ${res.status}`);
    if (res.headers.get("set-cookie")) {
      console.log(`[Auth Route] Set-Cookie: ${res.headers.get("set-cookie")}`);
    }

    return NextResponse.json(responseData, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[Auth Route] Communication failed:", error);
    return NextResponse.json(
      { error: "Communication failed" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  return handler(req, "GET");
}

export async function POST(req: NextRequest) {
  return handler(req, "POST");
}

export async function PUT(req: NextRequest) {
  return handler(req, "PUT");
}

export async function PATCH(req: NextRequest) {
  return handler(req, "PATCH");
}

export async function DELETE(req: NextRequest) {
  return handler(req, "DELETE");
}
