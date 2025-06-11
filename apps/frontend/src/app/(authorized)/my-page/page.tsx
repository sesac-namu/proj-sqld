import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MyPageForm from "@/components/route-components/my-page/form";
import MyPageProfileCard from "@/components/route-components/my-page/profile-card";
import MyPageQuickAction from "@/components/route-components/my-page/quick-actions";
import MyPageStatistics from "@/components/route-components/my-page/statistics";
import { authClient } from "@/lib/auth-client";
import { serverFetch } from "@/lib/fetch";
import { userSchema } from "@/types/db";

export default async function MyPage() {
  const res = await serverFetch<{
    data: typeof userSchema;
  }>("/api/user/me", {
    headers: await headers(),
  });

  if (res.error) {
    await authClient.signOut();
    redirect("/signin");
  }

  const user = userSchema.parse(res.data.data);

  return (
    <div className="h-full min-h-[calc(100svh-64px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      {/* 배경 장식 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 메인 프로필 카드 */}
          <div className="lg:col-span-2">
            <MyPageProfileCard user={user} />
          </div>

          {/* 사이드바 - 통계 및 부가 정보 */}
          <div className="space-y-6">
            <MyPageStatistics />
            <MyPageQuickAction />
          </div>
        </div>
      </div>
    </div>
  );
}
