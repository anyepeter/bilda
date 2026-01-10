'use client'

//@ts-nocheck
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import Button from './ui/Button'
import { Menu, X, Sparkles } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useUser()
  const pathname = usePathname()
  const isPromptPage = pathname === '/prompt'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#features', label: 'Features' },
    { href: '#use-cases', label: 'Use Cases' },
    // { href: '#contact', label: 'Contact' },
  ]

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isMobileMenuOpen
            ? 'bg-white'
            : isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Hidden when mobile menu is open */}
            <a
              href="/"
              className={cn(
                "flex items-center space-x-2 group transition-opacity duration-300",
                isMobileMenuOpen ? "md:flex opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto" : "flex"
              )}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold gradient-text">
                PromptForge
              </span>
            </a>

            {/* Desktop Navigation */}
            {!isPromptPage && (
              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-dark-lighter hover:text-primary transition-colors font-medium"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <SignedOut>
                <a href="/sign-up" className="text-dark-lighter hover:text-primary transition-colors font-medium">
                  Sign In
                </a>
                <Button size="md" asChild className='bg-dark'>
                  <a href="/sign-up">Get Started</a>
                </Button>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-3">
                  {!isPromptPage && (
                    <Button size="md" asChild className='bg-[#1C4D8D] hover:bg-[#0F2854]'>
                      <a href="/prompt">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Prompt
                      </a>
                    </Button>
                  )}
                  <span className="text-dark text-bold font-medium">
                   Hello {user?.firstName || user?.fullName || 'User'}
                  </span>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-dark hover:text-primary transition-colors z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Fullscreen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-white z-40 overflow-y-auto"
          >
            <div className="container mx-auto px-4 pt-24 pb-8">
              <div className="flex flex-col">
                {!isPromptPage && navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className="text-dark hover:text-primary transition-colors font-medium text-lg py-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: navLinks.length * 0.1,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="w-full mt-6"
                >
                  <SignedOut>
                    <a href="/sign-up" className="block w-full mb-4">
                      <Button size="lg" className="w-full bg-gray-100 text-dark hover:bg-gray-200">
                        Sign In
                      </Button>
                    </a>
                    <a href="/sign-up" className="block w-full">
                      <Button size="lg" className="w-full bg-dark">
                        Get Started
                      </Button>
                    </a>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex flex-col items-center justify-center gap-3">
                      {!isPromptPage && (
                        <a href="/prompt" className="block w-full mb-4">
                          <Button size="lg" className="w-full bg-[#1C4D8D] hover:bg-[#0F2854]">
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate Prompt
                          </Button>
                        </a>
                      )}
                      <span className="text-dark font-semibold text-lg">
                      Hello {user?.firstName || user?.fullName || 'User'}
                      </span>
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "w-12 h-12"
                          }
                        }}
                      />
                    </div>
                  </SignedIn>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
