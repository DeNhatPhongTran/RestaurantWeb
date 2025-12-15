import React from 'react'

/**
 * Reusable category tabs component with counts
 * @param {Object} props
 * @param {Array<{id: string, name: string, count: number}>} props.categories - Array of category objects
 * @param {string} props.selected - Currently selected category ID
 * @param {Function} props.onSelect - Handler called with selected category ID
 * @param {string} [props.className] - Additional CSS classes
 */
const CategoryTabs = ({ categories, selected, onSelect, className = '' }) => {
  return (
    <div className={`flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide ${className}`}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            selected === category.id
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
          }`}
        >
          {category.name}
          {typeof category.count === 'number' && (
            <span className="ml-1.5 text-xs">({category.count})</span>
          )}
        </button>
      ))}
    </div>
  )
}

export default CategoryTabs
