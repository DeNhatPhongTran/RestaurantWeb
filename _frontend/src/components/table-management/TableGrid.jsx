import { Edit, Trash2 } from 'lucide-react'
import React, { useState } from 'react'

const TableGrid = ({ tables, userRole, viewMode = 'grid', onTableClick, onEditTable, onDeleteTable }) => {
  const [expandedTableId, setExpandedTableId] = useState(null)

  // Group tables by floor (A, B, C)
  const groupedTables = {
    'A': tables.filter(t => t.name?.startsWith('A')),
    'B': tables.filter(t => t.name?.startsWith('B')),
    'C': tables.filter(t => t.name?.startsWith('C')),
  }

  // Xác định kích thước bàn dựa trên capacity
  const getTableSize = (capacity) => {
    if (capacity <= 2) return { base: 'w-24 h-24', colSpan: '' }
    if (capacity === 4) return { base: 'w-24 h-24', colSpan: '' }
    if (capacity === 6) return { base: 'w-48 h-24', colSpan: 'col-span-2' }
    return { base: 'w-48 h-24', colSpan: 'col-span-2' }
  }

  const getStatusColor = (table) => {
    if (table.isUsed) {
      return 'bg-red-100 text-red-900 border-2 border-red-300 hover:border-red-400 hover:shadow-md'
    } else {
      return 'bg-green-100 text-green-900 border-2 border-green-300 hover:border-green-400 hover:shadow-md'
    }
  }

  const TableCard = ({ table }) => {
    const isDisabled = ['chef', 'cashier', 'guest'].includes(userRole)
    const isManager = userRole === 'manager'
    const isWaiter = userRole === 'waiter'
    const isExpanded = expandedTableId === table._id
    const size = viewMode === 'image' ? getTableSize(table.capacity) : { base: 'w-24 h-24', colSpan: '' }

    return (
      <div className="relative">
        <button
          onClick={() => {
            if (isManager || isWaiter) {
              setExpandedTableId(isExpanded ? null : table._id)
            }
            if (!isDisabled && (isWaiter || isManager)) {
              onTableClick(table)
            }
          }}
          className={`${size.base} rounded-xl font-bold text-center flex flex-col items-center justify-center transition-all ${getStatusColor(
            table
          )} ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          disabled={isDisabled}
        >
          <div className="text-lg font-bold">{table.name}</div>
          <div className="text-xs opacity-75">
            {table.capacity} chỗ
          </div>
        </button>

        {/* Manager Action Buttons - Visible when expanded */}
        {isManager && isExpanded && (
          <div className="absolute top-full mt-2 left-0 right-0 flex gap-2 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEditTable(table)
                setExpandedTableId(null)
              }}
              className="flex-1 p-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 shadow-lg transition-colors"
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4 inline-block mr-1" /> Sửa
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteTable(table)
                setExpandedTableId(null)
              }}
              className="flex-1 p-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 shadow-lg transition-colors"
              title="Xóa"
            >
              <Trash2 className="h-4 w-4 inline-block mr-1" /> Xóa
            </button>
          </div>
        )}
      </div>
    )
  }

  // Grid View - Lưới đều
  const renderGridView = () => (
    <div className="space-y-8">
      {/* Floor A */}
      {groupedTables.A.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">🏢 Tầng 1 (A)</h2>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {groupedTables.A.map((table) => (
              <div key={table._id} className="relative">
                <TableCard table={table} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floor B */}
      {groupedTables.B.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">🏢 Tầng 2 (B)</h2>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {groupedTables.B.map((table) => (
              <div key={table._id} className="relative">
                <TableCard table={table} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floor C */}
      {groupedTables.C.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">🏢 Tầng 3 (C)</h2>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {groupedTables.C.map((table) => (
              <div key={table._id} className="relative">
                <TableCard table={table} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tables.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-600 text-lg">Chưa có bàn nào được tạo</p>
        </div>
      )}
    </div>
  )

  // Image View - Bố cục thực tế (như CreateOrderModal)
  const renderImageView = () => (
    <div className="space-y-8">
      {/* Floor A */}
      {groupedTables.A.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">🏢 Tầng 1 (A)</h2>
          <div className="grid grid-cols-5 gap-4">
            {groupedTables.A.map((table) => (
              <div key={table._id} className="relative">
                <TableCard table={table} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floor B */}
      {groupedTables.B.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">🏢 Tầng 2 (B)</h2>
          <div className="grid grid-cols-5 gap-4">
            {groupedTables.B.map((table) => (
              <div key={table._id} className="relative">
                <TableCard table={table} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floor C */}
      {groupedTables.C.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">🏢 Tầng 3 (C)</h2>
          <div className="grid grid-cols-5 gap-4">
            {groupedTables.C.map((table) => (
              <div key={table._id} className="relative">
                <TableCard table={table} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tables.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-600 text-lg">Chưa có bàn nào được tạo</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="w-full">
      {viewMode === 'image' ? renderImageView() : renderGridView()}
    </div>
  )
}

export default TableGrid
