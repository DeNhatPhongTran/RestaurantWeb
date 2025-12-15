import React from 'react'
import { ChevronRight } from 'lucide-react'
import clsx from 'clsx'

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <a
            href={item.href}
            className={clsx(
              'transition-colors',
              index === items.length - 1
                ? 'text-secondary-900 font-medium'
                : 'text-secondary-600 hover:text-secondary-900'
            )}
          >
            {item.label}
          </a>
          {index < items.length - 1 && <ChevronRight className="h-4 w-4 text-secondary-400" />}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb
