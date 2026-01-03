'use client'

import { motion } from 'framer-motion'
import Section from './ui/Section'

// Gradient Icon Components
const SphereIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="featureSphere" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <circle cx="40" cy="40" r="30" fill="url(#featureSphere)" opacity="0.9"/>
  </svg>
)

const TriangleIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="featureTriangle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#FB923C" />
      </linearGradient>
    </defs>
    <path d="M40 15 L65 60 L15 60 Z" fill="url(#featureTriangle)" opacity="0.9"/>
  </svg>
)

const SquareGradientIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="featureSquare" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="50%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#34D399" />
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="40" height="40" rx="8" fill="url(#featureSquare)" opacity="0.9"/>
  </svg>
)

const StarIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="featureStar" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <path d="M40 15 L46 35 L67 35 L50 48 L56 68 L40 55 L24 68 L30 48 L13 35 L34 35 Z" fill="url(#featureStar)" opacity="0.9"/>
  </svg>
)

const HexagonIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="featureHexagon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#FB923C" />
      </linearGradient>
    </defs>
    <path d="M40 18 L58 28 L58 52 L40 62 L22 52 L22 28 Z" fill="url(#featureHexagon)" opacity="0.9"/>
  </svg>
)

const PentagonIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="featurePentagon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#C084FC" />
      </linearGradient>
    </defs>
    <path d="M40 15 L62 32 L53 58 L27 58 L18 32 Z" fill="url(#featurePentagon)" opacity="0.9"/>
  </svg>
)

const features = [
  {
    icon: SphereIcon,
    title: 'No Technical Knowledge Required',
    description: 'Built for everyone. No coding, no tech jargon, just simple choices that create powerful results.',
  },
  {
    icon: TriangleIcon,
    title: 'Smart Prompt Engineering',
    description: 'Our AI understands your needs and generates perfectly structured prompts that LLMs love.',
  },
  {
    icon: SquareGradientIcon,
    title: 'Optimized for Modern AI',
    description: 'Works seamlessly with ChatGPT, Claude, and all major LLMs. One prompt, unlimited possibilities.',
  },
  {
    icon: StarIcon,
    title: 'Saves Weeks of Development',
    description: 'Skip the learning curve. Go from idea to working application in minutes, not months.',
  },
  {
    icon: HexagonIcon,
    title: 'Iterate & Refine Instantly',
    description: 'Not happy with the result? Adjust your preferences and get a new prompt in seconds.',
  },
  {
    icon: PentagonIcon,
    title: 'Full-Stack Ready',
    description: 'Get prompts for complete applications with frontend, backend, databases, and deployment.',
  },
]

export default function Features() {
  return (
    <Section id="features" className="bg-[#F8FAFB]">
      <div className="text-center mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wide mb-4">
            Why Choose PromptForge
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-6">
            Everything You Need to Build Faster
          </h2>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 max-w-5xl mx-auto">
        {features.map((feature, index) => {
          const IconComponent = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              {/* Gradient Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mb-6"
              >
                <IconComponent />
              </motion.div>

              {/* Title */}
              <h3 className="text-xl font-bold text-dark mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-dark-lighter/70 leading-relaxed text-sm md:text-base max-w-xs">
                {feature.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
