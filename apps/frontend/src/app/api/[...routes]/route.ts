import type { Method } from "better-auth/react";
import { NextRequest, NextResponse } from "next/server";
import { backendApiFetch } from "@/lib/fetch";

async function handler(request: NextRequest, method: Method) {
  let body: unknown;

  const contentType = request.headers.get("content-type");

  try {
    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else if (contentType?.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      body = await request.text();
    }
  } catch {
    body = null;
  }

  const pathname = request.nextUrl.pathname;

  try {
    const response = await backendApiFetch(pathname, {
      method,
      body,
    });

    if (response.error !== null) {
      return NextResponse.json(
        { error: response.error.message },
        {
          status: response.error.status,
        },
      );
    }

    return NextResponse.json(response.data, {
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { error: "Communication failed" },
      {
        status: 500,
      },
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
