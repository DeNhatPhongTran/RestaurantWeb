import React from 'react'
import { Skeleton } from '../ui/Skeleton'
import { CardBody } from '../ui/Card'

const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          {[...Array(columns)].map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export default TableSkeleton
