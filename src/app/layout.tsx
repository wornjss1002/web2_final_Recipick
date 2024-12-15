import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import AuthProvider from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '레시피 공유 플랫폼',
  description: '맛있는 레시피를 공유해보세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
