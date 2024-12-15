import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import RecipeActions from "@/app/mypage/RecipeActions";
import Link from "next/link";

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const db = await connectDB();
  const recipes = await db
    .collection("recipes")
    .find({ userId: session.user.id })
    .toArray();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">내 정보</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <p>이름: {session.user.name || "이름 없음"}</p>
          <p>이메일: {session.user.email}</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">내가 작성한 레시피</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe._id.toString()}
              className="bg-white p-4 rounded-lg shadow"
            >
              <h3 className="font-semibold mb-2">{recipe.title}</h3>
              <p className="text-gray-600 mb-4">{recipe.description}</p>
              <div className="flex items-center gap-4">
                <Link
                  href={`/recipe/${recipe._id.toString()}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  자세히 보기
                </Link>
                <RecipeActions recipeId={recipe._id.toString()} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
