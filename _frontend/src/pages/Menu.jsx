import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-7xl px-6">
        <h1 className="text-4xl font-extrabold mb-8">Our Menu</h1>
        <Card>
          <CardHeader>
            <CardTitle>Menu Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Explore our delicious dishes and special offerings.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
