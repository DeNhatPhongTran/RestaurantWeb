import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useApi } from '../context/ApiContext'

export default function MenuPage() {
  const { apiCall } = useApi()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState([])

  // Fetch menu items on mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true)
        const response = await apiCall("/menu")
        if (response.success) {
          setMenuItems(response.data)
          // Extract unique categories from menu items
          const uniqueCategories = {}
          response.data.forEach(item => {
            if (item.category) {
              uniqueCategories[item.category._id] = item.category.name
            }
          })
          setCategories(Object.entries(uniqueCategories).map(([id, name]) => ({ _id: id, name })))
        }
        setError(null)
      } catch (err) {
        console.error("Error fetching menu items:", err)
        setError("Failed to load menu items. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [apiCall])

  // Filter items by category
  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category._id === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto max-w-7xl px-6">
          <h1 className="text-4xl font-extrabold mb-8">Our Menu</h1>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600 text-lg">Loading menu...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-7xl px-6">
        <h1 className="text-4xl font-extrabold mb-8">Our Menu</h1>

        {error && (
          <Card className="bg-red-50 border border-red-200 mb-6">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex gap-3 flex-wrap">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              All Items
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat._id
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {item.image && (
                  <div className="w-full h-48 bg-gray-200 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === "available" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {item.status === "available" ? "Available" : "Sold Out"}
                    </span>
                  </div>
                  {item.category && (
                    <p className="text-sm text-gray-500 mt-1">{item.category.name}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-500">
                      ${item.price.toFixed(2)}
                    </span>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {selectedCategory === "all" 
                  ? "No menu items available at the moment." 
                  : "No items in this category."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
