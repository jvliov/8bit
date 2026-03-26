import type { ButtonHTMLAttributes } from 'react'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function PixelButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: PixelButtonProps) {
  return (
    <button
      {...props}
      className={`pixel-btn pixel-btn--${variant} pixel-btn--${size} ${className}`}
    >
      {children}
    </button>
  )
}
