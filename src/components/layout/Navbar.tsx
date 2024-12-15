'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-primary text-secondary p-4">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center relative">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            레시피 공유
          </Link>
          <h1 className="text-5xl font-bold absolute left-1/2 transform -translate-x-1/2">
            Recipick
          </h1>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/recipes/create"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  레시피 작성
                </Link>
                <Link
                  href="/mypage"
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                >
                  마이페이지
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-800"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
