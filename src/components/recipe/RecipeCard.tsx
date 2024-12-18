"use client";

import Link from "next/link";
import Image from "next/image";
import { Recipe } from "@/types";
import { StarIcon } from "@heroicons/react/24/solid";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const defaultImage = "/image.png";

  // 디버깅을 위한 상세 로그
  console.log("=== RecipeCard 데이터 ===");
  console.log("전체 레시피:", recipe);
  console.log("titleImage:", recipe.titleImage);

  const imageUrl = recipe.titleImage || defaultImage;

  return (
    <Link href={`/recipe/${recipe._id}`} className="block max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={imageUrl}
            alt={recipe.title || "레시피 이미지"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            quality={100}
          />
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">{recipe.title}</h2>
          <p className="text-gray-600 text-base mb-6 line-clamp-2">
            {recipe.description || "레시피 설명이 없습니다."}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-2 text-gray-700 text-base">
                {recipe.averageRating ? recipe.averageRating.toFixed(1) : "0.0"}
              </span>
              <span className="text-gray-500 text-sm ml-2">
                ({recipe.totalRatings || 0}개의 평가)
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(recipe.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
