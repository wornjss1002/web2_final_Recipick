'use client'

import { Recipe, Rating } from '@/types'
import { Session } from 'next-auth'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useState } from 'react'

interface RecipeDetailProps {
  recipe: Recipe
  session: Session | null
}

export default function RecipeDetail({ recipe, session }: RecipeDetailProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [review, setReview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleSubmitReview = async () => {
    if (!rating) {
      alert('별점을 선택해주세요.')
      return
    }

    if (!review.trim()) {
      alert('리뷰 내용을 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/recipes/${recipe._id}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: review,
        }),
      })

      if (!response.ok) {
        throw new Error('실패하였습니다.')
      }

      setRating(0)
      setReview('')
      alert('리뷰가 등록되었습니다.')
      window.location.reload()
    } catch (error) {
      console.error('리뷰 등록 중 오류:', error)
      alert(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 레시피 헤더 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
        <div className="flex items-center justify-center gap-4 text-gray-600">
          <span>작성일: {new Date(recipe.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <div className="flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
            <span>{recipe.averageRating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* 레시피 소개 */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">레시피 소개</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          {recipe.description}
        </p>
      </div>

      {/* 재료 정보 */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">필요한 재료</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipe.ingredients.map((ingredient, i) => (
            <div
              key={i}
              className="flex items-center p-3 bg-gray-50 rounded-lg"
            >
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <div className="text-lg">
                {ingredient.name}
                {ingredient.quantity && (
                  <span className="text-gray-600 ml-2">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 조리 순서 */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">조리 순서</h2>
        <div className="space-y-8">
          {recipe.steps.map((step, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {i + 1}
              </div>
              <div className="flex-grow">
                <p className="text-lg mb-4 leading-relaxed">
                  {step.description}
                </p>
                {step.imageUrl && (
                  <div className="relative h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src={step.imageUrl}
                      alt={`조리 단계 ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 요리 팁 */}
      {recipe.tips && recipe.tips.length > 0 && recipe.tips[0] !== '' && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">요리 팁</h2>
          <ul className="space-y-3">
            {recipe.tips.map((tip, i) => (
              <li key={i} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 리뷰 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">리뷰 작성</h2>
        {session ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  {star <= (hoveredRating || rating) ? (
                    <StarIcon className="h-8 w-8 text-yellow-400" />
                  ) : (
                    <StarOutlineIcon className="h-8 w-8 text-gray-300 hover:text-yellow-400" />
                  )}
                </button>
              ))}
              {rating > 0 && (
                <span className="text-gray-600 ml-2">{rating}점</span>
              )}
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-4 border rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="이 레시피에 대한 의견을 남겨주세요..."
              rows={4}
            />

            <button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '등록 중...' : '리뷰 등록하기'}
            </button>
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p>리뷰를 작성하려면 로그인이 필요합니다.</p>
          </div>
        )}

        {recipe.ratings && recipe.ratings.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">등록된 리뷰</h3>
            <div className="space-y-4">
              {recipe.ratings.map((ratingItem: Rating, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">
                      {ratingItem.userName}
                    </span>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`h-5 w-5 ${
                            index < ratingItem.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{ratingItem.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {ratingItem.createdAt &&
                      new Date(ratingItem.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
