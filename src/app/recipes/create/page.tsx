import React from 'react'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import RecipeForm from '@/components/recipe/RecipeForm'

export default async function CreateRecipePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Recipe</h1>
      <RecipeForm />
    </div>
  )
}
