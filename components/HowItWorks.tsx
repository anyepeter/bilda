'use client'

import { motion } from 'framer-motion'
import Section from './ui/Section'
import { LayoutGrid, Sliders, Palette, Sparkles } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: LayoutGrid,
    title: 'Select Your Application Type',
    description: 'Choose from websites, SaaS apps, mobile apps, portfolios, e-commerce, dashboards, and more.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    number: '02',
    icon: Sliders,
    title: 'Choose Your Features',
    description: 'Pick the features you need: authentication, payments, dashboards, landing pages, blogs, admin panels, APIs, and more.',
    color: 'from-indigo-600 to-purple-600',
  },
  {
    number: '03',
    icon: Palette,
    title: 'Pick Your Design Style',
    description: 'Select from modern, minimal, luxury, playful, corporate, dark, light, glassmorphism, neumorphism, and more.',
    color: 'from-purple-600 to-pink-600',
  },
  {
    number: '04',
    icon: Sparkles,
    title: 'Get AI-Generated Prompts',
    description: 'Instantly receive well-structured prompts ready to use with any LLM to build your complete application.',
    color: 'from-pink-600 to-rose-600',
  },
]

export default function HowItWorks() {
  return (
    <Section id="how-it-works" className="bg-white px-4">
      <div className="text-center mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wide mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-6">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-dark-lighter max-w-2xl mx-auto">
            Four simple steps to transform your idea into a fully-functional application
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative"
          >
            {/* Connector Line (hidden on mobile, shown on desktop) */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent z-0" />
            )}

            <div className="relative bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-xl group">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-dark rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{step.number}</span>
              </div>

              {/* Icon */}

              {/* Content */}
              <h3 className="text-xl font-bold mt-2 text-dark mb-3">{step.title}</h3>
              <p className="text-dark-lighter text-sm md:text-base leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-16"
      >
        <p className="text-lg text-dark-lighter mb-2">
          Ready to build your dream project?
        </p>
        <a
          href="/prompt"
          className="inline-flex items-center text-primary font-semibold hover:underline group"
        >
          Get started now
          <svg
            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </motion.div>
    </Section>
  )
}
