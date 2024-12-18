"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gradient-to-r from-orange-500 via-orange-500 to-orange-400 shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center relative">
          <Link
            href="/"
            className="text-2xl font-bold text-orange-50 hover:text-white transition duration-300"
          >
            레시피 공유
          </Link>
          <h1 className="text-4xl font-bold absolute left-1/2 transform -translate-x-1/2 text-white drop-shadow-md">
            🍲 Recipick 👨‍🍳
          </h1>
          <div className="flex items-center space-x-6">
            {session ? (
              <>
                <Link
                  href="/recipes/create"
                  className="bg-orange-800 text-white px-4 py-2 rounded-full hover:bg-orange-900 transition duration-300 shadow-md"
                >
                  레시피 작성
                </Link>
                <Link
                  href="/mypage"
                  className="bg-orange-900 text-white px-4 py-2 rounded-full hover:bg-orange-950 transition duration-300 shadow-md"
                >
                  마이페이지
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-red-800 text-white px-4 py-2 rounded-full hover:bg-red-900 transition duration-300 shadow-md"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-orange-50 hover:text-white transition duration-300"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-orange-900 text-white px-6 py-2 rounded-full hover:bg-orange-950 transition duration-300 font-medium shadow-md"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
