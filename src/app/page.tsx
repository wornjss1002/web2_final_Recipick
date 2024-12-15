import RecipeCard from '@/components/recipe/RecipeCard'
import { Recipe } from '@/types'
import { connectDB } from '@/lib/mongodb'

async function getRecipes(searchQuery?: string): Promise<Recipe[]> {
  try {
    const db = await connectDB()
    const query = searchQuery
      ? { title: { $regex: searchQuery, $options: 'i' } }
      : {}

    const recipes = await db
      .collection('recipes')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return JSON.parse(JSON.stringify(recipes))
  } catch (error) {
    console.error('레시피를 가져오는 중 오류 발생:', error)
    return []
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const recipes = await getRecipes(searchParams.search)

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">최신 레시피</h1>

      <form className="mb-8">
        <input
          type="text"
          name="search"
          placeholder="레시피 검색..."
          defaultValue={searchParams.search}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {recipes.length > 0 ? (
          recipes.map((recipe: Recipe) => (
            <RecipeCard key={recipe._id.toString()} recipe={recipe} />
          ))
        ) : (
          <p>등록된 레시피가 없습니다.</p>
        )}
      </div>
    </div>
  )
}
