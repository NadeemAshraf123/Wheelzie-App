import react  from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import AdminSide from './admin/adminside/AdminSide'
import Sidebar from './admin/Sidebar'
import Navbar from './admin/Navbar'
import Dashboard from './admin/adminside/dashboard/Dashboard'

function App() {

  return (
    <>
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 bg-gray-50 flex-1">
          <Routes>
            <Route path='/dashboard' element={ <Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
    
        
    </>
  )
}

export default App
