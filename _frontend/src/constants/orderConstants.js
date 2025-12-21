// Order statuses
export const ORDER_STATUS = {
  SERVING: 'serving',
  WAITING: 'waiting',
  COMPLETED: 'completed',
}

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.SERVING]: 'Đang phục vụ',
  [ORDER_STATUS.WAITING]: 'Chờ Thanh Toán',
  [ORDER_STATUS.COMPLETED]: 'Hoàn Thành',
}

// Item statuses
export const ITEM_STATUS = {
  NOT_SENT: 'not-sent',
  IN_PROGRESS: 'in-progress',
  READY: 'ready',
  SERVED: 'served',
}

export const ITEM_STATUS_LABELS = {
  [ITEM_STATUS.NOT_SENT]: 'Chưa Gửi',
  [ITEM_STATUS.IN_PROGRESS]: 'Đang Làm',
  [ITEM_STATUS.READY]: 'Sẵn Sàng',
  [ITEM_STATUS.SERVED]: 'Đã Phục Vụ',
}

export const ITEM_STATUS_COLORS = {
  [ITEM_STATUS.NOT_SENT]: {
    bg: 'bg-secondary-50',
    text: 'text-secondary-700',
    border: 'border-secondary-300',
  },
  [ITEM_STATUS.IN_PROGRESS]: {
    bg: 'bg-primary-50',
    text: 'text-primary-700',
    border: 'border-primary-300',
  },
  [ITEM_STATUS.READY]: {
    bg: 'bg-warning-50',
    text: 'text-warning-700',
    border: 'border-warning-300',
  },
  [ITEM_STATUS.SERVED]: {
    bg: 'bg-success-50',
    text: 'text-success-700',
    border: 'border-success-300',
  },
}

// Delete reasons
export const DELETE_REASONS = [
  'Khách đổi ý',
  'Món hết',
  'Thời gian chờ quá lâu',
  'Món không đúng yêu cầu',
  'Khác',
]

// Sort options
export const SORT_OPTIONS = {
  TIME_ASC: 'time-asc',
  TIME_DESC: 'time-desc',
  TABLE_ASC: 'table-asc',
  TABLE_DESC: 'table-desc',
}

export const SORT_LABELS = {
  [SORT_OPTIONS.TIME_DESC]: 'Thời Gian (Mới Nhất)',
  [SORT_OPTIONS.TIME_ASC]: 'Thời Gian (Cũ Nhất)',
  [SORT_OPTIONS.TABLE_ASC]: 'Bàn (Tăng Dần)',
  [SORT_OPTIONS.TABLE_DESC]: 'Bàn (Giảm Dần)',
}

// Order types
export const ORDER_TYPES = {
  DINE_IN: 'dine-in',
  TAKE_AWAY: 'take-away',
}

export const ORDER_TYPE_LABELS = {
  [ORDER_TYPES.DINE_IN]: 'Ăn Tại Chỗ',
  [ORDER_TYPES.TAKE_AWAY]: 'Mang Đi',
}

// Table statuses
export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
}

// Tax rate
export const TAX_RATE = 0.12 // 12%
