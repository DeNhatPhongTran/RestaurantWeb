// Theme Colors
export const COLORS = {
  primary: {
    50: '#f0f7ff',
    100: '#e0effe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c3d66',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#145231',
  },
  warning: {
    50: '#fef3c7',
    100: '#fde68a',
    200: '#fcd34d',
    300: '#fbbf24',
    400: '#f59e0b',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#92400e',
    900: '#78350f',
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
}

// Status Types
export const ORDER_STATUS = {
  IN_PROGRESS: 'in-progress',
  READY: 'ready',
  WAITING: 'waiting',
  COMPLETED: 'completed',
  PENDING: 'pending',
}

export const ORDER_TYPES = {
  DINE_IN: 'Dine In',
  TAKE_AWAY: 'Take Away',
}

// Breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

// Z-index scale
export const Z_INDEX = {
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modal_backdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
}

// Animation timing
export const ANIMATION = {
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
}
