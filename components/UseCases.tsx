'use client'

import { motion } from 'framer-motion'
import Section from './ui/Section'
import { Rocket, Building2, User, Users } from 'lucide-react'

const useCases = [
  {
    icon: Rocket,
    title: 'Founders Launching MVPs',
    description: 'Validate your idea fast. Build a working prototype in hours, not weeks. Perfect for getting to market quickly.',
    benefits: ['Rapid prototyping', 'Cost-effective', 'Investor-ready'],
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Building2,
    title: 'Small Businesses Building Websites',
    description: 'Professional online presence without hiring developers. Get exactly what you need, when you need it.',
    benefits: ['Professional quality', 'No ongoing costs', 'Full control'],
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: User,
    title: 'Creators Launching Personal Brands',
    description: 'Stand out with a unique portfolio, blog, or personal website that showcases your work beautifully.',
    benefits: ['Unique designs', 'Easy updates', 'Brand consistency'],
    color: 'from-orange-500 to-red-600',
  },
  {
    icon: Users,
    title: 'Agencies Speeding Up Delivery',
    description: 'Accelerate client projects. Generate consistent, high-quality prompts for your entire team.',
    benefits: ['Faster delivery', 'Consistent quality', 'Scalable workflow'],
    color: 'from-green-500 to-emerald-600',
  },
]

export default function UseCases() {
  return (
    <Section id="use-cases" className="bg-white">
      <div className="text-center mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wide mb-4">
            Perfect For Everyone
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-6">
            Who Benefits from PromptForge?
          </h2>
          <p className="text-sm md:text-lg text-dark-lighter max-w-2xl mx-auto">
            Whether you're building your first project or your hundredth, we've got you covered
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
        {useCases.map((useCase, index) => (
          <motion.div
            key={useCase.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group"
          >
            <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 lg:p-10 border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl h-full">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <useCase.icon className="w-8 h-8 text-[#60A5FA]" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-dark mb-4">
                {useCase.title}
              </h3>
              <p className="text-dark-lighter leading-relaxed text-sm md:text-base mb-6">
                {useCase.description}
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap gap-2">
                {useCase.benefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="inline-flex items-center px-3 py-1 bg-[#60A5FA]/10 text-[#60A5FA] text-sm font-medium rounded-full"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="#60A5FA"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
