import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export default function BlogPage() {
  const posts = [
    { id: 1, title: 'The Art of Perfect Biryani', author: 'Chef Kumar', date: 'Dec 10, 2025' },
    { id: 2, title: 'Fresh Ingredients Matter', author: 'Chef Priya', date: 'Dec 8, 2025' },
    { id: 3, title: 'Restaurant Trends 2025', author: 'Admin', date: 'Dec 5, 2025' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-7xl px-6">
        <h1 className="text-4xl font-extrabold mb-8">Our Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">By {post.author}</p>
                <p className="text-xs text-gray-500">{post.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
