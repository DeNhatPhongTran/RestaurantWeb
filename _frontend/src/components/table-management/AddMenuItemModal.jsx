import React, { useEffect, useState } from 'react'
import { Plus, Minus, ShoppingCart, X, Check } from 'lucide-react'
import { Button } from '../ui/button'

const AddMenuItemModal = ({
  isOpen,
  onClose,
  menuItems = [],
  onConfirm,
  loading = false
}) => {
  const [selectedItems, setSelectedItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  // Extract unique categories
  const categories = ['Tất cả', ...new Set(menuItems.map(item => item.category))]

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = filterCategory === '' || filterCategory === 'Tất cả' || item.category === filterCategory
    return matchSearch && matchCategory
  })

  // Handle quantity change
  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeItem(menuItemId)
      return
    }
    
    setSelectedItems(prev => {
      const existing = prev.find(s => s.menuItem._id === menuItemId)
      if (existing) {
        return prev.map(s =>
          s.menuItem._id === menuItemId ? { ...s, quantity } : s
        )
      }
      return prev
    })
  }

  // Add item to selection
  const addItem = (menuItem) => {
    setSelectedItems(prev => {
      const existing = prev.find(s => s.menuItem._id === menuItem._id)
      if (existing) {
        return prev.map(s =>
          s.menuItem._id === menuItem._id
            ? { ...s, quantity: s.quantity + 1 }
            : s
        )
      }
      return [...prev, { menuItem, quantity: 1, note: '' }]
    })
  }

  // Remove item from selection
  const removeItem = (menuItemId) => {
    setSelectedItems(prev => prev.filter(s => s.menuItem._id !== menuItemId))
  }

  // Update note
  const updateNote = (menuItemId, note) => {
    setSelectedItems(prev =>
      prev.map(s =>
        s.menuItem._id === menuItemId ? { ...s, note } : s
      )
    )
  }

  // Handle confirm - call parent callback
  const handleConfirm = async () => {
    if (selectedItems.length === 0) return
    
    try {
      await onConfirm(selectedItems)
      // Reset after success
      setSelectedItems([])
      setSearchTerm('')
      setFilterCategory('')
    } catch (error) {
      console.error('Error confirming items:', error)
    }
  }

  // Handle close
  const handleClose = () => {
    setSelectedItems([])
    setSearchTerm('')
    setFilterCategory('')
    onClose()
  }

  if (!isOpen) return null

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  )

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-[60] flex items-end justify-center">
        <div
          className="bg-white rounded-t-2xl shadow-2xl w-full h-[95vh] overflow-hidden flex flex-col animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-secondary-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-bold text-secondary-900">Thêm Món Ăn</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-secondary-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 p-4">
            {/* Left Panel - Menu Items */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Search & Filter */}
              <div className="space-y-3 flex-shrink-0 mb-3">
                <input
                  type="text"
                  placeholder="Tìm tên món..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat === 'Tất cả' ? '' : cat)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        (cat === 'Tất cả' ? filterCategory === '' : filterCategory === cat)
                          ? 'bg-primary-500 text-white'
                          : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Items Grid */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="grid grid-cols-2 gap-3">
                  {filteredItems.map(item => {
                    const isSelected = selectedItems.some(s => s.menuItem._id === item._id)
                    const selectedItem = selectedItems.find(s => s.menuItem._id === item._id)

                    return (
                      <div
                        key={item._id}
                        className={`relative rounded-lg border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-secondary-200 bg-white hover:border-primary-300'
                        }`}
                      >
                        {/* Image */}
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-t-md"
                          />
                        )}

                        {/* Content */}
                        <div className="p-2">
                          <p className="font-semibold text-secondary-900 text-sm line-clamp-2 mb-1">
                            {item.name}
                          </p>
                          <p className="text-primary-600 font-bold text-sm mb-2">
                            {item.price?.toLocaleString('vi-VN')}₫
                          </p>

                          {/* Add/Quantity Controls */}
                          {!isSelected ? (
                            <button
                              onClick={() => addItem(item)}
                              className="w-full bg-primary-500 text-white py-1.5 rounded text-sm font-semibold hover:bg-primary-600 transition-colors"
                            >
                              <Plus className="w-4 h-4 inline mr-1" /> Thêm
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 bg-primary-100 rounded p-1">
                              <button
                                onClick={() => updateQuantity(item._id, selectedItem.quantity - 1)}
                                className="flex-1 p-1 hover:bg-primary-200 rounded transition-colors"
                              >
                                <Minus className="w-3 h-3 text-primary-600 mx-auto" />
                              </button>
                              <span className="flex-1 text-center font-bold text-primary-900 text-sm">
                                {selectedItem.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item._id, selectedItem.quantity + 1)}
                                className="flex-1 p-1 hover:bg-primary-200 rounded transition-colors"
                              >
                                <Plus className="w-3 h-3 text-primary-600 mx-auto" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Selected Badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Panel - Selected Items Summary */}
            <div className="w-full lg:w-72 flex flex-col bg-secondary-50 rounded-lg p-4 border border-secondary-200">
              <h3 className="font-bold text-secondary-900 mb-3 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary-500" />
                Đã Chọn ({selectedItems.length})
              </h3>

              {selectedItems.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center text-secondary-600">
                  <p className="text-sm">Chưa chọn món nào</p>
                </div>
              ) : (
                <>
                  {/* Selected Items List */}
                  <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                    {selectedItems.map(item => (
                      <div key={item.menuItem._id} className="bg-white rounded p-2 border border-secondary-100">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-secondary-900 line-clamp-1">
                              {item.menuItem.name}
                            </p>
                            <p className="text-xs text-secondary-600">
                              x{item.quantity} = {(item.menuItem.price * item.quantity).toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.menuItem._id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Note Input */}
                        <input
                          type="text"
                          placeholder="Ghi chú..."
                          value={item.note}
                          onChange={(e) => updateNote(item.menuItem._id, e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-secondary-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="border-t border-secondary-200 pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Tạm tính</span>
                      <span className="font-bold text-secondary-900">
                        {subtotal.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={handleConfirm}
                  disabled={selectedItems.length === 0 || loading}
                >
                  {loading ? 'Đang lưu...' : `Xác Nhận (${selectedItems.length})`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddMenuItemModal
