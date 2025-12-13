import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-7xl px-6">
        <h1 className="text-4xl font-extrabold mb-8">About Poodb</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Founded with a passion for authentic dining experiences, Poodb brings together traditional flavors and modern innovation.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                To deliver exceptional food quality and outstanding service that exceeds customer expectations every time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
