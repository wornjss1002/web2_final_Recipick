'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiEdit, FiTrash2 } from 'react-icons/fi'

interface RecipeActionsProps {
  recipeId: string
}

export default function RecipeActions({ recipeId }: RecipeActionsProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('삭제 실패')

      alert('레시피가 성공적으로 삭제되었습니다.')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="flex gap-4 justify-end">
      <Link
        href={`/mypage/editmenu?recipeId=${recipeId}`}
        className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
      >
        <FiEdit className="w-5 h-5" />
        <span>수정</span>
      </Link>

      <button
        onClick={handleDelete}
        aria-label="삭제"
        className="flex items-center gap-1 text-red-500 hover:text-red-600"
      >
        <FiTrash2 className="w-5 h-5" />
        <span>삭제</span>
      </button>
    </div>
  )
}
