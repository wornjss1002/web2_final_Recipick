import { connectDB } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectDB()
    const recipe = await db
      .collection('recipes')
      .findOne({ _id: new ObjectId(params.id) })

    if (!recipe) {
      return NextResponse.json(
        { error: '레시피를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(recipe)
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
