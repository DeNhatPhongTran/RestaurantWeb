import { Edit2, LayoutGrid, Minus, MoreVertical, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { mockCategories, mockMenuItems } from '../../data'
import { Button } from '../ui/Button'
import Modal from '../ui/Modal'
import AddItemModal from './AddItemModal'

const EditOrderModal = ({ isOpen, onClose, orderItems: initialOrderItems, orderNumber }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [orderItems, setOrderItems] = useState(initialOrderItems || [])
  const [newlyAddedItems, setNewlyAddedItems] = useState([]) // Track newly added items
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
  const [selectedMenuItem, setSelectedMenuItem] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [cartIdCounter, setCartIdCounter] = useState(initialOrderItems?.length || 0)

  // Reset cart when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewlyAddedItems([])
      setSearchQuery('')
      setSelectedCategory('all')
    }
  }, [isOpen])

  // Import menu data from centralized data
  const menuCategories = mockCategories
  const menuItems = mockMenuItems

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Helper to check if add-ons are the same
  const areAddOnsSame = (addOns1, addOns2) => {
    if (!addOns1 && !addOns2) return true
    if (!addOns1 || !addOns2) return false
    if (addOns1.length !== addOns2.length) return false
    
    const sorted1 = [...addOns1].sort((a, b) => a.id - b.id)
    const sorted2 = [...addOns2].sort((a, b) => a.id - b.id)
    
    return sorted1.every((addon, index) => addon.id === sorted2[index].id)
  }

  const handleAddToCart = (menuItem) => {
    setSelectedMenuItem(menuItem)
    setEditingItem(null)
    setIsAddItemModalOpen(true)
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setSelectedMenuItem(menuItems.find(mi => mi.id === item.menuItemId))
    setIsAddItemModalOpen(true)
  }

  const removeFromCart = (cartId) => {
    // Check if it's in newly added items
    const isNewItem = newlyAddedItems.some(item => item.cartId === cartId)
    
    if (isNewItem) {
      setNewlyAddedItems(newlyAddedItems.filter(item => item.cartId !== cartId))
    } else {
      setOrderItems(orderItems.filter(item => item.cartId !== cartId))
    }
  }

  const updateQuantity = (cartId, delta) => {
    // Check if it's in newly added items
    const isNewItem = newlyAddedItems.some(item => item.cartId === cartId)
    
    if (isNewItem) {
      setNewlyAddedItems(newlyAddedItems.map(item => {
        if (item.cartId === cartId) {
          const newQuantity = item.quantity + delta
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }).filter(item => item.quantity > 0))
    } else {
      setOrderItems(orderItems.map(item => {
        if (item.cartId === cartId) {
          const newQuantity = item.quantity + delta
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }).filter(item => item.quantity > 0))
    }
  }
  const handleCancelAddItem = () => {
    // Close modal without adding/updating item
    setIsAddItemModalOpen(false)
    setSelectedMenuItem(null)
    setEditingItem(null)
  }
  const handleAddItemModalClose = (itemData) => {
    if (itemData) {
      // Ensure menuItemId and price are properly set
      const processedItemData = {
        ...itemData,
        menuItemId: itemData.id || itemData.menuItemId,
        price: Number(itemData.price) || 0,
        totalPrice: Number(itemData.totalPrice) || Number(itemData.price) || 0,
        quantity: Number(itemData.quantity) || 1
      }
      
      if (editingItem) {
        // Editing existing item
        const isOriginalItem = !newlyAddedItems.some(i => i.cartId === editingItem.cartId)
        
        if (isOriginalItem) {
          // Check if there's an identical item in original items
          const existingItemIndex = orderItems.findIndex(item =>
            item.cartId !== editingItem.cartId &&
            item.menuItemId === processedItemData.menuItemId &&
            areAddOnsSame(item.addOns, processedItemData.addOns) &&
            item.note === processedItemData.note
          )

          if (existingItemIndex !== -1) {
            // Merge with existing item in original
            const updatedItems = [...orderItems]
            updatedItems[existingItemIndex].quantity += processedItemData.quantity
            setOrderItems(updatedItems.filter(item => item.cartId !== editingItem.cartId))
          } else {
            // Update the existing item in original
            setOrderItems(orderItems.map(item =>
              item.cartId === editingItem.cartId ? { ...processedItemData, cartId: editingItem.cartId } : item
            ))
          }
        } else {
          // Check if there's an identical item in newly added
          const existingNewIndex = newlyAddedItems.findIndex(item =>
            item.cartId !== editingItem.cartId &&
            item.menuItemId === processedItemData.menuItemId &&
            areAddOnsSame(item.addOns, processedItemData.addOns) &&
            item.note === processedItemData.note
          )

          if (existingNewIndex !== -1) {
            // Merge with existing item in newly added
            const updatedItems = [...newlyAddedItems]
            updatedItems[existingNewIndex].quantity += processedItemData.quantity
            setNewlyAddedItems(updatedItems.filter(item => item.cartId !== editingItem.cartId))
          } else {
            // Update the existing item in newly added
            setNewlyAddedItems(newlyAddedItems.map(item =>
              item.cartId === editingItem.cartId ? { ...processedItemData, cartId: editingItem.cartId } : item
            ))
          }
        }
      } else {
        // Adding new item - check if identical exists in newly added items
        const existingNewIndex = newlyAddedItems.findIndex(item =>
          item.menuItemId === processedItemData.menuItemId &&
          areAddOnsSame(item.addOns, processedItemData.addOns) &&
          item.note === processedItemData.note
        )

        if (existingNewIndex !== -1) {
          // Increment quantity in newly added
          const updatedItems = [...newlyAddedItems]
          updatedItems[existingNewIndex].quantity += processedItemData.quantity
          setNewlyAddedItems(updatedItems)
        } else {
          // Add completely new item
          const newItem = {
            ...processedItemData,
            cartId: cartIdCounter + 1
          }
          setNewlyAddedItems([...newlyAddedItems, newItem])
          setCartIdCounter(cartIdCounter + 1)
        }
      }
    }
    // Always close modal and reset state
    setIsAddItemModalOpen(false)
    setSelectedMenuItem(null)
    setEditingItem(null)
  }

  // Calculate order totals
  const allItems = [...orderItems, ...newlyAddedItems]
  
  // Calculate newly added items total
  const addedItemsTotal = newlyAddedItems.reduce((sum, item) => {
    const itemPrice = item.totalPrice || item.price
    return sum + (itemPrice * item.quantity)
  }, 0)
  
  const subtotal = allItems.reduce((sum, item) => {
    const itemPrice = item.totalPrice || item.price
    return sum + (itemPrice * item.quantity)
  }, 0)
  const tax = subtotal * 0.12
  const total = subtotal + tax

  const handleModalClose = () => {
    // Reset newly added items when closing modal
    setNewlyAddedItems([])
    setSearchQuery('')
    setSelectedCategory('all')
    onClose()
  }

  const handleSaveChanges = (sendToKitchen = false) => {
    // Add status to newly added items
    const itemsWithStatus = newlyAddedItems.map(item => ({
      ...item,
      status: sendToKitchen ? 'in-progress' : 'not-sent'
    }))
    
    const updatedOrderItems = [...orderItems, ...itemsWithStatus]
    console.log('Saving order changes:', updatedOrderItems)
    onClose(updatedOrderItems)
    
    // Reset state after save
    setNewlyAddedItems([])
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        title={`Thêm Món - Đơn #${orderNumber}`}
        size="md"
      >
        <div className="flex-1 overflow-hidden flex h-full">
          {/* Left Panel - Menu List */}
          <div className="flex-1 flex flex-col border-r border-secondary-200">
              {/* Menu Header */}
              <div className="px-4 py-3 border-b border-secondary-200">
                <div className="flex items-center gap-2 mb-3">
                  <LayoutGrid className="h-4 w-4 text-secondary-700" />
                  <h3 className="text-base font-bold text-secondary-900">Danh Sách Món</h3>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Tìm Tên Món"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-secondary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-xs"
                  />
                </div>
              </div>

              {/* Category Tabs */}
              <div className="px-4 py-2 border-b border-secondary-200 overflow-x-auto">
                <div className="flex gap-1.5 min-w-max">
                  {menuCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                      }`}
                    >
                      {category.name} <span className="ml-1 opacity-75 text-xs">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Items Grid */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {filteredMenuItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg border border-secondary-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative h-24 bg-secondary-100">
                        <img
                          src="/images/food/wagyu_steak.jpg"
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Availability Badge */}
                        <div className="absolute top-1.5 left-1.5">
                          <div className={`px-1.5 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${
                            item.available 
                              ? 'bg-success-100 text-success-700' 
                              : 'bg-danger-100 text-danger-700'
                          }`}>
                            <div className={`h-1.5 w-1.5 rounded-full ${item.available ? 'bg-success-600' : 'bg-danger-600'}`} />
                            {item.available ? 'Có Sẵn' : 'Hết'}
                          </div>
                        </div>

                        {/* More Options */}
                        <button className="absolute top-1.5 right-1.5 h-6 w-6 rounded-md bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                          <MoreVertical className="h-3.5 w-3.5 text-secondary-600" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-2">
                        <h4 className="font-semibold text-xs text-secondary-900 mb-0.5 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-secondary-500 mb-1.5 line-clamp-1">{item.description}</p>
                        
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-sm font-bold text-primary-600">{item.price.toLocaleString('vi-VN')}₫</span>
                          <button
                            onClick={() => item.available && handleAddToCart(item)}
                            disabled={!item.available}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              item.available
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'bg-secondary-200 text-secondary-400 cursor-not-allowed'
                            }`}
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Order Details */}
            <div className="w-80 flex flex-col bg-secondary-50 relative">
              {/* Order Details Header */}
              <div className="px-4 py-3 border-b border-secondary-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-secondary-700" />
                    <h3 className="text-base font-bold text-secondary-900">Món Đang Thêm</h3>
                  </div>
                  <button
                    onClick={() => {
                      setOrderItems([])
                      setNewlyAddedItems([])
                    }}
                    className="text-xs text-danger-600 hover:text-danger-700 font-medium"
                  >
                    <div className="flex items-center gap-1">
                      <Trash2 className="h-3 w-3" />
                      <span>Xóa Tất Cả</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Order Items List - Scrollable, overlay will cover bottom */}
              <div className="absolute top-[57px] bottom-0 left-0 right-0 overflow-y-auto px-4 py-3">
                {orderItems.length === 0 && newlyAddedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart className="h-12 w-12 text-secondary-300 mb-2" />
                    <p className="text-sm text-secondary-500 font-medium mb-1">Chưa Thêm Món Nào</p>
                    <p className="text-xs text-secondary-400">
                      Chọn món từ danh sách và <span className="font-semibold">Thêm Vào Giỏ</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pb-44">
                    {/* Newly Added Items Section */}
                    {newlyAddedItems.length > 0 && (
                      <div>
                        <div className="space-y-2">
                          {newlyAddedItems.map((item) => (
                            <div
                              key={item.cartId}
                              className="bg-primary-50 rounded-lg p-2 border border-primary-200"
                            >
                              <div className="flex gap-2 mb-2">
                                {/* Item Image */}
                                <div className="w-12 h-12 rounded-md bg-secondary-100 flex-shrink-0 overflow-hidden">
                                  <img
                                    src="/images/food/wagyu_steak.jpg"
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                
                                {/* Item Info */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-secondary-900 text-xs mb-0.5">
                                    {item.name}
                                  </h4>
                                  
                                  {/* Add-ons */}
                                  {item.addOns && item.addOns.length > 0 && (
                                    <div className="text-xs text-secondary-500 mb-0.5 line-clamp-1">
                                      <span className="font-medium">+</span> {item.addOns.map(a => a.name).join(', ')}
                                    </div>
                                  )}
                                  
                                  {/* Note */}
                                  {item.note && (
                                    <div className="text-xs text-secondary-500 italic line-clamp-1">
                                      {item.note}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Delete Button */}
                                <button
                                  onClick={() => removeFromCart(item.cartId)}
                                  className="text-white bg-danger-500 hover:bg-danger-600 rounded-md h-7 w-7 flex items-center justify-center flex-shrink-0"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              
                              {/* Price and Controls */}
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-secondary-900">
                                  {((item.totalPrice || item.price) * item.quantity).toLocaleString('vi-VN')}₫
                                </span>
                                
                                <div className="flex items-center gap-1">
                                  {/* Edit Button */}
                                  <button
                                    onClick={() => handleEditItem(item)}
                                    className="h-7 w-7 rounded-md border border-secondary-300 flex items-center justify-center hover:bg-secondary-50"
                                  >
                                    <Edit2 className="h-3 w-3 text-secondary-600" />
                                  </button>
                                  
                                  {/* Quantity Controls */}
                                  <button
                                    onClick={() => updateQuantity(item.cartId, -1)}
                                    className="h-7 w-7 rounded-md border border-secondary-300 flex items-center justify-center hover:bg-secondary-50"
                                  >
                                    <Minus className="h-3 w-3 text-secondary-600" />
                                  </button>
                                  <span className="text-xs font-semibold text-secondary-900 w-6 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.cartId, 1)}
                                    className="h-7 w-7 rounded-md border border-secondary-300 flex items-center justify-center hover:bg-secondary-50"
                                  >
                                    <Plus className="h-3 w-3 text-secondary-600" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Summary - Fixed Overlay Footer */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t border-secondary-200 bg-white shadow-lg">
                <div className="space-y-1.5 mb-3">
                  {/* Added Items Price - shown in green */}
                  {addedItemsTotal > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-success-600 font-medium">Đã Thêm</span>
                      <span className="font-semibold text-success-600">+{addedItemsTotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary-600">Tạm Tính</span>
                    <span className="font-semibold text-secondary-900">{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary-600">Thuế 12%</span>
                    <span className="font-semibold text-secondary-900">{tax.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="h-px bg-secondary-200 my-1.5" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-secondary-900">Tổng Thanh Toán</span>
                    <span className="text-lg font-bold text-secondary-900">{total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    className="w-32"
                    onClick={() => handleSaveChanges(false)}
                    disabled={newlyAddedItems.length === 0}
                  >
                    Lưu
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1"
                    onClick={() => handleSaveChanges(true)}
                    disabled={newlyAddedItems.length === 0}
                  >
                    Lưu & Gửi Bếp
                  </Button>
                </div>
              </div>
            </div>
          </div>
      </Modal>

      {/* Add/Edit Item Modal */}
      {isAddItemModalOpen && selectedMenuItem && (
        <AddItemModal
          isOpen={isAddItemModalOpen}
          onClose={handleCancelAddItem}
          item={selectedMenuItem}
          onAddToCart={handleAddItemModalClose}
          editMode={!!editingItem}
          existingItem={editingItem}
        />
      )}
    </>
  )
}

export default EditOrderModal
