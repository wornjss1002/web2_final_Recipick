import { connectDB } from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Session } from 'next-auth'

export async function GET(request: Request) {
  try {
    const db = await connectDB()
    const recipes = await db
      .collection('recipes')
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray()

    return NextResponse.json(recipes)
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null
    if (!session?.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const recipe = await request.json()
    const db = await connectDB()

    const result = await db.collection('recipes').insertOne({
      ...recipe,
      author: {
        _id: session.user.id,
        name: session.user.name || 'Unknown User',
      },
      ratings: [],
      reviews: [],
      averageRating: 0,
      createdAt: new Date(),
    })

    return NextResponse.json(
      { message: '레시피가 등록되었습니다.', recipeId: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
