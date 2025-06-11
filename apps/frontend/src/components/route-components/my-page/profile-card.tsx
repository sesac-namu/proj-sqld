import { User } from "@/types/db";
import MyPageForm from "./form";

type MyPageProfileCardProps = {
  user: User;
};

export default function MyPageProfileCard({ user }: MyPageProfileCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/20 bg-white/80 shadow-xl backdrop-blur-sm">
      {/* 프로필 헤더 */}
      <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center space-x-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/30 text-3xl font-bold shadow-lg backdrop-blur-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="mb-1 text-3xl font-bold">{user.name}</h2>
            <p className="text-lg text-blue-100">{user.email}</p>
            <div className="mt-2 flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-medium text-white">
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
                인증 완료
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 폼 컨테이너 */}
      <div className="p-8">
        <MyPageForm user={user} />
      </div>
    </div>
  );
}
