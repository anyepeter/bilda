import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get or create user usage
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

    return NextResponse.json({
      usageCount: userUsage.usageCount,
      maxUsage: userUsage.maxUsage,
      remaining: userUsage.maxUsage - userUsage.usageCount,
      canGenerate: userUsage.usageCount < userUsage.maxUsage
    })

  } catch (error: any) {
    console.error('Usage check error:', error)
    return NextResponse.json(
      { error: 'Failed to check usage' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get or create user usage
    let userUsage = await prisma.userUsage.findUnique({
      where: { userId }
    })

    if (!userUsage) {
      userUsage = await prisma.userUsage.create({
        data: {
          userId,
          usageCount: 1,
          maxUsage: 5
        }
      })
    } else {
      // Check if user has reached limit
      if (userUsage.usageCount >= userUsage.maxUsage) {
        return NextResponse.json(
          { error: 'You have reached your maximum usage limit of 5 generations' },
          { status: 403 }
        )
      }

      // Increment usage
      userUsage = await prisma.userUsage.update({
        where: { userId },
        data: {
          usageCount: {
            increment: 1
          }
        }
      })
    }

    return NextResponse.json({
      usageCount: userUsage.usageCount,
      maxUsage: userUsage.maxUsage,
      remaining: userUsage.maxUsage - userUsage.usageCount,
      canGenerate: userUsage.usageCount < userUsage.maxUsage
    })

  } catch (error: any) {
    console.error('Usage update error:', error)
    return NextResponse.json(
      { error: 'Failed to update usage' },
      { status: 500 }
    )
  }
}
