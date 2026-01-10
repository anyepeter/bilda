import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface PromptSection {
  title: string
  description: string
  prompt: string
  order: number
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check usage limit
    let userUsage = await prisma.userUsage.findUnique({
      where: { userId }
    })

    if (!userUsage) {
      userUsage = await prisma.userUsage.create({
        data: {
          userId,
          usageCount: 0,
          maxUsage: 5
        }
      })
    }

    if (userUsage.usageCount >= userUsage.maxUsage) {
      return NextResponse.json(
        {
          error: `You have reached your maximum usage limit of ${userUsage.maxUsage} generations. Please contact support for more access.`,
          usageCount: userUsage.usageCount,
          maxUsage: userUsage.maxUsage
        },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      appType,
      domain,
      features,
      designStyle,
      platform,
      additionalInfo
    } = body

    // Validate required fields
    if (!appType || !domain) {
      return NextResponse.json(
        { error: 'Application type and domain are required' },
        { status: 400 }
      )
    }

    const featuresList = features && features.length > 0
      ? features.map((f: string) => `- ${f}`).join('\n')
      : '- None specified'

    // Determine tech stack based on platform
    const getTechStack = () => {
      if (platform === 'Web') {
        return {
          stack: 'Next.js, Tailwind CSS, Prisma, NeonDB, Cloudinary, Shadcn UI, Clerk Auth',
          details: `- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- UI Components: Shadcn UI
- Database: Prisma with NeonDB (PostgreSQL)
- File Storage: Cloudinary
- Authentication: Clerk Auth`
        }
      } else if (platform === 'Mobile') {
        return {
          stack: 'React Native, Expo, Firebase',
          details: `- Framework: React Native with Expo
- Backend: Firebase (Authentication, Firestore, Storage)
- Navigation: React Navigation`
        }
      } else if (platform === 'Web & Mobile') {
        return {
          stack: 'Next.js + React Native with shared backend',
          details: `Web Stack:
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- UI Components: Shadcn UI
- Database: Prisma with NeonDB (PostgreSQL)
- File Storage: Cloudinary
- Authentication: Clerk Auth

Mobile Stack:
- Framework: React Native with Expo
- Backend: Shared API endpoints from Next.js
- Authentication: Clerk Auth (shared with web)`
        }
      }
      return { stack: 'To be determined', details: '' }
    }

    const techStack = getTechStack()

    // Generate multiple comprehensive prompts
    const promptSections: PromptSection[] = []

    // Prompt 1: Project Overview & Context (NOT an implementation prompt)
    const overviewPrompt = await generatePrompt({
      title: 'Project Overview & Context',
      context: `Create a comprehensive overview prompt that provides complete context about the application we're building. This is NOT an implementation prompt - it's context for the AI assistant to understand what we're building.

Application Details:
- Type: ${appType}
- Domain/Industry: ${domain}
- Platform: ${platform}
- Design Style: ${designStyle}
- Tech Stack: ${techStack.stack}

Tech Stack Details:
${techStack.details}

Features to Implement:
${featuresList}

${additionalInfo ? `Additional Requirements:\n${additionalInfo}` : ''}

Write a prompt that:
1. Clearly describes what application we're building and who it's for (${domain})
2. Lists all the features that need to be implemented
3. Specifies the exact tech stack to use (${techStack.stack})
4. Outlines the overall architecture and structure
5. Sets coding standards and best practices for this tech stack
6. Provides any domain-specific considerations for ${domain}

This prompt should give the AI complete context about the project before we start building individual components. Write it as a clear, comprehensive briefing.`,
      order: 1
    })

    promptSections.push(overviewPrompt)

    // Prompt 2: Landing Page with Navbar & Footer (FIRST implementation prompt)
    const landingPagePrompt = await generatePrompt({
      title: 'Landing Page, Navbar & Footer',
      context: `Generate a comprehensive implementation prompt for building the landing page with navbar and footer for a ${appType} targeting ${domain}.

Reference the Project Overview:
${overviewPrompt.prompt}

Tech Stack to Use:
${techStack.details}

Design Requirements:
- Design Style: ${designStyle}
- Platform: ${platform}
- Domain: ${domain}

Create a comprehensive prompt that the AI assistant will use to BUILD the landing page. The prompt should cover:

1. Project setup (if needed for ${platform})
2. Landing page structure and sections:
   - Hero section with compelling headline for ${domain}
   - Features section highlighting key capabilities
   - Call-to-action sections
   - Any industry-specific sections for ${domain}
3. Responsive navbar with proper navigation
4. Professional footer with relevant sections
5. Styling with ${designStyle} design style
6. Mobile responsiveness
7. SEO optimization
8. Accessibility (ARIA labels, semantic HTML)
9. Integration with ${techStack.stack}

The prompt should be actionable and ready for an AI coding assistant to implement. Build on the context provided in the Project Overview.`,
      order: 2
    })

    promptSections.push(landingPagePrompt)

    // Prompts 3-N: Individual Feature Prompts (each builds on previous work)
    if (features && features.length > 0) {
      for (let i = 0; i < features.length; i++) {
        const feature = features[i]
        const previousPromptContext = i === 0
          ? `Previous work: Landing page with navbar and footer is already built.`
          : `Previous work: Landing page and ${i} feature(s) already implemented.`

        const featurePrompt = await generatePrompt({
          title: `Feature: ${feature}`,
          context: `Generate a comprehensive implementation prompt for adding the "${feature}" feature to our ${appType} for ${domain}.

Project Overview (for context):
${overviewPrompt.prompt}

Tech Stack:
${techStack.details}

Context:
${previousPromptContext}

Technical Requirements:
- Application Type: ${appType}
- Domain: ${domain}
- Platform: ${platform}
- Design Style: ${designStyle}

Create a comprehensive prompt that the AI assistant will use to IMPLEMENT this feature. The prompt should cover:

1. Feature requirements and user stories for ${domain}
2. Database schema changes (using ${platform === 'Web' ? 'Prisma + NeonDB' : platform === 'Mobile' ? 'Firebase Firestore' : 'Prisma + NeonDB for web, Firebase for mobile'}) if needed
3. API endpoints needed (if applicable)
4. Frontend implementation:
   - Components and UI
   - State management
   - Integration with existing pages
5. Backend logic and validation
6. Security considerations (authentication, authorization using ${platform === 'Web' || platform === 'Web & Mobile' ? 'Clerk Auth' : 'Firebase Auth'})
7. Error handling
8. Integration with ${techStack.stack}
9. Industry-specific requirements for ${domain}

The prompt should be actionable and build upon the existing codebase. Ensure it integrates smoothly with the already-built components.`,
          order: 3 + i
        })

        promptSections.push(featurePrompt)
      }
    }

    // Sort by order
    promptSections.sort((a, b) => a.order - b.order)

    // Increment usage count
    await prisma.userUsage.update({
      where: { userId },
      data: {
        usageCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      prompts: promptSections,
      totalPrompts: promptSections.length,
      usageCount: userUsage.usageCount + 1,
      maxUsage: userUsage.maxUsage
    })

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
      { error: error?.message || 'Failed to generate prompts. Please try again.' },
      { status: 500 }
    )
  }
}

// Helper function to generate individual prompts
async function generatePrompt({
  title,
  context,
  order
}: {
  title: string
  context: string
  order: number
}): Promise<PromptSection> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a senior software engineer and technical architect working in a big tech company. Your task is to write comprehensive, actionable prompts that AI coding assistants can use to generate high-quality code. Write prompts that include all necessary context, best practices, system design considerations, and implementation details.'
      },
      {
        role: 'user',
        content: context
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  })

  const generatedPrompt = completion.choices[0]?.message?.content || ''

  return {
    title,
    description: `Comprehensive prompt for: ${title}`,
    prompt: generatedPrompt,
    order
  }
}
