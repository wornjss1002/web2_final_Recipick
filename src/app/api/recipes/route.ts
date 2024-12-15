import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Step } from "@/types";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { title, description, ingredients, steps, tips } = data;

    if (!title || !description || !ingredients || !steps) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const recipe = await db.collection("recipes").insertOne({
      userId: session.user.id,
      title,
      description,
      ingredients,
      steps,
      tips: tips || [],
      createdAt: new Date(),
      ratings: [],
      averageRating: 0,
      totalRatings: 0,
      reviews: [],
      images: steps
        .filter((step: Step) => step.imageUrl)
        .map((step: Step) => ({
          imageUrl: step.imageUrl,
          description: step.description,
        })),
    });

    return NextResponse.json({
      _id: recipe.insertedId.toString(),
      message: "레시피가 성공적으로 생성되었습니다.",
    });
  } catch (error) {
    console.error("레시피 생성 중 오류:", error);
    return NextResponse.json(
      { error: "레시피 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
