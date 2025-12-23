import React from 'react'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'

const SearchBar = ({ placeholder = 'Search...', onSearch, onChange }) => {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-3 h-5 w-5 text-secondary-400" />
      <Input
        placeholder={placeholder}
        className="pl-10"
        onChange={(e) => {
          onChange?.(e.target.value)
          onSearch?.(e.target.value)
        }}
      />
    </div>
  )
}

export default SearchBar
