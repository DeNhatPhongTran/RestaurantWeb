import React, { useEffect, useState } from 'react'
import { Plus, Search, Edit2, Trash2, Calendar, Users, Phone, Clock, AlertCircle, X, CheckCircle2, LogIn, Flag, AlertOctagon, Building2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { ModalHeader } from '../components/common'
import { useApi } from '../context/ApiContext'

const ReservationsPage = ({userRole} ) => {
    const { apiCall } = useApi()
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeStatus, setActiveStatus] = useState('confirmed')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isTableSelectorOpen, setIsTableSelectorOpen] = useState(false)
    const [isCheckAvailableOpen, setIsCheckAvailableOpen] = useState(false)
    const [editingReservation, setEditingReservation] = useState(null)

    // Form state
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        guest_count: 2,
        datetime_checkin: '',
        datetime_out: '',
        selectedTables: [],
        status: 'confirmed',
    })

    const [availableTables, setAvailableTables] = useState([])
    const [busyTables, setBusyTables] = useState([])
    const [totalCapacity, setTotalCapacity] = useState(0)
    const [tableCheckLoading, setTableCheckLoading] = useState(false)

    // Fetch all reservations
    useEffect(() => {
        fetchReservations()
    }, [])

    const fetchReservations = async () => {
        setLoading(true)
        try {
            const res = await apiCall('/api/reservations/list', { method: 'GET' })
            console.log(res)
            if (res.success || Array.isArray(res)) {
                setReservations(res.success ? res.data : res)
            }
        } catch (error) {
            console.error('Error fetching reservations:', error)
        } finally {
            setLoading(false)
        }
    }

    // ============================
    // CHECK AVAILABLE TABLES
    // ============================
    const handleCheckAvailableTables = async () => {
        if (!formData.datetime_checkin || !formData.datetime_out) {
            alert('Vui lòng nhập đầy đủ giờ check-in và check-out')
            return
        }

        setTableCheckLoading(true)
        try {
            const res = await apiCall('/api/reservations/overlap_check', {
                method: 'POST',
                body: JSON.stringify({
                    from: new Date(formData.datetime_checkin),
                    to: new Date(formData.datetime_out),
                    exclude_reservation_id: editingReservation?._id
                }),
            })

            const available = res.data?.availableTables || []
            const busy = res.data?.overlapTables || []

            const syncedSelected = syncSelectedTables(available, busy, formData.selectedTables)

            setAvailableTables(available)
            setBusyTables(busy)
            setFormData(prev => ({
                ...prev,
                selectedTables: syncedSelected
            }))

            setTotalCapacity(syncedSelected.reduce((s, t) => s + t.capacity, 0))
            setIsTableSelectorOpen(true)
        } catch (error) {
            console.error('Error checking available tables:', error)
            alert('Lỗi khi kiểm tra bàn trống')
        } finally {
            setTableCheckLoading(false)
        }
    }

    const syncSelectedTables = (available, busy, currentSelected) => {
        const tableMap = new Map()
        available.forEach(t => tableMap.set(t._id, t))
        busy.forEach(t => tableMap.set(t._id, t))

        // giữ lại các bàn vẫn còn tồn tại
        return currentSelected
            .map(t => tableMap.get(t._id) || t)
            .filter(Boolean)
    }

    // ============================
    // HANDLE SELECT TABLE
    // ============================
    const handleSelectTable = (table) => {
        const isSelected = formData.selectedTables.some(t => t._id === table._id)
        const isBusy = busyTables.some(t => t._id === table._id)

        if (isBusy && !isSelected) {
            alert(`❌ Bàn ${table.name} đã được đặt`)
            return
        }

        let newSelected
        if (isSelected) {
            newSelected = formData.selectedTables.filter(t => t._id !== table._id)
        } else {
            newSelected = [...formData.selectedTables, table]
        }

        setFormData(prev => ({ ...prev, selectedTables: newSelected }))
        setTotalCapacity(newSelected.reduce((s, t) => s + t.capacity, 0))
    }

    // ============================
    // HANDLE DATETIME CHANGE
    // ============================
    const handleDateTimeChange = (field, value) => {
        const newFormData = { ...formData, [field]: value }
        setFormData(newFormData)

        if (newFormData.datetime_checkin && newFormData.datetime_out) {
            setTimeout(() => autoCheckAvailableTables(newFormData), 300)
        }
    }

    const autoCheckAvailableTables = async (data) => {
        try {
            const res = await apiCall('/api/reservations/overlap_check', {
                method: 'POST',
                body: JSON.stringify({
                    from: new Date(data.datetime_checkin),
                    to: new Date(data.datetime_out),
                    exclude_reservation_id: editingReservation?._id
                })
            })

            const available = res.data?.availableTables || []
            const busy = res.data?.overlapTables || []

            const syncedSelected = syncSelectedTables(available, busy, formData.selectedTables)

            setAvailableTables(available)
            setBusyTables(busy)
            setFormData(prev => ({ ...prev, selectedTables: syncedSelected }))
            setTotalCapacity(syncedSelected.reduce((s, t) => s + t.capacity, 0))
        } catch (err) {
            console.error('Auto check available tables error', err)
        }
    }

    // ============================
    // SUBMIT FORM
    // ============================
    const handleSubmitForm = async () => {
        if (!formData.customer_name || formData.selectedTables.length === 0) {
            alert('Thiếu thông tin hoặc chưa chọn bàn')
            return
        }

        if (totalCapacity < formData.guest_count) {
            alert('Sức chứa không đủ')
            return
        }

        const payload = {
            customer_name: formData.customer_name,
            customer_phone: formData.customer_phone,
            guest_count: formData.guest_count,
            datetime_checkin: formData.datetime_checkin,
            datetime_out: formData.datetime_out,
            status: formData.status,
            tableIds: formData.selectedTables.map(t => t._id),
        }

        console.log(formData.selectedTables)
        console.log(payload)

        const url = editingReservation ? '/api/reservations/edit' : '/api/reservations/create'
        if (editingReservation) payload.reservation_id = editingReservation._id

        const res = await apiCall(url, { method: 'POST', body: JSON.stringify(payload) })
        if (res.success) {
            alert('✅ Thành công')
            resetForm()
            await fetchReservations()
        } else {
            alert(`❌ ${res.message || 'Có lỗi xảy ra'}`)
        }
    }

    // ============================
    // DELETE RESERVATION
    // ============================
    const handleDeleteReservation = async (reservationId) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa đơn đặt bàn này?')) return
        try {
            const res = await apiCall('/api/reservations/delete', { method: 'POST', body: JSON.stringify({ id: reservationId }) })
            if (res.success || res.message === 'Xóa thành công') {
                alert('✅ Xóa đơn đặt bàn thành công')
                fetchReservations()
            } else {
                alert(`❌ ${res.message || 'Xóa thất bại'}`)
            }
        } catch (error) {
            console.error('Error deleting reservation:', error)
            alert('❌ Lỗi khi xóa: ' + error.message)
        }
    }

    // ============================
    // RESET FORM
    // ============================
    const resetForm = () => {
        setFormData({
            customer_name: '',
            customer_phone: '',
            guest_count: 2,
            datetime_checkin: '',
            datetime_out: '',
            selectedTables: [],
            status: 'confirmed',
        })
        setEditingReservation(null)
        setIsFormOpen(false)
        setIsTableSelectorOpen(false)
        setTotalCapacity(0)
        setAvailableTables([])
    }

    // ============================
    // HANDLE EDIT RESERVATION
    // ============================
    const handleEditReservation = (reservation) => {
        const format = (d) => {
            const date = new Date(d)
            const pad = n => String(n).padStart(2, '0')
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
        }

        setEditingReservation(reservation)

        const selectedTables = reservation.tables.map(t => ({
            _id: t._id,
            name: t.name,
            capacity: t.capacity,
        }))

        setFormData({
            customer_name: reservation.customer_name,
            customer_phone: reservation.customer_phone,
            guest_count: reservation.guest_count,
            datetime_checkin: format(reservation.datetime_checkin),
            datetime_out: format(reservation.datetime_out),
            selectedTables: selectedTables,
            status: reservation.status
        })


        setTotalCapacity(selectedTables.reduce((s, t) => s + t.capacity, 0))
        setIsFormOpen(true)
    }



    // Filter reservations
    const filteredReservations = reservations.filter(res => {
        const matchStatus = res.status === activeStatus
        const matchSearch = res.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.customer_phone?.includes(searchQuery)
        return matchStatus && matchSearch
    })

    const statuses = ['confirmed', 'checked-in', 'finished', 'cancelled']
    const statusLabels = {
        confirmed: 'Đã đặt',
        'checked-in': 'Đã đến',
        finished: 'Đã dùng bữa',
        cancelled: 'Hủy',
    }

    const statusColors = {
        confirmed: 'bg-blue-100 text-blue-900',
        'checked-in': 'bg-green-100 text-green-900',
        finished: 'bg-gray-100 text-gray-900',
        cancelled: 'bg-red-100 text-red-900',
    }

    const statusIcons = {
        confirmed: <CheckCircle2 className="h-4 w-4" />,
        'checked-in': <LogIn className="h-4 w-4" />,
        finished: <Flag className="h-4 w-4" />,
        cancelled: <AlertOctagon className="h-4 w-4" />,
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
                    <div className="flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-primary-500" />
                        <h1 className="text-3xl font-bold text-secondary-900">Quản Lý Đặt Bàn</h1>
                    </div>
                    <Button
                        variant="primary"
                        size="md"
                        className="flex items-center gap-2"
                        onClick={() => {
                            resetForm()
                            setIsFormOpen(true)
                        }}
                    >
                        <Plus className="h-5 w-5" />
                        Đặt Bàn Mới
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-3">
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => setActiveStatus(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeStatus === status
                                ? 'bg-primary-500 text-white'
                                : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                                }`}
                        >
                            {statusLabels[status]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white border-b border-secondary-200 p-4">
                <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-secondary-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên khách hoặc số điện thoại..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {filteredReservations.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-secondary-600 text-lg">Không có đơn đặt bàn nào</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredReservations.map(res => (
                            <div key={res._id} className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4 hover:shadow-md transition-shadow">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-secondary-900 text-lg">{res.customer_name}</h3>
                                        <p className="text-sm text-secondary-600">Đơn #{res._id?.substring(0, 8)}</p>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 w-fit ${statusColors[res.status]}`}>
                                        {statusIcons[res.status]}
                                        {statusLabels[res.status]}
                                    </span>
                                </div>

                                {/* Info Grid */}
                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex items-center gap-2 text-secondary-700">
                                        <Phone className="h-4 w-4 text-secondary-400" />
                                        <span>{res.customer_phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-secondary-700">
                                        <Users className="h-4 w-4 text-secondary-400" />
                                        <span>{res.guest_count} khách</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-secondary-700">
                                        <Calendar className="h-4 w-4 text-secondary-400" />
                                        <span className="text-xs">
                                            {new Date(res.datetime_checkin).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-secondary-700">
                                        <Clock className="h-4 w-4 text-secondary-400" />
                                        <span className="text-xs">
                                            {new Date(res.datetime_checkin).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -
                                            {new Date(res.datetime_out).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-2 text-secondary-700">
                                        <span className="text-xs font-medium">Bàn:</span>
                                        <span className="text-xs">
                                            {
                                                res.tables?.length
                                                    ? res.tables.map(t => t.name).join(', ')
                                                    : 'N/A'}
                                        </span>
                                    </div>

                                </div>


                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-secondary-100">
                                    <button
                                        onClick={() => handleEditReservation(res)}
                                        className="flex-1 text-sm flex items-center justify-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4" /> Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReservation(res._id)}
                                        className="flex-1 text-sm flex items-center justify-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" /> Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
                        onClick={() => resetForm()}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <ModalHeader
                                title={editingReservation ? 'Cập Nhật Đặt Bàn' : 'Đặt Bàn Mới'}
                                onClose={() => resetForm()}
                            />

                            <div className="flex flex-1 overflow-hidden">
                                {/* Left: Table Grid */}
                                <div className="flex-1 border-r border-secondary-200 p-6 overflow-y-auto">
                                    <h3 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
                                        <Building2 className="h-5 w-5" />
                                        Chọn Bàn {isTableSelectorOpen && `(${formData.selectedTables.length} bàn đã chọn)`}
                                    </h3>

                                    {isTableSelectorOpen ? (
                                        <TableGridSelector
                                            availableTables={availableTables}
                                            busyTables={busyTables}
                                            selectedTables={formData.selectedTables}
                                            onSelectTable={handleSelectTable}
                                        />
                                    ) : (
                                        <div className="text-center py-12 text-secondary-600">
                                            <p className="text-sm">Điền thông tin và nhấn "Kiểm Tra Bàn" để xem danh sách bàn trống</p>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Form */}
                                <div className="w-96 p-6 space-y-4 flex flex-col">
                                    {/* Customer Info */}
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary-900 mb-2">
                                            Tên Khách <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.customer_name}
                                            onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="VD: Nguyễn Văn A"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-secondary-900 mb-2">
                                            Số Điện Thoại
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.customer_phone}
                                            onChange={e => setFormData({ ...formData, customer_phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="VD: 0987654321"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-secondary-900 mb-2">
                                            Số Khách <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.guest_count}
                                            onChange={e => setFormData({ ...formData, guest_count: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    {/* DateTime */}
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary-900 mb-2">
                                            Check-In <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={formData.datetime_checkin}
                                            onChange={e => handleDateTimeChange('datetime_checkin', e.target.value)}
                                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-secondary-900 mb-2">
                                            Check-Out <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={formData.datetime_out}
                                            onChange={e => handleDateTimeChange('datetime_out', e.target.value)}
                                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    {/* Check Available Button */}
                                    <button
                                        onClick={handleCheckAvailableTables}
                                        disabled={tableCheckLoading || !formData.datetime_checkin || !formData.datetime_out}
                                        className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Search className="h-4 w-4" />
                                        {tableCheckLoading ? 'Đang kiểm tra...' : 'Kiểm Tra Bàn'}
                                    </button>

                                    {/* Selected Tables Display */}
                                    {formData.selectedTables.length > 0 && (
                                        <div className="p-3 bg-primary-50 rounded-lg">
                                            <p className="text-sm font-semibold text-primary-900 mb-2">
                                                Sức chứa: {totalCapacity} chỗ
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.selectedTables.map(table => (
                                                    <span
                                                        key={`${table._id || table.name}`}
                                                        className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                                    >
                                                        {table.name}
                                                        <button
                                                            onClick={() => handleSelectTable(table)}
                                                            className="hover:opacity-75 ml-1"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Status - Only when editing */}
                                    {editingReservation && (
                                        <div>
                                            <label className="block text-sm font-semibold text-secondary-900 mb-2">
                                                Trạng Thái
                                            </label>
                                            <select
                                                value={formData.status}
                                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            >
                                                {statuses.map(status => (
                                                    <option key={status} value={status}>
                                                        {statusLabels[status]}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Buttons */}
                                    <div className="flex gap-3 mt-auto pt-4 border-t border-secondary-200">
                                        <Button
                                            variant="outline"
                                            size="md"
                                            className="flex-1"
                                            onClick={() => resetForm()}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="md"
                                            className="flex-1"
                                            onClick={handleSubmitForm}
                                        >
                                            {editingReservation ? 'Cập Nhật' : 'Tạo Đơn'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

// Helper Component: Table Grid Selector
const TableGridSelector = ({ availableTables, busyTables, selectedTables, onSelectTable }) => {

    const allTables = React.useMemo(() => {
        const map = new Map()

        availableTables.forEach(t =>
            map.set(t._id, { ...t, __status: 'available' })
        )

        busyTables.forEach(t =>
            map.set(t._id, { ...t, __status: 'busy' })
        )

        return Array.from(map.values())
    }, [availableTables, busyTables])

    const groupedTables = {
        A: allTables.filter(t => t.name?.startsWith('A')),
        B: allTables.filter(t => t.name?.startsWith('B')),
        C: allTables.filter(t => t.name?.startsWith('C')),
    }

    const getTableStatus = (table) => {
        if (selectedTables.some(t => t._id === table._id)) return 'selected'
        return table.__status
    }

    const TableButton = ({ table }) => {
        const status = getTableStatus(table)
        const statusStyles = {
            selected: 'bg-primary-500 text-white border-2 border-primary-600',
            busy: 'bg-red-100 text-red-900 border-2 border-red-300 opacity-50 cursor-not-allowed',
            available: 'bg-green-100 text-green-900 border-2 border-green-300 hover:border-green-400 hover:shadow-md',
        }

        return (
            <button
                onClick={() => onSelectTable(table)}
                disabled={status === 'busy'}
                className={`w-20 h-20 rounded-lg font-bold text-center flex flex-col items-center justify-center transition-all ${statusStyles[status]}`}
            >
                <div className="text-lg font-bold">{table.name}</div>
                <div className="text-xs opacity-75">{table.capacity} chỗ</div>
            </button>
        )
    }

    return (
        <div className="space-y-6">
            {/* Floor A */}
            {groupedTables.A.length > 0 && (
                <div>
                    <h4 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> Tầng 1 (A)
                    </h4>
                    <div className="grid grid-cols-8 gap-2">
                        {groupedTables.A.map(table => (
                            <TableButton key={table._id} table={table} />
                        ))}
                    </div>
                </div>
            )}

            {/* Floor B */}
            {groupedTables.B.length > 0 && (
                <div>
                    <h4 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> Tầng 2 (B)
                    </h4>
                    <div className="grid grid-cols-8 gap-2">
                        {groupedTables.B.map(table => (
                            <TableButton key={table._id} table={table} />
                        ))}
                    </div>
                </div>
            )}

            {/* Floor C */}
            {groupedTables.C.length > 0 && (
                <div>
                    <h4 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> Tầng 3 (C)
                    </h4>
                    <div className="grid grid-cols-8 gap-2">
                        {groupedTables.C.map(table => (
                            <TableButton key={table._id} table={table} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReservationsPage
