import React from 'react'
import clsx from 'clsx'

const Avatar = React.forwardRef(
  ({ className, src, alt, initials, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
    }

    return (
      <div
        className={clsx(
          'inline-flex items-center justify-center rounded-full bg-primary-500 text-white font-semibold',
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {src ? <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" /> : initials}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export { Avatar }
