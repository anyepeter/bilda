import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-gradient-primary text-white hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5':
              variant === 'primary',
            'bg-secondary text-white hover:bg-secondary-dark hover:shadow-lg hover:shadow-secondary/25 hover:-translate-y-0.5':
              variant === 'secondary',
            'border-2 border-primary text-primary hover:bg-primary hover:text-white':
              variant === 'outline',
            'text-primary hover:bg-primary/10': variant === 'ghost',
          },
          {
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export default Button
