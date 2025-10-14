import React from "react";
import "./utils/ChartConfig";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "../src/client/pages/dashboard/Dashboard";
import ClientManagementPage from "./client/pages/clients/ClientManagementPage";
import { Calendar } from "./client/pages/calender/Clendar";
import Drivers from "./client/pages/drivers/Drivers";
import Cars from "./client/pages/carsunit/Cars";
import BookingsTable from "./client/pages/bookings/BookingsTable";
import NewBookings from "./client/pages/bookings/NewBookings";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="flex h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />

          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/bookings" element={<BookingsTable />} />
              <Route path="/newbookings" element={<NewBookings />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/clients" element={<ClientManagementPage />} />
              <Route path="/drivers" element={<Drivers />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
