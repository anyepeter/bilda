'use server'
import { prisma } from '@/lib/prisma'

export type SubmitSuggestionResult =
  | { status: 'success' }
  | { status: 'unauthorized' }
  | { status: 'validation_error' }
  | { status: 'error' }

export async function submitSuggestion(
  suggestion: string
): Promise<SubmitSuggestionResult> {
  try {
    if (!suggestion || suggestion.trim().length === 0) {
      return { status: 'validation_error' }
    }
    await prisma.suggestion.create({
      data: {
        suggestion: suggestion.trim(),
      },
    })

    return { status: 'success' }
  } catch (error) {
    console.error('submitSuggestion error:', error)
    return { status: 'error' }
  }
}
