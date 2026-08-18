import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, iconPosition = 'left', fullWidth, children, className = '', disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-label-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
      primary: 'bg-tertiary text-on-tertiary hover:scale-[1.02] active:scale-[0.98] focus:ring-tertiary-fixed',
      secondary: 'bg-transparent border-2 border-on-surface/30 text-on-surface hover:bg-on-surface/10 active:scale-[0.98] focus:ring-tertiary',
      ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-variant/30 hover:text-tertiary focus:ring-tertiary',
      danger: 'bg-error-container text-on-error-container border border-error hover:scale-[1.02] active:scale-[0.98] focus:ring-error',
    }

    const sizeClasses = {
      sm: 'px-sm py-xs text-xs',
      md: 'px-md py-sm',
      lg: 'px-lg py-md text-body-md',
    }

    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : icon && iconPosition === 'left' ? (
          <span className="mr-2 flex-shrink-0">{icon}</span>
        ) : null}
        {children}
        {icon && iconPosition === 'right' && <span className="ml-2 flex-shrink-0">{icon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'