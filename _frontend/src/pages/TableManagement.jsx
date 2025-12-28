import { Plus, Grid, List } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import TableGrid from '../components/table-management/TableGrid'
import CreateTableModal from '../components/table-management/CreateTableModal'
import EditTableModal from '../components/table-management/EditTableModal'
import DeleteTableConfirmModal from '../components/table-management/DeleteTableConfirmModal'
import WaiterOrderModal from '../components/table-management/WaiterOrderModal'
import { useApi } from '../context/ApiContext'

const TableManagement = ({userRole}) => {
    const navigate = useNavigate()
    const { apiCall } = useApi()
    const [tables, setTables] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid') // grid or image

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isWaiterOrderOpen, setIsWaiterOrderOpen] = useState(false)

    const [selectedTable, setSelectedTable] = useState(null)
    const [selectedReservation, setSelectedReservation] = useState(null)

    // Fetch tables
    useEffect(() => {
        fetchTables()
    }, [])

    const fetchTables = async () => {
        setLoading(true)
        try {
            const res = await apiCall('/api/tables/list', {
                method: 'GET',
            })
            console.log('API tables response:', res.data)
            if (res.success) {
                setTables(res.data?.data || [])
            }
        } catch (error) {
            console.error('Error fetching tables:', error)
        } finally {
            setLoading(false)
        }
    }

    // Handle table click based on role
    const handleTableClick = async (table) => {
        // Only manager and waiter can interact with tables
        if (!['manager', 'waiter'].includes(userRole)) {
            return
        }

        setSelectedTable(table)

        // Manager: Just open the table, no modal needed (click already expanded)
        if (userRole === 'manager') {
            return
        }

        // Waiter: Get reservation and open order modal
        if (userRole === 'waiter') {
            try {
                const res = await apiCall(`/api/reservations/by-table/${table._id}`, {
                    method: 'GET',
                })
                if (res.success && res.data) {
                    setSelectedReservation(res.data)
                    setIsWaiterOrderOpen(true)
                }
            } catch (error) {
                console.error('Error fetching reservation:', error)
            }
        }

        // Cashier and Chef: No action
    }

    // Create table
    const handleCreateTable = async (tableData) => {
        try {
            const res = await apiCall('/api/tables', {
                method: 'POST',
                body: JSON.stringify(tableData),
            })

            if (res.success) {
                await fetchTables()
                setIsCreateModalOpen(false)
            }
        } catch (error) {
            console.error('Error creating table:', error)
        }
    }

    // Edit table
    const handleEditTable = (table) => {
        setSelectedTable(table)
        setIsEditModalOpen(true)
    }

    const handleSaveEdit = async (updatedData) => {
        try {
            const res = await apiCall(`/api/tables/${selectedTable._id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedData),
            })

            if (res.success) {
                await fetchTables()
                setIsEditModalOpen(false)
                setSelectedTable(null)
            }
        } catch (error) {
            console.error('Error updating table:', error)
        }
    }

    // Delete table
    const handleDeleteTable = (table) => {
        setSelectedTable(table)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            const res = await apiCall(`/api/tables/${selectedTable._id}`, {
                method: 'DELETE',
            })

            if (res.success) {
                await fetchTables()
                setIsDeleteModalOpen(false)
                setSelectedTable(null)
            }
        } catch (error) {
            console.error('Error deleting table:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-lg text-secondary-600">Đang tải...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Header */}
            <div className="bg-white border-b border-secondary-200 p-6 sticky top-0 z-40">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-secondary-900">
                        {userRole === 'cashier'
                            ? '💳 Thanh Toán'
                            : userRole === 'waiter'
                                ? '👨‍💼 Quản Lý Đơn Hàng'
                                : '🍽️ Quản Lý Bàn'}
                    </h1>
                    <div className="flex items-center gap-3">
                        {userRole === 'manager' && (
                            <>
                                <div className="flex items-center gap-2 bg-secondary-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded transition-all ${viewMode === 'grid'
                                            ? 'bg-white shadow'
                                            : 'text-secondary-600 hover:text-secondary-900'
                                            }`}
                                        title="Chế độ lưới"
                                    >
                                        <Grid className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('image')}
                                        className={`p-2 rounded transition-all ${viewMode === 'image'
                                            ? 'bg-white shadow'
                                            : 'text-secondary-600 hover:text-secondary-900'
                                            }`}
                                        title="Chế độ bố cục thực tế"
                                    >
                                        <List className="h-5 w-5" />
                                    </button>
                                </div>
                                <Button
                                    variant="primary"
                                    size="md"
                                    className="flex items-center gap-2"
                                    onClick={() => setIsCreateModalOpen(true)}
                                >
                                    <Plus className="h-5 w-5" />
                                    Thêm Bàn
                                </Button>
                            </>
                        )}
                        {userRole === 'waiter' && (
                            <Button
                                variant="primary"
                                size="md"
                                className="flex items-center gap-2"
                                onClick={() => navigate('/reservations')}
                            >
                                <Plus className="h-5 w-5" />
                                Đặt Bàn
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                    <div className="bg-secondary-50 px-4 py-2 rounded-lg">
                        <p className="text-sm text-secondary-600">Tổng bàn</p>
                        <p className="text-2xl font-bold text-secondary-900">{tables.length}</p>
                    </div>
                    <div className="bg-primary-50 px-4 py-2 rounded-lg">
                        <p className="text-sm text-primary-600">Đang phục vụ</p>
                        <p className="text-2xl font-bold text-primary-700">
                            {tables.filter((t) => t.currentStatus === 'serving').length}
                        </p>
                    </div>
                    <div className="bg-success-50 px-4 py-2 rounded-lg">
                        <p className="text-sm text-success-600">Trống</p>
                        <p className="text-2xl font-bold text-success-700">
                            {tables.filter((t) => t.currentStatus === 'empty').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <TableGrid
                    tables={tables}
                    userRole={userRole}
                    viewMode={viewMode}
                    onTableClick={handleTableClick}
                    onEditTable={handleEditTable}
                    onDeleteTable={handleDeleteTable}
                />
            </div>

            {/* Modals */}
            {userRole === 'manager' && (
                <>
                    <CreateTableModal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onCreateTable={handleCreateTable}
                    />

                    <EditTableModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false)
                            setSelectedTable(null)
                        }}
                        table={selectedTable}
                        onSave={handleSaveEdit}
                    />

                    <DeleteTableConfirmModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            setIsDeleteModalOpen(false)
                            setSelectedTable(null)
                        }}
                        table={selectedTable}
                        onConfirmDelete={handleConfirmDelete}
                    />
                </>
            )}

            {userRole === 'waiter' && (
                <WaiterOrderModal
                    isOpen={isWaiterOrderOpen}
                    onClose={() => {
                        setIsWaiterOrderOpen(false)
                        setSelectedTable(null)
                        setSelectedReservation(null)
                    }}
                    table={selectedTable}
                    reservation={selectedReservation}
                    onOrderUpdate={() => {
                        fetchTables()
                    }}
                />
            )}
        </div>
    )
}

export default TableManagement
