/**
 * Format a number as Vietnamese currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string with ₫ symbol
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0₫'
  }
  return `${amount.toLocaleString('vi-VN')}₫`
}

/**
 * Parse a price value to ensure it's a valid number
 * @param {any} value - The value to parse
 * @returns {number} Parsed number or 0 if invalid
 */
export const parsePrice = (value) => {
  const parsed = Number(value)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Calculate tax amount
 * @param {number} subtotal - The subtotal amount
 * @param {number} taxRate - Tax rate as decimal (default 0.12 for 12%)
 * @returns {number} Tax amount
 */
export const calculateTax = (subtotal, taxRate = 0.12) => {
  return Math.round(subtotal * taxRate)
}

/**
 * Calculate total from subtotal and tax
 * @param {number} subtotal - The subtotal amount
 * @param {number} taxRate - Tax rate as decimal (default 0.12 for 12%)
 * @returns {object} Object with subtotal, tax, and total
 */
export const calculateOrderTotal = (subtotal, taxRate = 0.12) => {
  const tax = calculateTax(subtotal, taxRate)
  const total = subtotal + tax
  return { subtotal, tax, total }
}
