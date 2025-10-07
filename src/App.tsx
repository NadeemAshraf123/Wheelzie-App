import React from 'react';
import './utils/ChartConfig';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import Bookings from './client/pages/Bookings';
import ClientManagementPage from './client/pages/ClientManagementPage';
import AddClientPage from './client/pages/AddClientPage';
import { Calendar } from './client/pages/Clendar';
import Drivers from './client/pages/Drivers';
import UNitDetailed from './client/pages/CarDetail';
import CarDetail from './client/pages/CarDetail';


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
            <Route path="/clients" element={ <ClientManagementPage />  } />
            <Route path="/addclient" element={ <AddClientPage />  } />
            <Route path='/calendar' element={ <Calendar />  } /> 
            <Route path='/drivers' element={ <Drivers />  } /> 
            <Route path='/units' element={ <CarDetail /> } /> 



          

          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;