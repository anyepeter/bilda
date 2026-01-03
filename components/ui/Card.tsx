import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

export default function Card({ className, children, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-200 p-6 md:p-8',
        hover && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
