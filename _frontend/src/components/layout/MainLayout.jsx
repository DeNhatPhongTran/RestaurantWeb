import React from 'react'

const MainLayout = ({ children }) => {
  return (
    <main className="flex-1 overflow-auto bg-secondary-50">
      <div className="max-w-full">
        {children}
      </div>
    </main>
  )
}

export default MainLayout
