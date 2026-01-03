import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'PromptForge - Turn Ideas Into Apps Without Writing Code',
  description: 'Describe what you want. We generate the perfect AI prompts that build your website or app for you. Built for non-tech users, founders, creators, and entrepreneurs.',
  keywords: ['AI', 'prompt generation', 'no-code', 'website builder', 'app builder', 'AI tools'],
  authors: [{ name: 'PromptForge' }],
  openGraph: {
    title: 'PromptForge - Turn Ideas Into Apps Without Writing Code',
    description: 'Describe what you want. We generate the perfect AI prompts that build your website or app for you.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={roboto.variable}>
        <body className={roboto.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
