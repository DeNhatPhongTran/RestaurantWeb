import { Plus } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import SearchBar from '../components/common/SearchBar'
import { Button } from '../components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import CreateUserModal from '../components/staff/CreateUserModal'
import EditUserModal from '../components/staff/EditUserModal'
import DeleteUserConfirmModal from '../components/staff/DeleteUserConfirmModal'
import UserCard from '../components/staff/UserCard'
import { useApi } from '../context/ApiContext'
import { getUserInfo } from '../data/LocalStorage.jsx'

const StaffManagement = () => {
  const { apiCall, token } = useApi()

  const userInfo = useMemo(() => getUserInfo(), [])
  const roleName = userInfo?.role?.role_name

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const usersRes = await apiCall('/api/auth/users/list', { method: 'GET' })
        const rolesRes = await apiCall('/api/roles/list', { method: 'GET' })

        setUsers(
          usersRes?.success && Array.isArray(usersRes.data?.data)
            ? usersRes.data.data
            : []
        )

        setRoles(
          rolesRes?.success && Array.isArray(rolesRes.data?.data)
            ? rolesRes.data.data
            : []
        )
      } catch (error) {
        console.error('Error fetching data:', error)
        setUsers([])
        setRoles([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, apiCall])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = selectedRole === 'all' || user.role?._id === selectedRole
    return matchesSearch && matchesRole
  })

  const usersByRole = roles.map((role) => ({
    ...role,
    count: users.filter((u) => u.role?._id === role._id).length,
  }))

  const refreshUsers = async () => {
    try {
      const res = await apiCall('/api/auth/users/list', { method: 'GET' })
      if (res?.success && Array.isArray(res.data?.data)) {
        setUsers(res.data.data)
      }
    } catch (error) {
      console.error('Error refreshing users:', error)
    }
  }

  const handleCreateUser = async (userData) => {
    if (roleName !== 'manager') return

    try {
      const res = await apiCall('/api/auth/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      })

      if (res?.success) {
        setIsCreateModalOpen(false)
        await refreshUsers()
      }
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  const handleEditUser = (user) => {
    if (roleName !== 'manager') return
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (updatedData) => {
    if (!selectedUser || roleName !== 'manager') return

    try {
      const res = await apiCall(`/api/auth/users/${selectedUser._id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      })

      if (res?.success) {
        setIsEditModalOpen(false)
        setSelectedUser(null)
        await refreshUsers()
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleDeleteUser = (user) => {
    if (roleName !== 'manager') return
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser || roleName !== 'manager') return

    try {
      const res = await apiCall(`/api/auth/users/${selectedUser._id}`, {
        method: 'DELETE',
      })

      if (res?.success) {
        setIsDeleteModalOpen(false)
        setSelectedUser(null)
        await refreshUsers()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
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
    <div className="min-h-screen bg-secondary-50 p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-secondary-900">
          Quản Lý Nhân Viên
        </h1>

        {roleName === 'manager' && (
          <Button
            variant="primary"
            size="md"
            className="flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Tạo Nhân Viên Mới
          </Button>
        )}
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm kiếm theo tên hoặc tên tài khoản..."
        />
      </div>

      <div className="mb-8 bg-white rounded-lg p-4 shadow-sm border border-secondary-200">
        <Tabs value={selectedRole} onValueChange={setSelectedRole}>
          <TabsList className="flex gap-2 border-b border-secondary-200 pb-4 bg-transparent">
            <TabsTrigger value="all">
              Tất Cả ({users.length})
            </TabsTrigger>

            {usersByRole.map((role) => (
              <TabsTrigger key={role._id} value={role._id}>
                {role.role_name} ({role.count})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onEdit={() => handleEditUser(user)}
              onDelete={() => handleDeleteUser(user)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-secondary-600 text-lg">
              Không tìm thấy nhân viên
            </p>
          </div>
        )}
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        roles={roles}
        onCreateUser={handleCreateUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        roles={roles}
        onSave={handleSaveEdit}
      />

      <DeleteUserConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  )
}

export default StaffManagement
