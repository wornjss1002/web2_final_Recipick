import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

interface Rating {
  _id?: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { rating, comment } = await req.json();

    // 유효성 검사
    if (!rating || !comment) {
      return NextResponse.json(
        { error: "별점과 리뷰 내용을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const db = await connectDB();

    // 레시피 존재 여부 확인
    const recipe = await db
      .collection("recipes")
      .findOne({ _id: new ObjectId(params.id) });

    if (!recipe) {
      return NextResponse.json(
        { error: "레시피를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 이미 리뷰를 작성했는지 확인
    const existingRating = await db.collection("recipes").findOne({
      _id: new ObjectId(params.id),
      "ratings.userId": session.user.id,
    });

    if (existingRating) {
      return NextResponse.json(
        { error: "이미 리뷰를 작성하셨습니다." },
        { status: 400 }
      );
    }

    // 새 리뷰 추가
    const newRating: Rating = {
      userId: session.user.id,
      userName: session.user.name || "익명",
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const updateResult = await db.collection("recipes").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $push: {
          ratings: newRating,
        } as any,
        $inc: {
          totalRatings: 1,
        },
      }
    );

    if (!updateResult.modifiedCount) {
      return NextResponse.json(
        { error: "리뷰 등록에 실패했습니다." },
        { status: 500 }
      );
    }

    // 평균 평점 업데이트
    const updatedRecipe = await db
      .collection("recipes")
      .findOne({ _id: new ObjectId(params.id) });

    if (!updatedRecipe) {
      return NextResponse.json(
        { error: "레시피 업데이트 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    const averageRating =
      updatedRecipe.ratings.reduce(
        (acc: number, curr: Rating) => acc + curr.rating,
        0
      ) / updatedRecipe.ratings.length;

    await db.collection("recipes").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          averageRating: Number(averageRating.toFixed(1)),
        },
      }
    );

    return NextResponse.json({
      message: "리뷰가 성공적으로 등록되었습니다.",
      rating: newRating,
    });
  } catch (error) {
    console.error("리뷰 등록 중 오류:", error);
    return NextResponse.json(
      { error: "리뷰 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
