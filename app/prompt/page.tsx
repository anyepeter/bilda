'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, RefreshCw, CheckCircle2, Loader2, ChevronDown, ChevronUp, Plus, X, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Label from '@/components/ui/Label'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Input from '@/components/ui/Input'

interface Feature {
  name: string
  description: string
  category?: string
}

interface PromptSection {
  title: string
  description: string
  prompt: string
  order: number
}

interface FormData {
  appType: string
  customAppType: string
  domain: string
  features: string[]
  customFeatures: string[]
  designStyle: string
  platform: string
  additionalInfo: string
}

export default function PromptGeneratorPage() {
  const [formData, setFormData] = useState<FormData>({
    appType: '',
    customAppType: '',
    domain: '',
    features: [],
    customFeatures: [],
    designStyle: '',
    platform: '',
    additionalInfo: ''
  })

  const [suggestedFeatures, setSuggestedFeatures] = useState<Feature[]>([])
  const [isFetchingFeatures, setIsFetchingFeatures] = useState(false)
  const [featuresError, setFeaturesError] = useState<string>('')
  const [showFeatures, setShowFeatures] = useState(false)

  const [generatedPrompts, setGeneratedPrompts] = useState<PromptSection[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [usageInfo, setUsageInfo] = useState<{ usageCount: number; maxUsage: number } | null>(null)

  // Fetch usage info on mount
  useEffect(() => {
    fetchUsageInfo()
  }, [])

  const fetchUsageInfo = async () => {
    try {
      const response = await fetch('/api/usage')
      const data = await response.json()
      if (response.ok) {
        setUsageInfo({ usageCount: data.usageCount, maxUsage: data.maxUsage })
      }
    } catch (error) {
      console.error('Failed to fetch usage info:', error)
    }
  }

  // Expanded categories state
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Essential': true,
    'Common': false,
    'Advanced': false
  })

  // Custom feature input
  const [customFeatureInput, setCustomFeatureInput] = useState('')

  // Domain placeholders based on app type
  const getDomainPlaceholder = (appType: string): string => {
    const placeholders: Record<string, string> = {
      'Website': 'e.g., restaurant, fitness studio, law firm, photography',
      'E-commerce Store': 'e.g., fashion clothing, electronics, handmade crafts, pet supplies',
      'SaaS Application': 'e.g., project management, accounting, CRM, email marketing',
      'Mobile App': 'e.g., food delivery, workout tracking, language learning, meditation',
      'Admin Dashboard': 'e.g., inventory management, customer analytics, content moderation',
      'Blog/Content Platform': 'e.g., tech news, cooking recipes, travel stories, personal finance',
      'Social Media Platform': 'e.g., photographers, developers, book lovers, gamers',
      'Portfolio Website': 'e.g., graphic designer, photographer, writer, architect',
      'Learning Management System': 'e.g., corporate training, online courses, K-12 education',
      'Other': 'e.g., What specific industry or niche?'
    }
    return placeholders[appType] || 'e.g., What specific industry or niche?'
  }

  // Get the actual app type (either selected or custom)
  const getActualAppType = () => {
    return formData.appType === 'Other' ? formData.customAppType : formData.appType
  }

  // Handle Next button click to fetch features
  const handleNext = async () => {
    const actualAppType = getActualAppType()

    // Validation
    if (!actualAppType || !formData.domain) {
      setError('Please fill in the application type and domain before proceeding')
      return
    }

    setError('')
    await fetchFeatureSuggestions(actualAppType, formData.domain)
  }

  // Fetch feature suggestions from AI
  const fetchFeatureSuggestions = async (appType: string, domain: string) => {
    setIsFetchingFeatures(true)
    setFeaturesError('')
    setSuggestedFeatures([])
    setFormData(prev => ({ ...prev, features: [] }))
    setShowFeatures(false)

    try {
      const response = await fetch('/api/suggest-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appType, domain }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch feature suggestions')
      }

      setSuggestedFeatures(data.features)
      setShowFeatures(true)
    } catch (err: any) {
      setFeaturesError(err.message || 'Failed to load features. Please try again.')
    } finally {
      setIsFetchingFeatures(false)
    }
  }

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  // Handle feature toggle
  const handleFeatureToggle = (featureName: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureName)
        ? prev.features.filter(f => f !== featureName)
        : [...prev.features, featureName]
    }))
  }

  // Add custom feature
  const addCustomFeature = () => {
    if (customFeatureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        customFeatures: [...prev.customFeatures, customFeatureInput.trim()]
      }))
      setCustomFeatureInput('')
    }
  }

  // Remove custom feature
  const removeCustomFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customFeatures: prev.customFeatures.filter((_, i) => i !== index)
    }))
  }

  // Handle form submission
  const handleGenerate = async () => {
    const actualAppType = getActualAppType()

    // Validation
    if (!actualAppType || !formData.domain || !formData.designStyle || !formData.platform) {
      setError('Please fill in all required fields (Application Type, Domain, Design Style, and Platform)')
      return
    }

    if (formData.features.length === 0 && formData.customFeatures.length === 0) {
      setError('Please select at least one feature or add a custom feature for your application')
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedPrompts([])
    setGenerationProgress('Initializing...')

    try {
      // Combine suggested and custom features
      const allFeatures = [...formData.features, ...formData.customFeatures]
      const totalPrompts = 2 + allFeatures.length // Setup + Landing Page + Features

      // Progress updates
      const progressTimeout1 = setTimeout(() => {
        setGenerationProgress(`Writing Prompt 1/${totalPrompts} (Project Overview)...`)
      }, 500)

      const progressTimeout2 = setTimeout(() => {
        setGenerationProgress(`Writing Prompt 2/${totalPrompts} (Landing Page)...`)
      }, 3000)

      const progressTimeout3 = setTimeout(() => {
        setGenerationProgress(`Writing Feature Prompts (3-${totalPrompts})...`)
      }, 6000)

      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appType: actualAppType,
          domain: formData.domain,
          features: allFeatures,
          designStyle: formData.designStyle,
          platform: formData.platform,
          additionalInfo: formData.additionalInfo
        }),
      })

      // Clear all timeouts
      clearTimeout(progressTimeout1)
      clearTimeout(progressTimeout2)
      clearTimeout(progressTimeout3)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prompt')
      }

      setGenerationProgress(`Finalizing ${data.prompts.length} prompts...`)
      setGeneratedPrompts(data.prompts)

      // Update usage info
      if (data.usageCount !== undefined && data.maxUsage !== undefined) {
        setUsageInfo({ usageCount: data.usageCount, maxUsage: data.maxUsage })
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the prompts')
    } finally {
      setIsGenerating(false)
      setGenerationProgress('')
    }
  }

  // Copy to clipboard
  const handleCopy = async (promptText: string, index: number) => {
    try {
      await navigator.clipboard.writeText(promptText)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      appType: '',
      customAppType: '',
      domain: '',
      features: [],
      customFeatures: [],
      designStyle: '',
      platform: '',
      additionalInfo: ''
    })
    setSuggestedFeatures([])
    setGeneratedPrompts([])
    setError('')
    setFeaturesError('')
    setCustomFeatureInput('')
    setShowFeatures(false)
  }

  // Group features by category
  const groupedFeatures = suggestedFeatures.reduce((acc, feature) => {
    const category = feature.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(feature)
    return acc
  }, {} as Record<string, Feature[]>)

  const categoryOrder = ['Essential', 'Common', 'Advanced', 'Other']

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Generate Your App Prompt
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Answer a few simple questions and we'll create a detailed AI prompt that guides you through building your application step by step.
          </p>

          {/* Usage Counter */}
          {usageInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#BDE8F5] border border-[#4988C4] rounded-full"
            >
              <span className="text-sm font-semibold text-[#0F2854]">
                Generations: {usageInfo.usageCount} / {usageInfo.maxUsage}
              </span>
              {usageInfo.usageCount >= usageInfo.maxUsage && (
                <span className="text-xs text-red-600 font-medium">(Limit Reached)</span>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-4 sm:p-6 md:p-8 shadow-xl border-gray-200">
            <div className="space-y-6 md:space-y-8">
              {/* Section 1: Application Type */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-3"
              >
                <Label htmlFor="appType" className="text-base font-semibold text-gray-900">
                  What type of application do you want to build? <span className="text-red-500">*</span>
                </Label>
                <Select
                  id="appType"
                  value={formData.appType}
                  onChange={(e) => {
                    setFormData({ ...formData, appType: e.target.value, customAppType: '' })
                    setShowFeatures(false)
                    setSuggestedFeatures([])
                  }}
                  className="text-base"
                >
                  <option value="">Select application type...</option>
                  <option value="Website">Website</option>
                  <option value="E-commerce Store">E-commerce Store</option>
                  <option value="SaaS Application">SaaS Application</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Admin Dashboard">Admin Dashboard</option>
                  <option value="Blog/Content Platform">Blog/Content Platform</option>
                  <option value="Social Media Platform">Social Media Platform</option>
                  <option value="Portfolio Website">Portfolio Website</option>
                  <option value="Learning Management System">Learning Management System</option>
                  <option value="Other">Other (Specify)</option>
                </Select>
              </motion.div>

              {/* Custom App Type Input (if Other is selected) */}
              <AnimatePresence>
                {formData.appType === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <Label htmlFor="customAppType" className="text-base font-semibold text-gray-900">
                      Specify your application type <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="customAppType"
                      value={formData.customAppType}
                      onChange={(e) => setFormData({ ...formData, customAppType: e.target.value })}
                      placeholder="e.g., Event Management System, Booking Platform, etc."
                      className="text-base"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Section 2: Domain/Niche */}
              <AnimatePresence>
                {formData.appType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <Label htmlFor="domain" className="text-base font-semibold text-gray-900">
                      What is your application for? <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="domain"
                      value={formData.domain}
                      onChange={(e) => {
                        setFormData({ ...formData, domain: e.target.value })
                        setShowFeatures(false)
                        setSuggestedFeatures([])
                      }}
                      placeholder={getDomainPlaceholder(formData.appType)}
                      className="text-base"
                    />
                    <p className="text-sm text-gray-500">
                      Be specific about your industry or niche to get more tailored features
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next Button */}
              <AnimatePresence>
                {formData.appType && formData.domain && !showFeatures && !isFetchingFeatures && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      onClick={handleNext}
                      className="w-full sm:w-auto bg-[#1C4D8D] hover:bg-[#0F2854] text-white"
                      size="lg"
                    >
                      Next: Find Features
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading State for Features */}
              <AnimatePresence>
                {isFetchingFeatures && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center"
                  >
                    <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-blue-600" />
                    <p className="text-blue-800 font-medium">
                      Researching features for your {getActualAppType()} for {formData.domain}...
                    </p>
                    <p className="text-blue-600 text-sm mt-2">
                      AI is analyzing the best features and functionalities
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Features Error */}
              <AnimatePresence>
                {featuresError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                  >
                    {featuresError}
                    <Button
                      onClick={handleNext}
                      variant="outline"
                      size="sm"
                      className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
                    >
                      Try Again
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Section 3: AI-Suggested Features with Accordions */}
              <AnimatePresence>
                {showFeatures && suggestedFeatures.length > 0 && !isFetchingFeatures && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <Label className="text-base font-semibold text-green-900">
                          AI-Suggested Features for {getActualAppType()}
                        </Label>
                      </div>
                      <p className="text-sm text-green-700">
                        Based on research for {formData.domain}, here are the recommended features. Select the ones you need.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {categoryOrder.map(category => {
                        const features = groupedFeatures[category]
                        if (!features || features.length === 0) return null

                        const isExpanded = expandedCategories[category]
                        const selectedCount = features.filter(f => formData.features.includes(f.name)).length

                        return (
                          <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-2 border-gray-200 rounded-lg overflow-hidden"
                          >
                            {/* Accordion Header */}
                            <button
                              onClick={() => toggleCategory(category)}
                              className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <h3 className="text-base font-semibold text-gray-900">
                                  {category}
                                </h3>
                                <span className="text-sm text-gray-500">
                                  ({selectedCount}/{features.length} selected)
                                </span>
                              </div>
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              </motion.div>
                            </button>

                            {/* Accordion Content */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-3 sm:p-4 pt-0 space-y-2 sm:space-y-3 bg-gray-50">
                                    {features.map((feature, index) => (
                                      <motion.div
                                        key={`${category}-${index}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03, duration: 0.3 }}
                                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                          formData.features.includes(feature.name)
                                            ? 'border-[#1C4D8D] bg-[#BDE8F5]'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                        onClick={() => handleFeatureToggle(feature.name)}
                                      >
                                        <div className="flex items-start gap-3">
                                          <input
                                            type="checkbox"
                                            checked={formData.features.includes(feature.name)}
                                            onChange={(e) => {
                                              e.stopPropagation()
                                              handleFeatureToggle(feature.name)
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1C4D8D] cursor-pointer focus:ring-2 focus:ring-[#4988C4]"
                                          />
                                          <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm sm:text-base">{feature.name}</p>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{feature.description}</p>
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Custom Features Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white"
                    >
                      <Label className="text-base font-semibold text-gray-900 mb-3 block">
                        Add Your Own Features (Optional)
                      </Label>
                      <p className="text-sm text-gray-500 mb-4">
                        Don't see a feature you need? Add it manually below.
                      </p>

                      {/* Custom features list */}
                      {formData.customFeatures.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {formData.customFeatures.map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center gap-3 p-3 bg-[#BDE8F5] border border-[#4988C4] rounded-lg"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#1C4D8D] flex-shrink-0" />
                              <span className="flex-1 text-gray-900 text-sm sm:text-base">{feature}</span>
                              <button
                                onClick={() => removeCustomFeature(index)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Add custom feature input */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          value={customFeatureInput}
                          onChange={(e) => setCustomFeatureInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()}
                          placeholder="e.g., Real-time chat, Video conferencing"
                          className="flex-1 text-sm sm:text-base"
                        />
                        <Button
                          onClick={addCustomFeature}
                          variant="outline"
                          className="border-[#4988C4] text-[#1C4D8D] hover:bg-[#BDE8F5] w-full sm:w-auto"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Feature
                        </Button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                    >
                      <p className="text-sm text-blue-800">
                        <strong>💡 Tip:</strong> Select features from the categories above or add your own custom features. You can choose as many as you need!
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rest of the form - only show after features are loaded */}
              <AnimatePresence>
                {showFeatures && suggestedFeatures.length > 0 && !isFetchingFeatures && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="space-y-6 md:space-y-8 pt-6 border-t-2 border-gray-200"
                  >
                    {/* Section 4: Design & Platform */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        <Label htmlFor="designStyle" className="text-base font-semibold text-gray-900">
                          Design Style <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          id="designStyle"
                          value={formData.designStyle}
                          onChange={(e) => setFormData({ ...formData, designStyle: e.target.value })}
                        >
                          <option value="">Select style...</option>
                          <option value="Modern">Modern</option>
                          <option value="Minimal">Minimal</option>
                          <option value="Dark">Dark Mode</option>
                          <option value="Corporate">Corporate</option>
                          <option value="Playful">Playful</option>
                          <option value="Elegant">Elegant</option>
                        </Select>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        <Label htmlFor="platform" className="text-base font-semibold text-gray-900">
                          Target Platform <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          id="platform"
                          value={formData.platform}
                          onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                        >
                          <option value="">Select platform...</option>
                          <option value="Web">Web</option>
                          <option value="Mobile">Mobile</option>
                          <option value="Web & Mobile">Web & Mobile</option>
                        </Select>
                      </motion.div>
                    </div>

                    {/* Section 5: Additional Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="space-y-3"
                    >
                      <Label htmlFor="additionalInfo" className="text-base font-semibold text-gray-900">
                        Any additional details? (Optional)
                      </Label>
                      <p className="text-sm text-gray-500 mb-3">
                        Specific integrations, requirements, or preferences you have in mind
                      </p>
                      <Textarea
                        id="additionalInfo"
                        placeholder="e.g., I need integration with Stripe for payments, user roles (admin, customer), email notifications..."
                        value={formData.additionalInfo}
                        onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                        rows={4}
                        className="text-base"
                      />
                    </motion.div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Generate Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex-1 bg-[#1C4D8D] hover:bg-[#0F2854] text-white text-base py-6"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin flex-shrink-0" />
                            <span className="text-sm sm:text-base">{generationProgress}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate My Prompts
                          </>
                        )}
                      </Button>

                      {generatedPrompts.length > 0 && (
                        <Button
                          onClick={handleReset}
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          size="lg"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </Button>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* Output Section - Multiple Prompts */}
        <AnimatePresence>
          {generatedPrompts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-8 space-y-6"
            >
              {/* Header */}
              <Card className="p-4 sm:p-6 md:p-8 shadow-xl border-2 border-[#4988C4] bg-gradient-to-br from-[#BDE8F5] to-white">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-[#1C4D8D] flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0F2854] mb-2">
                      Your Comprehensive Prompts Are Ready!
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 mb-3">
                      We've generated {generatedPrompts.length} comprehensive prompts for building your {getActualAppType()} for {formData.domain}.
                    </p>
                    <div className="bg-[#1C4D8D] bg-opacity-10 border-l-4 border-[#1C4D8D] p-3 rounded">
                      <p className="text-sm font-semibold text-[#0F2854] mb-1">
                        ⚡ Important: Follow Step-by-Step
                      </p>
                      <p className="text-xs sm:text-sm text-[#1C4D8D]">
                        Copy and use each prompt in order (1 → {generatedPrompts.length}) with your AI coding assistant. Complete each step before moving to the next for best results!
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Individual Prompt Cards */}
              {generatedPrompts.map((promptSection, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="p-4 sm:p-6 md:p-8 shadow-xl border-2 border-[#4988C4] bg-white relative overflow-hidden">
                    {/* Step indicator banner */}
                    <div className="absolute top-0 right-0 bg-[#1C4D8D] text-white px-4 py-1 text-xs font-semibold rounded-bl-lg">
                      STEP {index + 1} OF {generatedPrompts.length}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 mt-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-[#1C4D8D] text-white font-bold rounded-full text-base shadow-lg">
                            {index + 1}
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-[#0F2854]">
                            {promptSection.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 ml-0 sm:ml-13">{promptSection.description}</p>
                      </div>
                      <Button
                        onClick={() => handleCopy(promptSection.prompt, index)}
                        variant="outline"
                        className="border-[#4988C4] text-[#1C4D8D] hover:bg-[#BDE8F5] w-full sm:w-auto flex-shrink-0 font-semibold"
                      >
                        {copiedIndex === index ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy This Prompt
                          </>
                        )}
                      </Button>
                    </div>

                    <Textarea
                      value={promptSection.prompt}
                      readOnly
                      className="font-mono text-xs sm:text-sm bg-gray-50 border-2 border-gray-300 min-h-[300px] focus:border-[#4988C4]"
                    />

                    {/* Next step indicator */}
                    {index < generatedPrompts.length - 1 && (
                      <div className="mt-3 p-2 bg-[#BDE8F5] border border-[#4988C4] rounded text-xs text-[#0F2854] text-center">
                        ⬇️ After completing this step, proceed to <strong>Step {index + 2}: {generatedPrompts[index + 1].title}</strong>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}

              {/* Final Tips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-4 sm:p-6 bg-white border-2">
                  <h3 className="font-bold text-[#0F2854] mb-4 flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-[#1C4D8D]" />
                    How to Use These Prompts with Your AI Coding Assistant
                  </h3>
                  <div className="space-y-3 text-sm text-gray-800">
                    <div className="bg-white p-3 rounded-lg border border-[#4988C4]">
                      <p className="font-semibold text-[#0F2854] mb-1">📝 Step-by-Step Process:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2 text-gray-700">
                        <li>Copy Prompt #1 and paste it into your AI assistant (Claude Code, bolt.new, Cursor, or ChatGPT)</li>
                        <li>Wait for the AI to complete the implementation</li>
                        <li>Review and test the generated code</li>
                        <li>Once satisfied, move to the next prompt</li>
                        <li>Repeat until all {generatedPrompts.length} prompts are completed</li>
                      </ol>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-300">
                      <p className="font-semibold text-green-900 mb-1">✅ Why Follow the Order?</p>
                      <p className="text-green-800">
                        Each prompt builds on the previous one. These prompts are structured to ensure your application is built with proper architecture, security, and design patterns.
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-300">
                      <p className="font-semibold text-yellow-900 mb-1">💡 Pro Tips:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2 text-yellow-800">
                        <li>Use the same AI assistant for all prompts for consistency</li>
                        <li>Test each feature before moving to the next</li>
                        <li>You can ask the AI follow-up questions for each prompt</li>
                        <li>Don't skip steps - each builds critical foundation</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
