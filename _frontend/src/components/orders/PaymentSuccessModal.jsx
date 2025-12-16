import { CheckCircle } from 'lucide-react'
import React from 'react'
import { formatCurrency } from '../../utils'
import { Button } from '../ui/Button'

const PaymentSuccessModal = ({ isOpen, onClose, paymentInfo, onPrintBill }) => {
  if (!isOpen || !paymentInfo) return null

  const { total, method, customerPays, change } = paymentInfo

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
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col items-center justify-center pt-8 pb-2 bg-success-50">
            <CheckCircle className="w-16 h-16 text-success-700 mb-2" />
            <h2 className="text-2xl font-bold text-success-700 mb-1">Thanh toán thành công!</h2>
            <p className="text-sm text-secondary-500 mb-4">Đừng quên cảm ơn khách hàng</p>
          </div>
          <div className="border-t border-secondary-200 px-8 py-6 bg-secondary-50">
            <div className="mb-4">
              <div className="font-semibold text-secondary-700 mb-2">Chi tiết thanh toán</div>
              <div className="flex items-center justify-between mb-1 text-base">
                <span className="text-secondary-600">Tổng cộng</span>
                <span className="font-bold text-secondary-900">{formatCurrency(total)}</span>
              </div>
              <div className="flex items-center justify-between mb-1 text-base">
                <span className="text-secondary-600">Phương thức</span>
                <span className="font-bold text-primary-600">{method === 'cash' ? 'Tiền mặt' : method === 'card' ? 'Thẻ' : 'Mã QR'}</span>
              </div>
              <div className="flex items-center justify-between mb-1 text-base">
                <span className="text-secondary-600">Khách đưa</span>
                <span className="font-bold text-secondary-900">{formatCurrency(customerPays)}</span>
              </div>
              <div className="flex items-center justify-between mt-3 text-base">
                <span className=" text-secondary-600">Tiền thừa</span>
                <span className="font-bold text-secondary-900">{formatCurrency(change)}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="primary" size="md" className="flex-1" onClick={onClose}>
                Hoàn tất
              </Button>
              <Button variant="primary" size="md" className="flex-1" onClick={onPrintBill}>
                In hóa đơn & Hoàn tất
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentSuccessModal
