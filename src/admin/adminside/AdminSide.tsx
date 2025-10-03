import React from 'react'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'

const AdminSide = () => {
  return (
    <>

 <div className="flex min-h-screen">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Right section: Navbar + Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar only spans the content area */}
        <Navbar />

        {/* Main content below navbar */}
        <main className="p-6 bg-gray-50 flex-1">
          {/* Dashboard widgets go here */}
        </main>
      </div>
    </div>


    </>
  )
}

export default AdminSide