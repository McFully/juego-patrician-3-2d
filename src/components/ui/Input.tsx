export interface InputProps {
  label?: string
  error?: string
  helperText?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  min?: number
  max?: number
  placeholder?: string
  className?: string
  id?: string
}

export function Input({
  label, error, helperText, prefix, suffix, className = '', id, ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="font-label-sm text-label-sm text-on-surface-variant block mb-base">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <div className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant/60 pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-primary-container border rounded-lg px-sm py-sm text-on-surface placeholder:text-on-surface-variant/50
            focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary transition-all duration-200
            ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-10' : ''}
            ${error ? 'border-error focus:border-error focus:ring-error' : 'border-on-surface/20'}
            ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {suffix && (
          <div className="absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant/60 pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-xs text-xs text-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-xs text-xs text-on-surface-variant/60">
          {helperText}
        </p>
      )}
    </div>
  )
}
