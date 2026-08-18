import { HTMLAttributes, forwardRef } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'hover' | 'modal' | 'panel'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'base', padding = 'md', children, className = '', ...props }, ref) => {
    const variantClasses = {
      base: 'glass-base border border-on-surface/10',
      hover: 'glass-base border border-on-surface/10 hover:border-tertiary/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all duration-300',
      modal: 'glass-modal',
      panel: 'glass-panel',
    }

    const paddingClasses = {
      none: '',
      sm: 'p-sm',
      md: 'p-md',
      lg: 'p-lg',
    }

    return (
      <div
        ref={ref}
        className={`rounded-xl ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`mb-md ${className}`} {...props} />
  )
)

CardHeader.displayName = 'CardHeader'

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', ...props }, ref) => (
    <h3 ref={ref} className={`font-title-md text-title-md text-tertiary-fixed ${className}`} {...props} />
  )
)

CardTitle.displayName = 'CardTitle'

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  )
)

CardContent.displayName = 'CardContent'