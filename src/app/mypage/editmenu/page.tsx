'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Recipe {
  _id: string
  title: string // 레시피 제목
  ingredients: {
    name: string
    quantity: string
    unit: string
  }[] // 재료 목록
  steps: {
    description: string
    imageUrl: string
  }[] // 조리 단계
  time: string // 조리 시간
  difficulty: string // 난이도
}

export default function EditMenu() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const recipeId = searchParams.get('recipeId')
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 재료와 조리 단계를 추가하는 함수들
  const addIngredient = () => {
    setRecipe((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        ingredients: [
          ...prev.ingredients,
          { name: '', quantity: '', unit: '' },
        ],
      }
    })
  }

  const addStep = () => {
    setRecipe((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        steps: [...prev.steps, { description: '', imageUrl: '' }],
      }
    })
  }

  // 단계 삭제 함수 추가
  const removeStep = (indexToRemove: number) => {
    setRecipe((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        steps: prev.steps.filter((_, index) => index !== indexToRemove),
      }
    })
  }

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) return

      try {
        const response = await fetch(`/api/recipes/${recipeId}`)
        if (!response.ok) throw new Error('레시피를 불러오는데 실패했습니다')

        const data = await response.json()
        setRecipe(data)
      } catch (error) {
        console.error('Fetch error:', error)
        setError(
          error instanceof Error
            ? error.message
            : '알 수 없는 에러가 발생했습니다'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipe()
  }, [recipeId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipe) return

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      })

      if (!response.ok) throw new Error('레시피 수정에 실패했습니다')

      alert('수정이 완료되었습니다')
      router.push('/mypage')
    } catch (error) {
      alert('수정에 실패했습니다')
      setError(
        error instanceof Error ? error.message : '수정 중 오류가 발생했습니다'
      )
    }
  }

  // 이미지 업로드 함수 추가
  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/edit', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('이미지 업로드에 실패했습니다')
      const data = await response.json()
      return data.url // 업로드된 이미지의 URL 반환
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    }
  }

  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러: {error}</div>
  if (!recipe) return <div>레시피를 찾을 수 없습니다</div>

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">레시피 수정</h2>
      <form className="space-y-4 max-w-3xl mx-auto">
        <div>
          <label className="block mb-2">레시피 제목</label>
          <input
            type="text"
            value={recipe?.title || ''}
            onChange={(e) =>
              setRecipe((prev) => ({ ...prev!, title: e.target.value }))
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">재료</label>
          {recipe?.ingredients.map((ingredient, index) => (
            <div key={index} className="mb-2 flex gap-2">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => {
                  const newIngredients = [...recipe.ingredients]
                  newIngredients[index] = {
                    ...newIngredients[index],
                    name: e.target.value,
                  }
                  setRecipe({ ...recipe, ingredients: newIngredients })
                }}
                className="w-full p-2 border rounded"
                placeholder="재료명"
              />
              <input
                type="text"
                value={ingredient.quantity}
                onChange={(e) => {
                  const newIngredients = [...recipe.ingredients]
                  newIngredients[index] = {
                    ...newIngredients[index],
                    quantity: e.target.value,
                  }
                  setRecipe({ ...recipe, ingredients: newIngredients })
                }}
                className="w-24 p-2 border rounded"
                placeholder="수량"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            재료 추가
          </button>
        </div>

        <div>
          <label className="block mb-2">조리 단계</label>
          {recipe?.steps.map((step, index) => (
            <div key={index} className="mb-4 p-4 border rounded relative">
              <div className="mb-2">
                <label className="block mb-1">단계 {index + 1}</label>
                <textarea
                  value={step.description}
                  onChange={(e) => {
                    const newSteps = [...recipe.steps]
                    newSteps[index] = {
                      ...newSteps[index],
                      description: e.target.value,
                    }
                    setRecipe({ ...recipe, steps: newSteps })
                  }}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div className="mt-2">
                {step.imageUrl && (
                  <img
                    src={step.imageUrl}
                    alt={`Step ${index + 1}`}
                    className="w-32 h-32 object-cover mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      try {
                        const imageUrl = await uploadImage(e.target.files[0])
                        const newSteps = [...recipe.steps]
                        newSteps[index] = {
                          ...newSteps[index],
                          imageUrl: imageUrl,
                        }
                        setRecipe({ ...recipe, steps: newSteps })
                      } catch (error) {
                        setError('이미지 업로드에 실패했습니다')
                      }
                    }
                  }}
                  className="w-full p-2"
                />
              </div>
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                삭제
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addStep}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              단계 추가
            </button>
          </div>
        </div>

        <div className="flex gap-4 justify-end mt-6">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            수정 완료
          </button>
          <button
            type="button"
            onClick={() => router.push('/mypage')}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
