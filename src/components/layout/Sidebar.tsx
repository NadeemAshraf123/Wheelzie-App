import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Calendar, Users, Car, User,
  Wallet, Truck, MessageSquare, ChevronDown, LogOut
} from "lucide-react";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <aside className="w-60 h-screen bg-white shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center px-6 py-4 gap-2">
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">G</div>
          <span className="font-bold text-lg">Wheelzie</span>
        </div>

        <nav className="mt-4">
          <ul className="space-y-1">
            <li>
              <Link to="/dashboard" className="flex items-center px-6 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100">
                <LayoutDashboard size={18} className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/bookings" className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100">
                <Calendar size={18} className="mr-3" />
                Bookings
              </Link>
            </li>
            <li>
              <Link to="/units" className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100">
                <Car size={18} className="mr-3" />
                Units
              </Link>
            </li>
            <li>
              <Link to="/calendar" className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100">
                <Calendar size={18} className="mr-3" />
                Calendar
              </Link>
            </li>
            <li>
              <Link to="/clients" className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100">
                <Users size={18} className="mr-3" />
                Clients
              </Link>
            </li>
            <li>
              <Link to="/drivers" className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100">
                <User size={18} className="mr-3" />
                Drivers
              </Link>
            </li>

          
            <li>
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex items-center px-6 py-2 w-full text-gray-600 hover:bg-gray-100"
              >
                <Wallet size={18} className="mr-3" />
                Financials
                <ChevronDown
                  size={16}
                  className={`ml-auto transition-transform ${openDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {openDropdown && (
                <ul className="pl-14 text-sm text-gray-500 space-y-1">
                  <li>
                    <Link to="/financials/invoices" className="hover:text-gray-700">Invoices</Link>
                  </li>
                  <li>
                    <Link to="/financials/reports" className="hover:text-gray-700">Reports</Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/tracking" className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100">
                <Truck size={18} className="mr-3" />
                Tracking
              </Link>
            </li>
            <li>
              <Link to="/messages" className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100">
                <MessageSquare size={18} className="mr-3" />
                Messages
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500"></span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="p-4">
        <div className="bg-red-600 text-white rounded-lg p-3 mb-4">
          <p className="text-sm">
            Optimize your operations and enhance customer satisfaction with <span className="font-bold">Wheelzie</span>
          </p>
          <button className="mt-2 bg-white text-red-600 text-sm px-3 py-1 rounded-md">Update Now</button>
        </div>

        <button className="flex items-center text-gray-500 hover:text-red-600 w-full">
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
