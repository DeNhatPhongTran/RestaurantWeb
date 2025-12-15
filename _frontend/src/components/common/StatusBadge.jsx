import React from 'react'
import clsx from 'clsx'

const StatusBadge = ({ status, label }) => {
  const statusConfig = {
    'in-progress': {
      bg: 'bg-warning-50',
      text: 'text-warning-800',
      dot: 'bg-warning-400',
      label: label || 'In Progress',
    },
    'ready': {
      bg: 'bg-success-50',
      text: 'text-success-800',
      dot: 'bg-success-400',
      label: label || 'Ready to Served',
    },
    'waiting': {
      bg: 'bg-primary-50',
      text: 'text-primary-800',
      dot: 'bg-primary-400',
      label: label || 'Waiting for Payment',
    },
    'completed': {
      bg: 'bg-success-50',
      text: 'text-success-800',
      dot: 'bg-success-400',
      label: label || 'Completed',
    },
    'pending': {
      bg: 'bg-secondary-50',
      text: 'text-secondary-700',
      dot: 'bg-secondary-400',
      label: label || 'Pending',
    },
  }

  const config = statusConfig[status] || statusConfig['pending']

  return (
    <div className={clsx('flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium', config.bg, config.text)}>
      <div className={clsx('w-2 h-2 rounded-full', config.dot)} />
      {config.label}
    </div>
  )
}

export default StatusBadge
