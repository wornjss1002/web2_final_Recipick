import { ObjectId } from 'mongodb'

export interface User {
  _id: ObjectId
  name: string
  email: string
  image?: string
  recipes?: ObjectId[]
  favorites?: ObjectId[]
  createdAt: Date
}

export interface Ingredient {
  name: string
  quantity: number
  unit: string
}

export interface RecipeImage {
  imageUrl: string
  description?: string
}

export interface Step {
  description: string
  imageUrl?: string
}

export interface Recipe {
  _id: string
  title: string
  titleImage?: string
  description: string
  ingredients: Ingredient[]
  steps: Step[]
  tips: string[]
  images: RecipeImage[]
  ratings: Rating[]
  averageRating: number
  totalRatings: number
  createdAt: Date
  updatedAt: Date
}

// 통합된 Rating 인터페이스
export interface Rating {
  _id?: string // 통합된 Rating 인터페이스는 이전 두 개의 인터페이스를 기반으로 정의
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt?: Date // createdAt을 추가하여 Review와 동일하게 맞춤
}

export interface Review {
  _id: ObjectId
  recipeId: ObjectId
  userId: ObjectId
  userName: string
  userImage?: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}
