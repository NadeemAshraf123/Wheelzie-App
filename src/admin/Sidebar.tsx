import { useState } from "react";
import { 
  LayoutDashboard, Calendar, Users, Car, User, 
  Wallet, Truck, MessageSquare, ChevronDown, LogOut
} from "lucide-react";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <aside className="w-60 h-screen bg-white shadow-sm flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="flex items-center px-6 py-4 gap-2">
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">G</div>
          <span className="font-bold text-lg">Wheelzie</span>
        </div>

        {/* Menu */}
        <nav className="mt-4">
          <ul className="space-y-1">
            <li className="flex items-center px-6 py-2 bg-red-50 text-red-600 rounded-md cursor-pointer">
              <LayoutDashboard size={18} className="mr-3" />
              Dashboard
            </li>
            <li className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
              <Calendar size={18} className="mr-3" />
              Bookings
            </li>
            <li className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
              <Car size={18} className="mr-3" />
              Units
            </li>
            <li className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
              <Calendar size={18} className="mr-3" />
              Calendar
            </li>
            <li className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
              <Users size={18} className="mr-3" />
              Clients
            </li>
            <li className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
              <User size={18} className="mr-3" />
              Drivers
            </li>

            {/* Dropdown */}
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
                  <li className="cursor-pointer hover:text-gray-700">Invoices</li>
                  <li className="cursor-pointer hover:text-gray-700">Reports</li>
                </ul>
              )}
            </li>

            <li className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
              <Truck size={18} className="mr-3" />
              Tracking
            </li>
            <li className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
              <MessageSquare size={18} className="mr-3" />
              Messages
              <span className="ml-auto w-2 h-2 rounded-full bg-red-500"></span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4">
        {/* Promo Card */}
        <div className="bg-red-600 text-white rounded-lg p-3 mb-4">
          <p className="text-sm">Optimize your operations and enhance customer satisfaction with <span className="font-bold">Wheelzie</span></p>
          <button className="mt-2 bg-white text-red-600 text-sm px-3 py-1 rounded-md">Update Now</button>
        </div>

        {/* Logout */}
        <button className="flex items-center text-gray-500 hover:text-red-600 w-full">
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
