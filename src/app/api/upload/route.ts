import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: 'dod15xexv',
  api_key: '796988856348751',
  api_secret: '47-e3UEAFUEheUPLQn0WG2ENwjg',
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data, imageType, stepIndex } = body

    // 이미지 타입 검증
    if (!imageType || !['title', 'step'].includes(imageType)) {
      return NextResponse.json(
        { error: '잘못된 이미지 타입입니다.' },
        { status: 400 }
      )
    }

    const uploadResponse = await cloudinary.uploader.upload(data, {
      upload_preset: 'ml_default',
      folder: imageType === 'step' ? 'recipe-steps' : 'recipe-titles',
    })

    return NextResponse.json({
      ...uploadResponse,
      imageType,
      stepIndex,
    })
  } catch (error) {
    console.error('업로드 에러:', error)
    return NextResponse.json({ error: '이미지 업로드 실패' }, { status: 500 })
  }
}
