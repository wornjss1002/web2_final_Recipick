import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 파일 저장 경로 설정 (public 폴더 내 uploads 디렉토리)
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const filename = uniqueSuffix + path.extname(file.name)
    const filepath = path.join(uploadDir, filename)

    await writeFile(filepath, buffer)

    return NextResponse.json({
      url: `/uploads/${filename}`,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
