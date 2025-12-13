import React, { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'

const dishes = [
  { id: 1, name: 'Egg Fried Noodles', price: '$50.00', rating: 4.5, votes: 120 },
  { id: 2, name: 'Chicken Spicy Biryani', price: '$50.00', rating: 4.8, votes: 150 },
  { id: 3, name: 'Indian Spicy Biryani', price: '$50.00', rating: 4.6, votes: 130 },
  { id: 4, name: 'Saiad Salad Biryani', price: '$50.00', rating: 4.4, votes: 100 },
  { id: 5, name: 'Fish Spicy Biryani', price: '$50.00', rating: 4.7, votes: 140 },
  { id: 6, name: 'Noodles Spicy Biryani', price: '$50.00', rating: 4.5, votes: 125 }
]

const recipes = [
  { id: 1, title: 'Spicy Pizza Recipe', category: 'Pizza' },
  { id: 2, title: 'Grilled Fish Dish', category: 'Fish' },
  { id: 3, title: 'Fresh Salad Mix', category: 'Salad' },
  { id: 4, title: 'Pasta Carbonara', category: 'Pasta' },
  { id: 5, title: 'Biryani Masala', category: 'Biryani' }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold">Poodb</div>
          <nav className="hidden gap-6 md:flex">
            <a href="#" className="text-sm text-gray-600 hover:text-primary">Home</a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary">Menu</a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary">About</a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary">Blog</a>
            <Button className="text-xs px-3 py-1">Order Now</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-white">
        <div className="container mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center">
          {/* Left: Title & Search */}
          <div className="flex-1">
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
              The Perfect Space to Enjoy best Food
            </h1>
            <p className="mb-6 text-gray-600">
              Discover authentic flavors and exceptional dining experience.
            </p>

            {/* Search & Filter Row */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <Input placeholder="Search Dishes..." className="w-full sm:flex-1" />
              <Button className="sm:w-auto">Search</Button>
            </div>

            {/* Filter Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Special Recipes</Badge>
              <Badge variant="outline">Other menu</Badge>
            </div>

            {/* Featured Card */}
            <Card className="mt-6 max-w-sm border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-sm">Global values</CardTitle>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-yellow-500">★★★★★</span>
                  <span className="text-xs text-gray-600">(122 reviews)</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-lg font-bold">$140.00</div>
                <p className="text-xs text-gray-600">Fresh & Healthy</p>
              </CardContent>
            </Card>
          </div>

          {/* Right: Hero Image Placeholder */}
          <div className="flex-1">
            <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 to-gray-100 p-8">
              <div className="aspect-square flex items-center justify-center rounded-xl bg-white">
                <span className="text-gray-400">[Hero Image]</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto flex max-w-7xl flex-col gap-8 px-6 md:flex-row">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <span className="text-2xl">🎁</span>
            </div>
            <div>
              <h3 className="font-semibold">Discount Voucher</h3>
              <p className="text-sm text-gray-600">Special deals & offers</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <span className="text-2xl">🥗</span>
            </div>
            <div>
              <h3 className="font-semibold">Fresh Healthy Food</h3>
              <p className="text-sm text-gray-600">Quality ingredients</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <span className="text-2xl">🚚</span>
            </div>
            <div>
              <h3 className="font-semibold">Fast Service to Table</h3>
              <p className="text-sm text-gray-600">Quick delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Dishes Section with Tabs */}
      <section className="bg-white py-12">
        <div className="container mx-auto max-w-7xl px-6">
          <h2 className="mb-8 text-3xl font-bold">Our Special Dishes</h2>

          {/* Tabs */}
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Dishes</TabsTrigger>
              <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
              <TabsTrigger value="lunch">Lunch</TabsTrigger>
              <TabsTrigger value="dinner">Dinner</TabsTrigger>
              <TabsTrigger value="dessert">Dessert</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {dishes.map((dish) => (
                  <Card key={dish.id} className="flex flex-col">
                    <div className="mb-4 h-40 rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">[Dish Image]</span>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{dish.name}</CardTitle>
                      <div className="mt-1 flex items-center gap-1 text-xs">
                        <span className="text-yellow-500">★ {dish.rating}</span>
                        <span className="text-gray-500">({dish.votes})</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-bold text-primary">{dish.price}</span>
                        <Button className="text-xs px-2 py-1">Add</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {['breakfast', 'lunch', 'dinner', 'dessert'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="text-center text-gray-600">
                  More {tab} items coming soon...
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Trending Recipes Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Trending Recipes</h2>
            <a href="#" className="text-primary hover:underline">View All →</a>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-3 h-32 rounded-md bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">[Recipe]</span>
                </div>
                <Badge variant="secondary" className="mb-2">{recipe.category}</Badge>
                <h3 className="text-sm font-semibold">{recipe.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chef Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto flex max-w-7xl flex-col gap-8 px-6 md:flex-row md:items-center">
          <div className="flex-1">
            <h2 className="mb-4 text-3xl font-bold">Meet Our Master Chef Team Leader</h2>
            <p className="mb-4 text-gray-600">
              Our chef brings 20+ years of culinary excellence and international cooking experience.
            </p>
            <ul className="space-y-2 text-sm">
              <li>✓ Award-winning chef</li>
              <li>✓ International trained</li>
              <li>✓ Certified in Cooking</li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-gray-100 p-8">
              <div className="aspect-square flex items-center justify-center rounded-xl bg-white">
                <span className="text-gray-400">[Chef Image]</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto max-w-7xl px-6">
          <h2 className="mb-8 text-3xl font-bold">Our Customer's Says</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i} className="flex flex-col">
                <CardContent className="flex items-start gap-4 pt-4">
                  <div className="h-12 w-12 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-500">👤</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-yellow-500 mb-1">★★★★★</div>
                    <p className="mb-3 text-sm text-gray-700">
                      "Amazing food quality and excellent service. The presentation is beautiful and every dish tastes incredible. Highly recommended!"
                    </p>
                    <div>
                      <p className="text-sm font-semibold">Sarah Anderson</p>
                      <p className="text-xs text-gray-600">Food Lover</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h4 className="mb-4 font-semibold">About Poodb</h4>
              <p className="text-sm text-gray-600">Quality dining experience</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Home</a></li>
                <li><a href="#" className="hover:text-primary">Menu</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>📞 +123 456 7890</li>
                <li>📧 hello@poodb.com</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Follow Us</h4>
              <div className="flex gap-3">
                <a href="#" className="text-primary hover:underline">Facebook</a>
                <a href="#" className="text-primary hover:underline">Instagram</a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
            © 2025 Poodb. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
