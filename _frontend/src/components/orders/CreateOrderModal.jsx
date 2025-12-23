import { ArrowRight, ChevronDown, ChevronLeft, Clock, Edit2, LayoutGrid, List, Minus, MoreVertical, Plus, Search, ShoppingCart, Trash2, X } from 'lucide-react'
import React, { useState } from 'react'
import { mockCategories, mockMenuItems } from '../../data'
import { Button } from '../ui/button'
import Modal from '../ui/Modal'
import AddItemModal from './AddItemModal'

const CreateOrderModal = ({ isOpen, onClose }) => {
  const [orderType, setOrderType] = useState('dine-in')
  const [peopleCount, setPeopleCount] = useState(2)
  const [babyChairCount, setBabyChairCount] = useState(0)
  const [seatRequirements, setSeatRequirements] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedFloor, setSelectedFloor] = useState('1st')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [selectedTable, setSelectedTable] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [orderItems, setOrderItems] = useState([])
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
  const [selectedMenuItem, setSelectedMenuItem] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [cartIdCounter, setCartIdCounter] = useState(1)

  const handleDecrease = () => {
    if (peopleCount > 1) {
      const newCount = peopleCount - 1
      setPeopleCount(newCount)
      
      // Clear table selection if it becomes unsuitable for new guest count
      if (selectedTable) {
        const isSuitableForNewCount = (newCount <= 4 && (selectedTable.seats === 2 || selectedTable.seats === 4)) ||
                                      (newCount > 4 && (selectedTable.seats === 6 || selectedTable.seats === 8))
        if (!isSuitableForNewCount) {
          setSelectedTable(null)
          setBabyChairCount(0)
        }
      }
    }
  }

  const handleIncrease = () => {
    if (peopleCount >= 8) return // Maximum 8 people
    
    const newCount = peopleCount + 1
    setPeopleCount(newCount)
    
    // Clear table selection if it becomes unsuitable for new guest count
    if (selectedTable) {
      const isSuitableForNewCount = (newCount <= 4 && (selectedTable.seats === 2 || selectedTable.seats === 4)) ||
                                    (newCount > 4 && (selectedTable.seats === 6 || selectedTable.seats === 8))
      if (!isSuitableForNewCount) {
        setSelectedTable(null)
        setBabyChairCount(0)
      }
    }
  }

  const handleBabyChairDecrease = () => {
    if (babyChairCount > 0) {
      setBabyChairCount(babyChairCount - 1)
    }
  }

  const handleBabyChairIncrease = () => {
    const maxBabyChairs = selectedTable ? 
      (selectedTable.seats === 2 || selectedTable.seats === 4 ? 2 : 4) : 0
    if (babyChairCount < maxBabyChairs) {
      setBabyChairCount(babyChairCount + 1)
    }
  }

  const handleContinue = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      setCurrentStep(3)
    }
  }

  const handleCreateOrder = (sendToKitchen = false) => {
    // Determine item status based on button clicked
    const itemStatus = sendToKitchen ? 'in-progress' : 'not-sent'
    
    // Handle order creation
    console.log({
      orderType,
      peopleCount,
      babyChairCount,
      seatRequirements,
      table: selectedTable,
      items: orderItems.map(item => ({
        ...item,
        status: itemStatus
      })),
      sendToKitchen
    })
    onClose()
  }

  const handleClose = () => {
    // Reset form
    setCurrentStep(1)
    setOrderType('dine-in')
    setPeopleCount(2)
    setBabyChairCount(0)
    setSeatRequirements('')
    setSelectedFloor('1st')
    setViewMode('grid')
    setSelectedTable(null)
    setSelectedCategory('all')
    setSearchQuery('')
    setOrderItems([])
    onClose()
  }

  // Import menu categories from centralized data
  const menuCategories = mockCategories
  
  // Import menu items from centralized data  
  const menuItems = mockMenuItems

  const handleAddToCart = (item) => {
    // Check if item has add-ons
    if (item.addOns && item.addOns.length > 0) {
      setSelectedMenuItem(item)
      setEditingItem(null)
      setIsAddItemModalOpen(true)
    } else {
      // Check if identical item already exists (same food, no add-ons, no note)
      const existingItemIndex = orderItems.findIndex(i => 
        i.id === item.id && 
        (!i.addOns || i.addOns.length === 0) && 
        (!i.note || i.note.trim() === '')
      )

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...orderItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        }
        setOrderItems(updatedItems)
      } else {
        // Add new item
        const newItem = { 
          ...item, 
          quantity: 1, 
          totalPrice: item.price,
          cartId: cartIdCounter 
        }
        setOrderItems([...orderItems, newItem])
        setCartIdCounter(cartIdCounter + 1)
      }
    }
  }

  const handleAddItemWithAddOns = (itemData) => {
    if (itemData.cartId) {
      // Edit existing item
      setOrderItems(orderItems.map(i => 
        i.cartId === itemData.cartId ? itemData : i
      ))
    } else {
      // Check if identical item exists (same food, same add-ons, same note)
      const areAddOnsSame = (addOns1, addOns2) => {
        if (!addOns1 && !addOns2) return true
        if (!addOns1 || !addOns2) return false
        if (addOns1.length !== addOns2.length) return false
        const sorted1 = [...addOns1].sort((a, b) => a.name.localeCompare(b.name))
        const sorted2 = [...addOns2].sort((a, b) => a.name.localeCompare(b.name))
        return sorted1.every((addon, idx) => addon.name === sorted2[idx].name)
      }

      const existingItemIndex = orderItems.findIndex(i => 
        i.id === itemData.id && 
        areAddOnsSame(i.addOns, itemData.addOns) &&
        (i.note || '').trim() === (itemData.note || '').trim()
      )

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...orderItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + itemData.quantity
        }
        setOrderItems(updatedItems)
      } else {
        // Add new item with selected add-ons and quantity
        const newItem = { ...itemData, cartId: cartIdCounter }
        setOrderItems([...orderItems, newItem])
        setCartIdCounter(cartIdCounter + 1)
      }
    }
  }

  const handleEditItem = (item) => {
    setSelectedMenuItem(item)
    setEditingItem(item)
    setIsAddItemModalOpen(true)
  }

  const removeFromCart = (cartId) => {
    setOrderItems(orderItems.filter(i => i.cartId !== cartId))
  }

  const updateQuantity = (cartId, delta) => {
    setOrderItems(orderItems.map(i => {
      if (i.cartId === cartId) {
        const newQuantity = i.quantity + delta
        return newQuantity > 0 ? { ...i, quantity: newQuantity } : null
      }
      return i
    }).filter(Boolean))
  }

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const subtotal = orderItems.reduce((sum, item) => {
    const price = item.totalPrice || item.price
    return sum + (price * item.quantity)
  }, 0)
  const tax = subtotal * 0.12
  const total = subtotal + tax

  // Mock table data with seat capacity - realistic restaurant layout with empty spaces
  const tables = {
    '1st': [
      { id: 'A1', name: 'A1', seats: 2, status: 'available' },
      { id: 'A2', name: 'A2', seats: 4, status: 'available' },
      null, // Empty space
      { id: 'A3', name: 'A3', seats: 4, status: 'reserved', time: '17:00 PM' },
      { id: 'A4', name: 'A4', seats: 2, status: 'available' },
      { id: 'A5', name: 'A5', seats: 6, status: 'in-progress', orderId: 'DI104' },
      { id: 'A6', name: 'A6', seats: 4, status: 'available' },
      null, // Empty space
      { id: 'A7', name: 'A7', seats: 4, status: 'available' },
      { id: 'A8', name: 'A8', seats: 2, status: 'in-progress', orderId: 'DI105' },
      { id: 'A9', name: 'A9', seats: 8, status: 'available' },
      { id: 'A10', name: 'A10', seats: 2, status: 'available' },
      { id: 'A11', name: 'A11', seats: 4, status: 'available' },
      null, // Empty space
      { id: 'A12', name: 'A12', seats: 6, status: 'reserved', time: '18:30 PM' },
      { id: 'A13', name: 'A13', seats: 2, status: 'available' },
      null, // Empty space
      { id: 'A14', name: 'A14', seats: 4, status: 'available' },
      { id: 'A15', name: 'A15', seats: 8, status: 'not-available' },
      { id: 'A16', name: 'A16', seats: 4, status: 'available' },
      { id: 'A17', name: 'A17', seats: 2, status: 'available' },
      null, // Empty space
      { id: 'A18', name: 'A18', seats: 6, status: 'in-progress', orderId: 'DI106' },
      { id: 'A19', name: 'A19', seats: 4, status: 'available' },
      { id: 'A20', name: 'A20', seats: 2, status: 'reserved', time: '19:30 PM' }
    ],
    '2nd': [
      { id: 'B1', name: 'B1', seats: 4, status: 'available' },
      { id: 'B2', name: 'B2', seats: 2, status: 'available' },
      { id: 'B3', name: 'B3', seats: 4, status: 'available' },
      null, // Empty space
      { id: 'B4', name: 'B4', seats: 6, status: 'available' },
      { id: 'B5', name: 'B5', seats: 4, status: 'reserved', time: '19:00 PM' },
      null, // Empty space
      { id: 'B6', name: 'B6', seats: 2, status: 'in-progress', orderId: 'DI107' },
      { id: 'B7', name: 'B7', seats: 8, status: 'available' },
      { id: 'B8', name: 'B8', seats: 4, status: 'available' },
      { id: 'B9', name: 'B9', seats: 2, status: 'available' },
      null, // Empty space
      { id: 'B10', name: 'B10', seats: 6, status: 'in-progress', orderId: 'DI108' },
      { id: 'B11', name: 'B11', seats: 4, status: 'available' },
      { id: 'B12', name: 'B12', seats: 2, status: 'available' }
    ],
    '3rd': [
      { id: 'C1', name: 'C1', seats: 4, status: 'available' },
      { id: 'C2', name: 'C2', seats: 2, status: 'available' },
      null, // Empty space
      { id: 'C3', name: 'C3', seats: 6, status: 'available' },
      { id: 'C4', name: 'C4', seats: 4, status: 'not-available' },
      null, // Empty space
      { id: 'C5', name: 'C5', seats: 2, status: 'available' },
      { id: 'C6', name: 'C6', seats: 8, status: 'reserved', time: '20:00 PM' },
      { id: 'C7', name: 'C7', seats: 4, status: 'available' },
      null, // Empty space
      { id: 'C8', name: 'C8', seats: 4, status: 'available' }
    ]
  }

  const getTableStyles = (table, peopleCount) => {
    const baseStyles = 'rounded-xl flex flex-col items-center justify-center relative transition-all cursor-pointer border-2 font-semibold'
    
    let statusStyles = ''
    let canSelect = false
    
    // Check if table is suitable for the number of guests
    const isSuitableSize = (peopleCount <= 4 && (table.seats === 2 || table.seats === 4)) ||
                           (peopleCount > 4 && (table.seats === 6 || table.seats === 8))
    
    if (table.status === 'available' && isSuitableSize) {
      statusStyles = 'bg-white border-secondary-300 hover:border-primary-500 hover:shadow-md text-secondary-900'
      canSelect = true
    } else if (table.status === 'available' && !isSuitableSize) {
      statusStyles = 'bg-secondary-100 border-secondary-200 text-secondary-400 cursor-not-allowed opacity-50'
    } else if (table.status === 'reserved') {
      statusStyles = 'bg-secondary-800 border-secondary-800 text-white cursor-not-allowed'
    } else if (table.status === 'not-available') {
      statusStyles = 'bg-secondary-300 border-secondary-300 text-secondary-500 cursor-not-allowed'
    } else if (table.status === 'in-progress') {
      statusStyles = 'bg-warning-500 border-warning-500 text-white cursor-not-allowed'
    }

    // Size based on seat capacity
    let sizeStyles = ''
    let colSpan = ''
    if (table.seats === 2 || table.seats === 4) {
      sizeStyles = 'w-24 h-24' // Square for 2-4 seats
      colSpan = ''
    } else if (table.seats === 6 || table.seats === 8) {
      sizeStyles = 'w-full h-24' // Rectangle for 6-8 seats (spans 2 columns)
      colSpan = 'col-span-2'
    }

    if (selectedTable?.id === table.id) {
      statusStyles += ' ring-4 ring-primary-500 border-primary-500'
    }

    return { baseStyles, statusStyles, sizeStyles, colSpan, canSelect }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="flex flex-col h-full">
        {/* Header with Breadcrumb */}
        <div className="px-4 pt-3 pb-2 border-b border-secondary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Back Button - Always Visible */}
              <button
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep(currentStep - 1)
                  }
                }}
                disabled={currentStep === 1}
                className={`h-8 w-8 flex items-center justify-center rounded-full transition-colors ${
                  currentStep === 1
                    ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                    : 'bg-secondary-900 text-white hover:bg-secondary-800'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {/* Breadcrumb - Always Show All Steps Up To Current */}
              <div className="flex items-center gap-1.5 text-xs">
                {/* Step 1 */}
                <button
                  onClick={() => setCurrentStep(1)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    currentStep === 1
                      ? 'bg-primary-600 text-white'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  Chọn Bàn & Thông Tin
                </button>
                
                {/* Step 2 */}
                {currentStep >= 2 && (
                  <>
                    <ChevronLeft className="h-3.5 w-3.5 text-secondary-400 rotate-180" />
                    <button
                      onClick={() => setCurrentStep(2)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        currentStep === 2
                          ? 'bg-primary-600 text-white'
                          : 'text-secondary-600 hover:bg-secondary-100'
                      }`}
                    >
                      Chọn Menu
                    </button>
                  </>
                )}
                
                {/* Step 3 */}
                {currentStep >= 3 && (
                  <>
                    <ChevronLeft className="h-3.5 w-3.5 text-secondary-400 rotate-180" />
                    <button
                      onClick={() => setCurrentStep(3)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        currentStep === 3
                          ? 'bg-primary-600 text-white'
                          : 'text-secondary-600 hover:bg-secondary-100'
                      }`}
                    >
                      Tổng Kết Đơn
                    </button>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleClose}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-secondary-900 text-white hover:bg-secondary-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Step 1: Table Selection & Customer Information (Merged) */}
          {currentStep === 1 && (
            <div className="h-full flex">
              {/* Left Panel - Table Selection */}
              <div className="flex-1 flex flex-col px-4 py-4 border-r border-secondary-200 relative">
                {/* Floor Tabs and Legend - Overlaid */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-secondary-200">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-primary-600 text-white'
                            : 'text-secondary-600 hover:bg-secondary-100'
                        }`}
                        title="Chế độ lưới"
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'list'
                            ? 'bg-primary-600 text-white'
                            : 'text-secondary-600 hover:bg-secondary-100'
                        }`}
                        title="Chế độ danh sách"
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Floor Dropdown - Only show in grid mode */}
                    {viewMode === 'grid' && (
                      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-secondary-200">
                        <select
                          value={selectedFloor}
                          onChange={(e) => setSelectedFloor(e.target.value)}
                          className="pl-4 pr-10 py-2.5 rounded-lg font-semibold text-sm text-secondary-700 bg-transparent outline-none cursor-pointer hover:bg-secondary-50 transition-colors appearance-none"
                          style={{ minWidth: '120px' }}
                        >
                          <option value="1st">Tầng 1</option>
                          <option value="2nd">Tầng 2</option>
                          <option value="3rd">Tầng 3</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-500 pointer-events-none" />
                      </div>
                    )}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-secondary-200">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded bg-white border-2 border-secondary-300"></div>
                      <span className="text-xs text-secondary-600">Trống</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded bg-secondary-800"></div>
                      <span className="text-xs text-secondary-600">Đã Đặt</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded bg-warning-500"></div>
                      <span className="text-xs text-secondary-600">Đang Dùng</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded bg-secondary-300"></div>
                      <span className="text-xs text-secondary-600">Không Dùng</span>
                    </div>
                  </div>
                </div>

                {/* Table Display - Grid or List */}
                <div className="flex-1 overflow-y-auto pt-16">
                  {viewMode === 'grid' ? (
                    /* Grid View */
                    <div className="grid grid-cols-5 gap-4 p-4 auto-rows-min">
                      {tables[selectedFloor].map((table, index) => {
                        // Handle empty spaces
                        if (!table) {
                          return <div key={`empty-${index}`} className="w-24 h-24"></div>
                        }
                        
                        const { baseStyles, statusStyles, sizeStyles, colSpan, canSelect } = getTableStyles(table, peopleCount)
                        return (
                          <div
                            key={table.id}
                            onClick={() => canSelect && setSelectedTable(table)}
                            className={`${baseStyles} ${statusStyles} ${sizeStyles} ${colSpan}`}
                          >
                            {/* Table content */}
                            <div className="text-center">
                              <div className="text-lg font-bold mb-1">{table.name}</div>
                              <div className="text-xs opacity-90">{table.seats} chỗ</div>
                              
                              {table.status === 'reserved' && table.time && (
                                <div className="flex items-center justify-center gap-1 text-xs mt-1.5">
                                  <Clock className="h-3 w-3" />
                                  <span>{table.time}</span>
                                </div>
                              )}
                              
                              {table.status === 'in-progress' && table.orderId && (
                                <div className="text-xs mt-1.5">
                                  #{table.orderId}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    /* List View */
                    <div className="px-4 py-4 space-y-6">
                      {['1st', '2nd', '3rd'].map((floor) => {
                        // Filter suitable tables for this floor and sort by seats
                        const floorTables = tables[floor]
                          .filter(table => {
                            if (!table) return false
                            const isSuitableSize = (peopleCount <= 4 && (table.seats === 2 || table.seats === 4)) ||
                                                   (peopleCount > 4 && (table.seats === 6 || table.seats === 8))
                            return isSuitableSize && table.status === 'available'
                          })
                          .sort((a, b) => a.seats - b.seats) // Sort by seats ascending
                        
                        if (floorTables.length === 0) return null
                        
                        return (
                          <div key={floor}>
                            <h3 className="text-sm font-semibold text-secondary-700 mb-3 px-2">
                              {floor === '1st' ? 'Tầng 1' : floor === '2nd' ? 'Tầng 2' : 'Tầng 3'}
                              <span className="ml-2 text-xs font-normal text-secondary-500">({floorTables.length} bàn)</span>
                            </h3>
                            <div className="space-y-2">
                              {floorTables.map((table) => (
                                <button
                                  key={table.id}
                                  onClick={() => setSelectedTable(table)}
                                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                    selectedTable?.id === table.id
                                      ? 'border-primary-600 bg-primary-50'
                                      : 'border-secondary-200 bg-white hover:border-primary-400 hover:bg-primary-50/50'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-bold text-lg text-secondary-900">{table.name}</div>
                                      <div className="text-sm text-secondary-600 mt-0.5">{table.seats} chỗ ngồi</div>
                                    </div>
                                    {selectedTable?.id === table.id && (
                                      <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center">
                                        <div className="h-2 w-2 bg-white rounded-full"></div>
                                      </div>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                      
                      {/* No suitable tables message */}
                      {['1st', '2nd', '3rd'].every(floor => {
                        const floorTables = tables[floor].filter(table => {
                          if (!table) return false
                          const isSuitableSize = (peopleCount <= 4 && (table.seats === 2 || table.seats === 4)) ||
                                                 (peopleCount > 4 && (table.seats === 6 || table.seats === 8))
                          return isSuitableSize && table.status === 'available'
                        })
                        return floorTables.length === 0
                      }) && (
                        <div className="text-center py-8">
                          <div className="text-secondary-400 mb-2">
                            <LayoutGrid className="h-12 w-12 mx-auto" />
                          </div>
                          <p className="text-secondary-600 font-medium">Không có bàn phù hợp</p>
                          <p className="text-sm text-secondary-500 mt-1">Không có bàn trống phù hợp cho {peopleCount} người</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Customer Information */}
              <div className="w-80 flex flex-col px-6 py-4">
                <h2 className="text-lg font-bold text-secondary-900 mb-6">
                  Thông Tin Đơn Hàng
                </h2>

                {/* Selected Table Display */}
                {selectedTable && (
                  <div className="mb-6 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                    <div className="text-xs font-medium text-secondary-600 mb-1">Bàn Đã Chọn</div>
                    <div className="text-xl font-bold text-primary-600">{selectedTable.name}</div>
                  </div>
                )}

                {/* How many people */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Số Lượng Người
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDecrease}
                      className="h-9 w-9 flex items-center justify-center rounded-lg border-2 border-secondary-300 hover:bg-secondary-50 transition-colors"
                    >
                      <Minus className="h-4 w-4 text-secondary-700" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-2xl font-bold text-secondary-900">{peopleCount}</span>
                    </div>
                    <button
                      onClick={handleIncrease}
                      className="h-9 w-9 flex items-center justify-center rounded-lg border-2 border-secondary-300 hover:bg-secondary-50 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-secondary-700" />
                    </button>
                  </div>
                  
                  {/* Notification for no suitable tables */}
                  {(() => {
                    const suitableTables = tables[selectedFloor].filter(table => 
                      table && 
                      table.status === 'available' && 
                      ((peopleCount <= 4 && (table.seats === 2 || table.seats === 4)) ||
                       (peopleCount > 4 && (table.seats === 6 || table.seats === 8)))
                    )
                    
                    if (suitableTables.length === 0) {
                      return (
                        <div className="mt-2 p-2 bg-warning-50 border border-warning-200 rounded-lg">
                          <p className="text-xs text-warning-700 text-center">
                            Không có bàn phù hợp cho {peopleCount} người trên tầng này
                          </p>
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>

                {/* Baby Chair */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Ghế Trẻ Em
                  </label>
                  <div className={`flex items-center gap-3 ${!selectedTable ? 'opacity-50 pointer-events-none' : ''}`}>
                    <button
                      onClick={handleBabyChairDecrease}
                      disabled={!selectedTable || babyChairCount === 0}
                      className="h-9 w-9 flex items-center justify-center rounded-lg border-2 border-secondary-300 hover:bg-secondary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4 text-secondary-700" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-2xl font-bold text-secondary-900">{babyChairCount}</span>
                    </div>
                    <button
                      onClick={handleBabyChairIncrease}
                      disabled={!selectedTable || babyChairCount >= (selectedTable ? (selectedTable.seats === 2 || selectedTable.seats === 4 ? 2 : 4) : 0)}
                      className="h-9 w-9 flex items-center justify-center rounded-lg border-2 border-secondary-300 hover:bg-secondary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4 text-secondary-700" />
                    </button>
                  </div>
                  
                  {/* Notification when no table selected */}
                  {!selectedTable && (
                    <div className="mt-2 p-2 bg-secondary-50 border border-secondary-200 rounded-lg">
                      <p className="text-xs text-secondary-600 text-center">
                        Vui lòng chọn bàn trước
                      </p>
                    </div>
                  )}
                  
                  {/* Max baby chairs info */}
                  {selectedTable && (
                    <div className="mt-2">
                      <p className="text-xs text-secondary-500 text-center">
                        Tối đa {selectedTable.seats === 2 || selectedTable.seats === 4 ? '2' : '4'} ghế trẻ em
                      </p>
                    </div>
                  )}
                </div>

                {/* Seat Requirements */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Yêu Cầu Bổ Sung
                  </label>
                  <textarea
                    value={seatRequirements}
                    onChange={(e) => setSeatRequirements(e.target.value)}
                    placeholder="Ví dụ: Gần cửa sổ, khu vực yên tĩnh..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-secondary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                  />
                </div>

                {/* Continue Button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full gap-2 mt-auto"
                  onClick={handleContinue}
                  disabled={!selectedTable}
                >
                  <span>Tiếp Tục</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

        {/* Step 2: Select Menu */}
        {currentStep === 2 && (
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
                    <h3 className="text-base font-bold text-secondary-900">Chi Tiết Đơn</h3>
                  </div>
                  <button
                    onClick={() => setOrderItems([])}
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
                {orderItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart className="h-12 w-12 text-secondary-300 mb-2" />
                    <p className="text-sm text-secondary-500 font-medium mb-1">Chưa Có Món Nào</p>
                    <p className="text-xs text-secondary-400">
                      Chọn món bên trái và <span className="font-semibold">Thêm Vào Giỏ</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 pb-44">
                    {orderItems.map((item) => (
                      <div
                        key={item.cartId}
                        className="bg-white rounded-lg p-2 border border-secondary-200"
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
                )}
              </div>

              {/* Order Summary - Fixed Overlay Footer */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t border-secondary-200 bg-white shadow-lg">
                <div className="space-y-1.5 mb-3">
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

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleContinue}
                  disabled={orderItems.length === 0}
                >
                  Tiếp Tục
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Order Summary */}
        {currentStep === 3 && (
          <div className="flex-1 overflow-hidden flex h-full">
            {/* Left Panel - Order Items Grid */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="px-4 py-3 border-b border-secondary-200">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-secondary-700" />
                  <h3 className="text-base font-bold text-secondary-900">Thông Tin Đơn Hàng</h3>
                </div>
              </div>

              {/* Scrollable Content Area with Grid */}
              <div className="flex-1 overflow-hidden relative">
                {/* Order Items Grid - 2 columns */}
                <div className="absolute inset-0 overflow-y-auto px-4 py-3 pb-40">
                  <div className="grid grid-cols-2 gap-3">
                    {orderItems.map((item) => (
                      <div
                        key={item.cartId}
                        className="bg-white rounded-lg border border-secondary-200 overflow-hidden"
                      >
                        {/* Item Image */}
                        <div className="relative h-24 bg-secondary-100">
                          <img
                            src="/images/food/wagyu_steak.jpg"
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Quantity Badge */}
                          <div className="absolute top-2 right-2 bg-secondary-900 text-white px-2 py-1 rounded text-xs font-semibold">
                            x{item.quantity}
                          </div>
                        </div>
                        
                        {/* Item Info */}
                        <div className="p-2.5">
                          <h4 className="font-semibold text-sm text-secondary-900 mb-1 line-clamp-1">
                            {item.name}
                          </h4>
                          
                          {/* Add-ons */}
                          {item.addOns && item.addOns.length > 0 && (
                            <div className="text-xs text-secondary-500 mb-1 line-clamp-1">
                              <span className="font-medium">Thêm:</span> {item.addOns.map(a => a.name).join(', ')}
                            </div>
                          )}
                          
                          {/* Note */}
                          {item.note && (
                            <div className="text-xs text-secondary-500 italic mb-2 line-clamp-1">
                              {item.note}
                            </div>
                          )}
                          
                          {/* Price */}
                          <div className="text-sm font-bold text-primary-600">
                            {((item.totalPrice || item.price) * item.quantity).toLocaleString('vi-VN')}₫
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Summary - Fixed Overlay Footer */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-secondary-200 shadow-lg">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary-600">Tạm Tính</span>
                      <span className="font-semibold text-secondary-900">{subtotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary-600">Thuế 12%</span>
                      <span className="font-semibold text-secondary-900">{tax.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="h-px bg-secondary-200 my-1.5" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-base text-secondary-900">Tổng Thanh Toán</span>
                      <span className="text-xl font-bold text-secondary-900">{total.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Customer Info Summary */}
            <div className="w-80 flex flex-col px-6 py-4 border-l border-secondary-200">
              <h2 className="text-lg font-bold text-secondary-900 mb-6">
                Thông Tin Khách Hàng
              </h2>

              {/* Table Information */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Bàn Đã Chọn
                </label>
                {selectedTable && (
                  <div className="bg-primary-50 rounded-lg p-3 border-2 border-primary-600">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-primary-900">{selectedTable.name}</span>
                      <span className="text-xs text-primary-700 font-medium">
                        Tầng {selectedFloor === '1st' ? '1' : selectedFloor === '2nd' ? '2' : '3'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Guest Count */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Số Khách
                </label>
                <div className="bg-white rounded-lg p-3 border border-secondary-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Người lớn</span>
                    <span className="text-base font-bold text-secondary-900">{peopleCount}</span>
                  </div>
                </div>
              </div>

              {/* Baby Chair */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Ghế Trẻ Em
                </label>
                <div className="bg-white rounded-lg p-3 border border-secondary-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Số lượng</span>
                    <span className="text-base font-bold text-secondary-900">{babyChairCount > 0 ? babyChairCount : 'Không'}</span>
                  </div>
                </div>
              </div>

              {/* Seat Requirements */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Yêu Cầu Bổ Sung
                </label>
                <div className="bg-white rounded-lg p-3 border border-secondary-200">
                  {seatRequirements ? (
                    <p className="text-sm text-secondary-700">{seatRequirements}</p>
                  ) : (
                    <p className="text-sm text-secondary-400 italic">Không có</p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-auto space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => handleCreateOrder(false)}
                >
                  Lưu
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => handleCreateOrder(true)}
                >
                  Lưu & Gửi Bếp
                </Button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
      
      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => {
          setIsAddItemModalOpen(false)
          setEditingItem(null)
        }}
        item={selectedMenuItem}
        onAddToCart={handleAddItemWithAddOns}
        editMode={!!editingItem}
        existingItem={editingItem}
      />
    </Modal>
  )
}

export default CreateOrderModal
