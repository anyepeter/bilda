import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { appType, domain } = body

    // Validate required fields
    if (!appType) {
      return NextResponse.json(
        { error: 'Application type is required' },
        { status: 400 }
      )
    }

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      )
    }

    // Call OpenAI API to get feature suggestions
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a senior software architect who specializes in analyzing application requirements. Your task is to research and suggest comprehensive features and functionalities for different types of applications. Be specific and practical, considering the specific industry or niche.'
        },
        {
          role: 'user',
          content: `Research and list the most important features and functionalities for a ${appType} specifically for ${domain}.

Context: This is a ${appType} targeting the ${domain} industry/niche. Consider the specific needs, workflows, and pain points of ${domain}.

Please provide:
1. Core essential features (must-have for ${domain})
2. Common additional features (nice-to-have for ${domain})
3. Advanced features (optional but valuable for ${domain})

For each feature, provide:
- Feature name (short, 2-4 words, relevant to ${domain})
- Brief description (one sentence explaining what it does and why it matters for ${domain})

Format your response as a JSON array with this structure:
[
  {
    "name": "Feature Name",
    "description": "Brief description of what this feature does",
    "category": "Essential" | "Common" | "Advanced"
  }
]

Provide 10-15 features in total. Be specific to ${appType} for ${domain}.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    })

    const responseText = completion.choices[0]?.message?.content || '{}'

    // Parse the JSON response
    let parsedResponse
    try {
      parsedResponse = JSON.parse(responseText)

      // Handle different response structures
      let features = []
      if (Array.isArray(parsedResponse)) {
        features = parsedResponse
      } else if (parsedResponse.features && Array.isArray(parsedResponse.features)) {
        features = parsedResponse.features
      } else if (parsedResponse.suggestions && Array.isArray(parsedResponse.suggestions)) {
        features = parsedResponse.suggestions
      }

      // Ensure we have valid features
      if (!features.length) {
        throw new Error('No features found in response')
      }

      return NextResponse.json({
        success: true,
        features: features,
        usage: completion.usage
      })

    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Response text:', responseText)

      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('OpenAI API Error:', error)

    // Handle specific OpenAI errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your OpenAI API key configuration.' },
        { status: 401 }
      )
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to fetch feature suggestions. Please try again.' },
      { status: 500 }
    )
  }
}
