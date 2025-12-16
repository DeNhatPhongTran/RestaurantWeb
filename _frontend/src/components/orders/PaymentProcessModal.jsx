import { CreditCard, Delete, Phone, QrCode, Receipt, Star, User, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { findCustomer } from '../../data'
import { formatCurrency } from '../../utils'
import { ModalHeader } from '../common'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs'
import PaymentSuccessModal from './PaymentSuccessModal'
  // Reset cash input when switching to cash tab
  
const PaymentProcessModal = ({ isOpen, onClose, order, orderItems = [], onProcessPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [cashAmount, setCashAmount] = useState('0')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerInfo, setCustomerInfo] = useState(null)
  const [usePoints, setUsePoints] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successInfo, setSuccessInfo] = useState(null)
  // Card EDC instruction step
  const [showCardEDCStep, setShowCardEDCStep] = useState(false)

  useEffect(() => {
    setShowCardEDCStep(false)
    if (paymentMethod === 'cash') {
      setCashAmount('0')
    }
  }, [paymentMethod])


  if (!isOpen || !order) return null

  const handleClose = () => {
    setCashAmount('0')
    setCustomerPhone('')
    setCustomerInfo(null)
    setUsePoints(0)
    onClose()
  }

  // Calculate order totals
  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const subtotal = calculateSubtotal()
  const taxRate = 0.12
  const taxAmount = subtotal * taxRate
  const memberDiscount = usePoints > 0 && customerInfo ? usePoints * 10000 : 0
  const totalPayment = subtotal + taxAmount - memberDiscount

  // Vietnamese cash denominations: 1K, 2K, 5K, 10K, 20K, 50K, 100K, 200K, 500K, 1M, 2M, 5M, 10M
  const VND_DENOMS = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000]
  // Generate smart quick amount suggestions based on total
  const generateQuickAmounts = (total) => {
    const suggestions = []
    // Always include the exact total (rounded to nearest 1K)
    const roundedTotal = Math.round(total / 1000) * 1000
    suggestions.push(roundedTotal)
    // Find the next highest denomination
    const nextDenom = VND_DENOMS.find(d => d >= roundedTotal)
    if (nextDenom && !suggestions.includes(nextDenom)) suggestions.push(nextDenom)
    // Add next two closest higher multiples of 10k or 50k
    const next10k = Math.ceil(roundedTotal / 10000) * 10000
    if (next10k > roundedTotal && !suggestions.includes(next10k)) suggestions.push(next10k)
    const next50k = Math.ceil(roundedTotal / 50000) * 50000
    if (next50k > roundedTotal && !suggestions.includes(next50k)) suggestions.push(next50k)
    // Sort and return up to 4 unique suggestions
    return Array.from(new Set(suggestions)).sort((a, b) => a - b).slice(0, 4)
  }

  const quickAmounts = generateQuickAmounts(totalPayment)

  const handleNumberClick = (num) => {
    if (cashAmount === '0') {
      setCashAmount(num.toString())
    } else {
      setCashAmount(cashAmount + num.toString())
    }
  }

  const handleBackspace = () => {
    if (cashAmount.length > 1) {
      setCashAmount(cashAmount.slice(0, -1))
    } else {
      setCashAmount('0')
    }
  }

  const handleQuickAmount = (amount) => {
    setCashAmount(amount.toString())
  }

  const handleSearchCustomer = () => {
    // Search for customer by phone or member code
    const customer = findCustomer(customerPhone)
    setCustomerInfo(customer)
  }

  const handleClearCustomer = () => {
    setCustomerPhone('')
    setCustomerInfo(null)
    setUsePoints(0)
  }

  const handlePayNow = () => {
    const cashReceived = parseFloat(cashAmount)
    const change = cashReceived - totalPayment
    setSuccessInfo({
      total: totalPayment,
      method: paymentMethod,
      customerPays: paymentMethod === 'cash' ? cashReceived : totalPayment,
      change: paymentMethod === 'cash' ? change : 0,
    })
    setShowSuccess(true)
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    setSuccessInfo(null)
    onProcessPayment({
      orderId: order.id,
      paymentMethod,
      amount: totalPayment,
      cashReceived: paymentMethod === 'cash' ? parseFloat(cashAmount) : totalPayment,
      change: paymentMethod === 'cash' ? parseFloat(cashAmount) - totalPayment : 0,
      customerInfo,
      pointsUsed: usePoints && customerInfo ? customerInfo.points : 0,
    })
    handleClose()
  }

  // Icon styles
  const iconClass = "w-4 h-4 text-primary-500 inline-block align-middle mr-1"

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div 
          className="bg-white rounded-t-2xl shadow-2xl w-full h-[95vh] overflow-hidden flex flex-col animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <ModalHeader
            title="Thanh Toán"
            icon={CreditCard}
            onClose={handleClose}
          />

          {/* Content - Split into two columns */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 h-full">
              {/* Left Column - Customer & Order Details */}
              <div className="flex flex-col space-y-3 overflow-hidden">
                {/* Customer Information */}
                <div className="flex-shrink-0">
                  <h3 className="text-sm font-semibold text-secondary-700 mb-2 flex items-center">
                    <User className={iconClass} /> Thông Tin Khách Hàng
                  </h3>
                  <div className="bg-secondary-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar initials={customerInfo?.name?.[0] || 'K'} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-secondary-900 truncate">
                          {customerInfo?.name || 'Khách'}
                        </div>
                        <div className="text-xs text-secondary-600">
                          Đơn# {order.orderNumber} / Tại Chỗ
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-secondary-600">
                          {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </div>
                        <div className="text-xs text-secondary-600">
                          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Customer Search */}
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Mã Khách Hàng"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={customerInfo !== null}
                      />
                      {customerInfo ? (
                        <Button
                          variant="outline"
                          size="md"
                          onClick={handleClearCustomer}
                        >
                          Xóa
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="md"
                          onClick={handleSearchCustomer}
                        >
                          Tìm
                        </Button>
                      )}
                    </div>

                    {/* Member Info */}
                    {customerInfo && (
                      <div className="border-t border-secondary-200 pt-2 space-y-1.5">
                        {/* First Row: Name and Member Code */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-secondary-900">{customerInfo.name}</div>
                          <div className="text-xs text-secondary-600">
                            ID: <span className="font-semibold text-secondary-900">{customerInfo.id}</span>
                          </div>
                        </div>
                        
                        {/* Second Row: Phone */}
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-secondary-600">
                            <Phone className="w-3.5 h-3.5 mr-1 text-primary-400" /> SĐT: {customerInfo.phone}
                          </div>
                        </div>
                        
                        {/* Third Row: Points and Use Points Input */}
                        <div className="pt-0.5">
                          <div className="flex items-center justify-between gap-2">
                           
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-secondary-900">Dùng Điểm:</span>
                              <input
                                type="number"
                                min="0"
                                max={customerInfo.points}
                                value={usePoints}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0
                                  setUsePoints(Math.min(Math.max(0, value), customerInfo.points))
                                }}
                                className="w-20 px-2 py-1 text-sm text-right border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="0"
                              />
                            </div>
                             <div className="text-sm flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-400" />
                              <span className="text-secondary-600">Điểm:</span> <span className="font-bold text-primary-600">{customerInfo.points.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="text-xs text-secondary-500 mt-0.5">100 điểm = 1.000.000₫</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Details */}
                <div className="flex-1 flex flex-col min-h-0">
                  <h3 className="text-sm font-semibold text-secondary-700 mb-2 flex-shrink-0 flex items-center">
                    <Receipt className={iconClass} /> Chi Tiết Đơn Hàng
                  </h3>
                  <div className="bg-secondary-50 rounded-lg p-3 flex-1 flex flex-col min-h-0">
                    <div className="flex-1 space-y-1.5 overflow-y-auto min-h-0">
                      {orderItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex-1 min-w-0 mr-2">
                            <div className="font-medium text-secondary-900 truncate">{item.name}</div>
                            <div className="text-xs text-secondary-600">{formatCurrency(item.price)}</div>
                          </div>
                          <div className="text-xs text-secondary-600 mr-2 flex-shrink-0">x {item.quantity}</div>
                          <div className="font-semibold text-secondary-900 flex-shrink-0">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-secondary-200 pt-2 mt-2 space-y-1 flex-shrink-0">
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-600">Tạm Tính</span>
                        <span className="font-semibold text-secondary-900">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-600">Thuế 12%</span>
                        <span className="font-semibold text-secondary-900">{formatCurrency(Math.round(taxAmount))}</span>
                      </div>
                      {usePoints > 0 && customerInfo && (
                        <div className="flex justify-between text-sm">
                          <span className="text-success-600">Điểm Thành Viên ({usePoints.toLocaleString()} điểm)</span>
                          <span className="font-semibold text-success-600">- {formatCurrency(memberDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base pt-1 border-t border-secondary-200">
                        <span className="font-bold text-secondary-900">Tổng Thanh Toán</span>
                        <span className="text-lg font-bold text-primary-600">{formatCurrency(Math.round(totalPayment))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Input */}
              <div className="flex flex-col space-y-2 overflow-hidden">
                {/* Payment Method Tabs */}
                <div className="flex-shrink-0">
                  <Tabs>
                    <TabsList className="border-0 bg-secondary-100 rounded-lg p-1">
                      <TabsTrigger
                        isActive={paymentMethod === 'cash'}
                        onClick={() => setPaymentMethod('cash')}
                        className={`flex-1 rounded-md border-0 text-sm ${
                          paymentMethod === 'cash' 
                            ? 'bg-white text-primary-600 shadow-sm' 
                            : 'text-secondary-600'
                        }`}
                      >
                        <Wallet className="w-4 h-4 mr-1 inline-block align-middle" /> Tiền Mặt
                      </TabsTrigger>
                      <TabsTrigger
                        isActive={paymentMethod === 'card'}
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 rounded-md border-0 text-sm ${
                          paymentMethod === 'card' 
                            ? 'bg-white text-primary-600 shadow-sm' 
                            : 'text-secondary-600'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 mr-1 inline-block align-middle" /> Thẻ
                      </TabsTrigger>
                      <TabsTrigger
                        isActive={paymentMethod === 'qr'}
                        onClick={() => setPaymentMethod('qr')}
                        className={`flex-1 rounded-md border-0 text-sm ${
                          paymentMethod === 'qr' 
                            ? 'bg-white text-primary-600 shadow-sm' 
                            : 'text-secondary-600'
                        }`}
                      >
                        <QrCode className="w-4 h-4 mr-1 inline-block align-middle" /> Mã QR
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Cash Input Section */}
                {paymentMethod === 'cash' && (
                  <div className="flex-1 flex flex-col space-y-2 overflow-hidden">
                    <div className="flex-shrink-0">
                      <h3 className="text-sm font-semibold text-secondary-900 mb-0.5">Nhập Số Tiền</h3>
                      <p className="text-xs text-secondary-600">
                        Nhập số tiền khách hàng đưa.
                      </p>
                    </div>

                    {/* Cash Amount Display */}
                    <div className="bg-secondary-50 rounded-lg p-3 text-center flex-shrink-0">
                      <div className="text-2xl font-bold text-secondary-900">
                        {formatCurrency(parseFloat(cashAmount) || 0)}
                      </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-4 gap-1.5 flex-shrink-0">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleQuickAmount(amount)}
                          className="py-2 px-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
                        >
                          {formatCurrency(amount)}
                        </button>
                      ))}
                    </div>

                    {/* Number Pad */}
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleNumberClick(num)}
                          className="text-xl font-semibold text-secondary-900 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => handleNumberClick(0)}
                        className="col-span-2 text-xl font-semibold text-secondary-900 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
                      >
                        0
                      </button>
                      <button
                        onClick={handleBackspace}
                        className="flex items-center justify-center text-secondary-900 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
                      >
                        <Delete className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Change Display - Always show */}
                    <div className="bg-success-50 border border-success-200 rounded-lg py-1 px-3 text-center flex items-center justify-between">
                      <div className="text-sm text-success-700 font-medium">Tiền Thừa</div>
                      <div className="text-xl font-bold text-success-700">
                        {formatCurrency(Math.max(0, Math.round(parseFloat(cashAmount) - totalPayment)))}
                      </div>
                    </div>

                    {/* Pay Now Button */}
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full"
                      onClick={handlePayNow}
                      disabled={paymentMethod === 'cash' && parseFloat(cashAmount) < totalPayment}
                    >
                      Xác nhận thanh toán thành công
                    </Button>
                  </div>
                )}

                {/* Card Payment Section - EDC Step Logic */}
                {paymentMethod === 'card' && (
                  <div className="flex-1 flex flex-col justify-center items-center space-y-4 w-full">
                    {!showCardEDCStep ? (
                      <>
                        {/* Payment Summary Box */}
                        <div className="w-full bg-white rounded-xl border border-secondary-200 p-5 flex flex-row items-center justify-between shadow-sm">
                          <div className="text-base text-secondary-600 mb-1">Tổng Thanh Toán</div>
                          <div className="text-2xl font-bold text-primary-600 mb-2">{formatCurrency(Math.round(totalPayment))}</div>
                        </div>
                        {/* Confirm Pay Button */}
                        <Button
                          variant="primary"
                          size="md"
                          className="w-full mt-2 text-lg font-semibold"
                          onClick={() => setShowCardEDCStep(true)}
                        >
                          Xác Nhận & Tiến Hành Thanh Toán Bằng Thẻ
                        </Button>
                      </>
                    ) : (
                      <div className="w-full flex flex-col items-center justify-center">
                        <div className="w-full bg-white rounded-xl border border-secondary-200 p-6 flex flex-col items-center shadow-sm">
                          <div className="flex justify-center mb-3">
                            
                            <img
                                src="/images/icons/edc_machine.png"
                                alt="EDC Machine"
                                className="object-contain"
                                width={300}
                                height={300}
                                onClick={handlePayNow}       
                            />
                              
                          </div>
                          <div className="text-lg font-semibold text-secondary-900 mb-1 text-center">Chạm hoặc quẹt thẻ tại máy EDC</div>
                          <div className="text-sm text-secondary-500 mb-4 text-center">Tiếp theo, bạn có thể làm theo hướng dẫn trên máy EDC.</div>
                          <div className="w-full flex justify-between items-center border-t border-secondary-200 pt-3 mt-2">
                            <span className="text-base text-secondary-600">Tổng Thanh Toán</span>
                            <span className="text-lg font-bold text-primary-600">{formatCurrency(Math.round(totalPayment))}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* QR Code Payment Section */}
                {paymentMethod === 'qr' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">

                     <div className="w-full flex flex-col items-center justify-center">
                        <div className="w-full bg-white rounded-xl border border-secondary-200 p-6 flex flex-col items-center shadow-sm">
                          <p className="text-sm text-secondary-600 mb-4">Quét mã QR để thanh toán</p>
                           <div className="text-lg font-semibold text-secondary-900 mb-1 text-center">Nhà Hàng NewGroup04</div>
                          <div className="flex justify-center mb-3">
                            
                            <img
                                src="/images/icons/qr_code.png"
                                alt="Sample QR Code"
                                className="object-contain"
                                width={300}
                                height={300}        
                            />
                              
                          </div>
                          <div className='w-full flex flex-col items-center border-t border-secondary-200 pt-3 mt-2 gap-2'>
                            <div className="w-full flex justify-between">
                                <span className="text-base text-secondary-600">Tổng Thanh Toán</span>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(Math.round(totalPayment))}</span> 
                            </div>
                            <Button
                            variant="primary"
                            size="md"
                            className="w-full"
                            onClick={handlePayNow}
                            >
                            Xác Nhận Thanh Toán Thành Công
                            </Button>
                            
                          </div>
                        </div>
                      </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Success Modal */}
          <PaymentSuccessModal
            isOpen={showSuccess}
            onClose={handleSuccessClose}
            paymentInfo={successInfo}
            onPrintBill={handleSuccessClose}
          />
        </div>
      </div>
    </>
  )
}

export default PaymentProcessModal
