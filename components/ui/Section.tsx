import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  container?: boolean
}

export default function Section({
  className,
  children,
  container = true,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        'py-16 md:py-24 lg:py-32',
        className
      )}
      {...props}
    >
      {container ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
}
