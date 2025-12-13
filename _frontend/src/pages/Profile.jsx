import React, { useState } from 'react'
import { useApi } from '../context/ApiContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export default function ProfilePage() {
  const { user, loading, updateUser } = useApi()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const result = await updateUser(formData.name, formData.phone)

    if (result.success) {
      setMessage('Profile updated successfully!')
    } else {
      setError(result.error || 'Failed to update profile')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-2xl px-6">
        <h1 className="text-4xl font-extrabold mb-8">My Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            {message && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={user?.email || ''}
                  placeholder="your@email.com"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <Button className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">
                <strong>User ID:</strong> {user?.id}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <strong>Role:</strong> {user?.role}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
