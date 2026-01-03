'use client'

import { motion } from 'framer-motion'
import { Sparkles, Rocket, Zap, Wand2 } from 'lucide-react'
import Navbar from '@/components/Navbar'

// Floating Icon Component
const FloatingIcon = ({
  children,
  delay = 0,
  duration = 4,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.2, 0.5, 0.2],
      y: [0, -30, 0],
      x: [0, Math.random() * 20 - 10, 0],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className={`absolute ${className}`}
  >
    {children}
  </motion.div>
)

export default function PromptPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      <Navbar />

      {/* Floating Background Icons */}
      <FloatingIcon delay={0} duration={5} className="top-20 left-10">
        <Sparkles className="w-8 h-8 text-purple-400" />
      </FloatingIcon>
      <FloatingIcon delay={0.5} duration={6} className="top-40 right-20">
        <Zap className="w-10 h-10 text-blue-400" />
      </FloatingIcon>
      <FloatingIcon delay={1} duration={5.5} className="bottom-32 left-20">
        <Wand2 className="w-9 h-9 text-pink-400" />
      </FloatingIcon>
      <FloatingIcon delay={1.5} duration={6.5} className="top-60 right-40">
        <Sparkles className="w-7 h-7 text-indigo-400" />
      </FloatingIcon>
      <FloatingIcon delay={0.8} duration={5.8} className="bottom-40 right-32">
        <Rocket className="w-8 h-8 text-orange-400" />
      </FloatingIcon>
      <FloatingIcon delay={1.2} duration={6.2} className="top-32 left-1/3">
        <Zap className="w-6 h-6 text-cyan-400" />
      </FloatingIcon>
      <FloatingIcon delay={1.8} duration={5.3} className="bottom-48 left-1/4">
        <Wand2 className="w-7 h-7 text-violet-400" />
      </FloatingIcon>
      <FloatingIcon delay={0.3} duration={6.8} className="top-72 right-1/4">
        <Sparkles className="w-9 h-9 text-fuchsia-400" />
      </FloatingIcon>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Animated Rocket */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Rocket className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
            </motion.div>
          </motion.div>

          {/* Coming Soon Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                Coming Soon
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-4 font-medium">
              Your AI Prompt Generator
            </p>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We're crafting something extraordinary. Get ready to transform your ideas into powerful AI prompts that build real applications.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
