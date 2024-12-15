"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload"; // ImageUpload 컴포넌트를 임포트

export default function RecipeForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    titleImage: "", // 타이틀 이미지를 저장할 필드 추가
    ingredients: [{ name: "", quantity: "", unit: "" }],
    steps: [{ description: "", imageUrl: "" }],
    tips: [""],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("레시피 생성에 실패했습니다.");
      }

      const data = await response.json();
      console.log("생성된 레시피 데이터:", data);

      if (!data._id) {
        throw new Error("레시피 ID가 없습니다.");
      }

      // 24자리 16진수 문자열인지 확인
      if (!/^[0-9a-fA-F]{24}$/.test(data._id)) {
        throw new Error("유효하지 않은 레시피 ID입니다.");
      }

      router.push(`/recipe/${data._id}`);
      router.refresh();
    } catch (error) {
      console.error("레시피 생성 중 오류:", error);
      alert("레시피 생성에 실패했습니다.");
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        { name: "", quantity: "", unit: "" },
      ],
    });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { description: "", imageUrl: "" }],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* 타이틀 이미지 업로드 폼 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            타이틀 이미지
          </label>
          <ImageUpload
            stepIndex={0}
            onUpload={(url: string) =>
              setFormData({ ...formData, titleImage: url })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            레시피 제목
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            레시피 설명
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        {/* 재료 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            재료
          </label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="재료명"
                value={ingredient.name}
                onChange={(e) => {
                  const newIngredients = [...formData.ingredients];
                  newIngredients[index].name = e.target.value;
                  setFormData({ ...formData, ingredients: newIngredients });
                }}
                className="flex-1 rounded-md border-gray-300"
                required
              />
              <input
                type="text"
                placeholder="수량"
                value={ingredient.quantity}
                onChange={(e) => {
                  const newIngredients = [...formData.ingredients];
                  newIngredients[index].quantity = e.target.value;
                  setFormData({ ...formData, ingredients: newIngredients });
                }}
                className="w-24 rounded-md border-gray-300"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 text-blue-500 hover:text-blue-600"
          >
            + 재료 추가
          </button>
        </div>

        {/* 요리 순서 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            요리 순서
          </label>
          {formData.steps.map((step, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{index + 1}.</span>
                <textarea
                  value={step.description}
                  onChange={(e) => {
                    const newSteps = [...formData.steps];
                    newSteps[index].description = e.target.value;
                    setFormData({ ...formData, steps: newSteps });
                  }}
                  className="flex-1 rounded-md border-gray-300"
                  rows={2}
                  required
                />
              </div>
              <ImageUpload
                stepIndex={index}
                onUpload={(url: string) => {
                  const newSteps = [...formData.steps];
                  newSteps[index].imageUrl = url;
                  setFormData({ ...formData, steps: newSteps });
                }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="mt-2 text-blue-500 hover:text-blue-600"
          >
            + 순서 추가
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          레시피 등록
        </button>
      </div>
    </form>
  );
}
