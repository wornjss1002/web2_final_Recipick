'use client'

import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">회원가입</h1>
      <div className="max-w-md mx-auto">
        <RegisterForm />
      </div>
    </div>
  )
}
