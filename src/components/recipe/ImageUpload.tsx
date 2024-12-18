'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Props {
  stepIndex: number
  type: 'title' | 'step'
  onUpload: (url: string) => void
}

export default function ImageUpload({ stepIndex, type, onUpload }: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const uploadId = `image-upload-${type}-${stepIndex}`

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.')
      return
    }

    try {
      setError(null)
      setUploading(true)

      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      const base64 = await convertToBase64(file)

      const requestData = {
        data: base64,
        imageType: type,
        stepIndex: type === 'step' ? stepIndex : -1,
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error('이미지 업로드에 실패했습니다.')
      }

      const data = await response.json()

      if (data.imageType !== type) {
        throw new Error('이미지 타입이 일치하지 않습니다.')
      }

      if (type === 'step' && data.stepIndex !== stepIndex) {
        throw new Error('스텝 인덱스가 일치하지 않습니다.')
      }

      onUpload(data.secure_url)
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      setError('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        {preview ? (
          <div className="relative w-full max-w-md aspect-video">
            <Image
              src={preview}
              alt="미리보기"
              fill
              className="object-cover rounded-lg"
            />
            <button
              onClick={() => {
                setPreview(null)
                setError(null)
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
              id={uploadId}
            />
            <label
              htmlFor={uploadId}
              className="flex flex-col items-center cursor-pointer p-4"
            >
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="mt-2 text-gray-500">
                {uploading ? '업로드 중...' : '이미지를 선택하세요'}
              </span>
              <span className="mt-1 text-sm text-gray-400">
                최대 5MB, 이미지 파일만 가능
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
