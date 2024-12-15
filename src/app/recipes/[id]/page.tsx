import { connectDB } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import RecipeDetail from '@/components/recipe/RecipeDetail'
import { notFound } from 'next/navigation'

async function getRecipe(id: string) {
  try {
    const db = await connectDB()
    const recipe = await db
      .collection('recipes')
      .findOne({ _id: new ObjectId(id) })

    if (!recipe) {
      return null
    }

    return JSON.parse(JSON.stringify(recipe))
  } catch (error) {
    console.error('레시피 조회 중 오류:', error)
    return null
  }
}

export default async function RecipePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const recipe = await getRecipe(params.id)

  if (!recipe) {
    notFound()
  }

  return <RecipeDetail recipe={recipe} session={session} />
}
