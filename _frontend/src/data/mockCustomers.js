// Mock customer data for development
export const mockCustomers = [
  {
    id: 1,
    name: 'Nguyen Van A',
    phone: '0999999999',
    points: 12400,
  },
  // Add more mock customers here as needed
]

/**
 * Find a customer by phone number or member code
 * @param {string} searchTerm - Phone number or member code to search for
 * @returns {object|null} Customer object if found, null otherwise
 */
export const findCustomer = (searchTerm) => {
  return mockCustomers.find(
    (customer) => 
      customer.phone === searchTerm || 
      customer.id === searchTerm
  ) || null
}
