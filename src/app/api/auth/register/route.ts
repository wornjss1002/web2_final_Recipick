import { connectDB } from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()
    const db = await connectDB()

    // 이메일 중복 체크
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: '이미 존재하는 이메일입니다.' },
        { status: 400 }
      )
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10)

    // 사용자 생성
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    })

    return NextResponse.json(
      { message: '회원가입이 완료되었습니다.', userId: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
