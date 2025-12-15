import { ShoppingCart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ModalHeader from '../common/ModalHeader'
import QuantitySelector from '../common/QuantitySelector'
import { Button } from '../ui/Button'

const AddItemModal = ({ isOpen, onClose, item, onAddToCart, editMode = false, existingItem = null }) => {
  const [quantity, setQuantity] = useState(editMode && existingItem ? existingItem.quantity : 1)
  const [selectedAddOns, setSelectedAddOns] = useState(editMode && existingItem ? existingItem.addOns || [] : [])
  const [note, setNote] = useState(editMode && existingItem ? existingItem.note || '' : '')

  // Update state when editing an existing item
  useEffect(() => {
    if (editMode && existingItem) {
      setQuantity(existingItem.quantity)
      setSelectedAddOns(existingItem.addOns || [])
      setNote(existingItem.note || '')
    } else {
      setQuantity(1)
      setSelectedAddOns([])
      setNote('')
    }
  }, [editMode, existingItem])

  if (!isOpen || !item) return null

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleIncrease = () => {
    setQuantity(quantity + 1)
  }

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.name === addOn.name)
      if (exists) {
        return prev.filter((a) => a.name !== addOn.name)
      }
      return [...prev, addOn]
    })
  }

  const calculateTotal = () => {
    const basePrice = Number(item.price) || 0
    const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + (Number(addOn.price) || 0), 0)
    return (basePrice + addOnsTotal) * quantity
  }

  const handleAddToCart = () => {
    const itemData = {
      ...item,
      quantity,
      addOns: selectedAddOns,
      note: note.trim(),
      totalPrice: calculateTotal(),
      ...(editMode && existingItem && { cartId: existingItem.cartId })
    }
    onAddToCart(itemData)
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <ModalHeader
            title="Thêm Món"
            icon={ShoppingCart}
            onClose={onClose}
          />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Item Info */}
            <div className="flex gap-4 mb-6">
              <img
                src="/images/food/wagyu_steak.jpg"
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-secondary-900 mb-1">{item.name}</h3>
                <p className="text-xs text-secondary-600 mb-2 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-secondary-500">Giá Gốc</span>
                  <span className="text-base font-bold text-primary-600">{item.price.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
            </div>

            {/* Add-ons Section */}
            {item.addOns && item.addOns.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-secondary-900">Thêm Vào</h4>
                  <span className="text-xs text-secondary-500 bg-secondary-100 px-2 py-1 rounded">
                    Tùy Chọn
                  </span>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {item.addOns.map((addOn, index) => {
                    const isSelected = selectedAddOns.find((a) => a.name === addOn.name)
                    return (
                      <button
                        key={index}
                        onClick={() => toggleAddOn(addOn)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-secondary-200 hover:border-secondary-300'
                        }`}
                      >
                        <span className="text-sm font-medium text-secondary-900">
                          {addOn.name}
                        </span>
                        <span className="text-sm font-semibold text-secondary-700">
                          +{addOn.price.toLocaleString('vi-VN')}₫
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-secondary-900">Số Lượng</h4>
              </div>
              
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
              />
            </div>

            {/* Note Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-secondary-900">Ghi Chú</h4>
                <span className="text-xs text-secondary-500 bg-secondary-100 px-2 py-1 rounded">
                  Tùy Chọn
                </span>
              </div>
              
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Thêm ghi chú cho món ăn (VD: Không hành, ít cay...)"
                className="w-full px-4 py-3 rounded-lg border-2 border-secondary-200 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                rows="3"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-secondary-200 bg-secondary-50">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
            >
              <span>{editMode ? 'Cập Nhật' : 'Thêm Vào Giỏ'} - {calculateTotal().toLocaleString('vi-VN')}₫</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddItemModal
