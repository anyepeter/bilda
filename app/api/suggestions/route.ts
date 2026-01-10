import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { suggestion } = await request.json()

    if (!suggestion || suggestion.trim().length === 0) {
      return NextResponse.json(
        { error: 'Suggestion cannot be empty' },
        { status: 400 }
      )
    }

    const newSuggestion = await prisma.suggestion.create({
      data: {
        suggestion: suggestion.trim(),
      },
    })

    return NextResponse.json(
      {
        success: true,
        id: newSuggestion.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Suggestion submission error:', error)

    return NextResponse.json(
      { error: 'Failed to submit suggestion' },
      { status: 500 }
    )
  }
}
