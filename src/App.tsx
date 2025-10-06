import React from 'react';
import './utils/ChartConfig';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import Bookings from './client/pages/Bookings';


function App() {
  return (
    <div className="flex h-screen bg-gray-50">

      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">

        <Header />
        

        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={ <Bookings /> } />
            {/* <Route path="/reports" element={< } /> */}
            {/* <Route path="/settings" element={<Settings />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;