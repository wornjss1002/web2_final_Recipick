'use client'

import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">로그인</h1>
      <div className="max-w-md mx-auto">
        <LoginForm />
      </div>
    </div>
  )
}
