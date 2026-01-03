'use client'

//@ts-nocheck
import { motion } from 'framer-motion'
import Button from './ui/Button'
import { ArrowRight } from 'lucide-react'

// Floating Icon Component
const FloatingIcon = ({
  children,
  delay = 0,
  duration = 4,
  className = "",
  style = {}
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.3, 0.6, 0.3],
      y: [0, -20, 0],
      x: [0, Math.random() * 10 - 5, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className={`absolute ${className}`}
    style={style}
  >
    {children}
  </motion.div>
)

// Genie Character Component
const GenieCharacter = () => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8, duration: 0.8 }}
    className="mt-16 mb-8"
  >
    <motion.div
      animate={{
        y: [0, -15, 0],
        rotate: [0, 3, -3, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="inline-block"
    >
      {/* Genie SVG */}
      <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-28 md:w-32 md:h-36">
        {/* Waving hand lines */}
        <motion.path
          d="M35 35 Q30 25 25 20"
          stroke="#60A5FA"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.path
          d="M45 30 Q42 22 40 15"
          stroke="#60A5FA"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
        />

        {/* Body (cloud-like) */}
        <circle cx="60" cy="85" r="35" fill="#60A5FA"/>
        <circle cx="45" cy="75" r="25" fill="#60A5FA"/>
        <circle cx="75" cy="75" r="25" fill="#60A5FA"/>
        <circle cx="60" cy="65" r="28" fill="#60A5FA"/>

        {/* Face */}
        {/* Closed happy eyes */}
        <path d="M48 75 Q52 78 56 75" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M64 75 Q68 78 72 75" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round" fill="none"/>

        {/* Happy smile */}
        <path d="M50 85 Q60 95 70 85" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round" fill="none"/>

        {/* Left arm waving */}
        <motion.g
          animate={{
            rotate: [0, -20, 20, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ originX: '35px', originY: '70px' }}
        >
          <ellipse cx="28" cy="70" rx="12" ry="18" fill="#60A5FA" transform="rotate(-20 28 70)"/>
          <circle cx="22" cy="55" r="10" fill="#60A5FA"/>
        </motion.g>

        {/* Right arm */}
        <ellipse cx="92" cy="75" rx="12" ry="18" fill="#60A5FA" transform="rotate(20 92 75)"/>
        <circle cx="98" cy="85" r="10" fill="#60A5FA"/>

        {/* Tail/wisp */}
        <path d="M60 110 Q55 120 60 130 Q50 135 45 130 Q55 125 60 110" fill="#60A5FA"/>
      </svg>
    </motion.div>
  </motion.div>
)

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F8FAFB]">
      {/* Floating Decorative Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Left - Laptop */}
        <FloatingIcon delay={0} className="top-12 left-8 md:top-20 md:left-16 text-4xl md:text-5xl">
          <div className="opacity-60 transform -rotate-12">💻</div>
        </FloatingIcon>

        <FloatingIcon delay={1.9} className="top-1/4 left-8 md:top-40 md:left-16 text-4xl md:text-5xl">
          <div className="opacity-60 transform -rotate-72">💻</div>
        </FloatingIcon>

        {/* Top Left - Small Sparkle */}
        <FloatingIcon delay={0.3} duration={5} className="top-32 left-32 md:top-40 md:left-52 text-2xl md:text-3xl">
          <div className="text-[#87CEEB] opacity-50">✦</div>
        </FloatingIcon>

        {/* Top Center-Left - Light Bulb */}
        <FloatingIcon delay={0.5} className="top-24 left-1/4 text-4xl md:text-5xl">
          <div className="opacity-60">💡</div>
        </FloatingIcon>

        {/* Top Right - Cloud with Hand (keeping this) */}
        <FloatingIcon delay={0.7} className="top-8 right-8 md:top-16 md:right-24 text-5xl md:text-6xl">
          <div className="text-[#4A90E2] opacity-70">☁️</div>
        </FloatingIcon>

        {/* Top Right Corner - Small Blue Star */}
        <FloatingIcon delay={1} duration={6} className="top-28 right-16 md:top-36 md:right-32 text-2xl md:text-3xl">
          <div className="text-[#87CEEB] opacity-50">✨</div>
        </FloatingIcon>

        {/* Right Side - Mobile Phone */}
        <FloatingIcon delay={0.4} className="top-1/3 right-4 md:right-16 text-4xl md:text-5xl">
          <div className="opacity-60 transform rotate-12">📱</div>
        </FloatingIcon>

        {/* Right Side - Rocket */}
        <FloatingIcon delay={0.9} className="top-1/2 right-20 md:right-40 text-3xl md:text-4xl">
          <div className="opacity-60">🚀</div>
        </FloatingIcon>

        {/* Left Side - Code Symbol */}
        <FloatingIcon delay={0.6} className="top-1/3 left-4 md:left-20 text-4xl md:text-5xl">
          <div className="opacity-60 font-mono text-primary">{'</>'}</div>
        </FloatingIcon>

        {/* Left Lower - Gear/Settings */}
        <FloatingIcon delay={1.2} className="bottom-1/3 left-8 md:left-32 text-3xl md:text-4xl">
          <div className="opacity-50 transform rotate-45">⚙️</div>
        </FloatingIcon>

        {/* Bottom Left - Lightning Bolt */}
        <FloatingIcon delay={0.8} duration={5.5} className="bottom-32 left-16 md:bottom-40 md:left-24 text-2xl md:text-3xl">
          <div className="opacity-60">⚡</div>
        </FloatingIcon>

        {/* Bottom Left - Target */}
        <FloatingIcon delay={1.5} className="bottom-24 left-4 md:bottom-32 md:left-12 text-3xl md:text-4xl">
          <div className="opacity-50">🎯</div>
        </FloatingIcon>

        {/* Bottom Right - Chart/Analytics */}
        <FloatingIcon delay={1.1} className="bottom-1/4 right-8 md:right-24 text-4xl md:text-5xl">
          <div className="opacity-60">📊</div>
        </FloatingIcon>

        {/* Bottom Right - Puzzle Piece */}
        <FloatingIcon delay={0.5} duration={4.5} className="bottom-40 right-20 md:bottom-48 md:right-40 text-2xl md:text-3xl">
          <div className="opacity-60">🧩</div>
        </FloatingIcon>

        {/* Additional scattered elements */}
        <FloatingIcon delay={1.8} duration={6} className="top-2/3 left-1/4 text-2xl">
          <div className="text-[#B8E6F0] opacity-40">◇</div>
        </FloatingIcon>

        <FloatingIcon delay={2} duration={5} className="top-1/4 right-1/3 text-2xl">
          <div className="text-[#FFD1DC] opacity-40">✦</div>
        </FloatingIcon>

        {/* Desktop Computer */}
        <FloatingIcon delay={1.6} className="top-1/2 left-1/3 text-3xl md:text-4xl">
          <div className="opacity-50">🖥️</div>
        </FloatingIcon>

        {/* Package/Box */}
        <FloatingIcon delay={1.3} duration={5.5} className="bottom-1/2 right-1/4 text-3xl md:text-4xl">
          <div className="opacity-50">📦</div>
        </FloatingIcon>
      </div>

      {/* Main Content */}
      <div className="container mt-28 mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl relative z-10 py-20 md:py-24">
        <div className="text-center">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-dark mb-6 leading-tight"
          >
            Describe Your Idea.{' '}
            <span className="bg-dark bg-clip-text text-transparent">
            Get a Real App.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl lg:text-2xl text-dark-lighter mb-6 leading-relaxed"
          >
          We turn your vision into powerful AI prompts that build complete websites and applications for you.
          </motion.p>

          {/* Supporting line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base sm:text-lg text-dark-lighter/80 mb-8 md:mb-10"
          >
            Built for non-tech users, founders, creators, and entrepreneurs.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center flex-col sm:flex-row gap-4 justify-center"
          >
            <Button className="group bg-dark w-50 py-4 px-8" size='lg' asChild>
              <a href="/prompt" className='flex justify-center items-center'>
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>

          {/* Genie Character */}
          <GenieCharacter />
        </div>
      </div>
    </section>
  )
}
