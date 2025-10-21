import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setActivePage } from "../../features/uiSlice";
import type { AppDispatch, RootState } from "../../app/store";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Car,
  User,
  Wallet,
  Truck,
  MessageSquare,
  ChevronDown,
  LogOut,
} from "lucide-react";

const Sidebar = ( { isOpen, onClose  } ) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const activePage = useSelector((state: RootState) => state.ui.activePage);

  const handleNav = (page: string) => {
    dispatch(setActivePage(page));
    onClose();
  };

  const navItemClass = (page: string) =>
    `flex items-center px-6 py-2 rounded-md ${
      activePage === page
        ? "bg-red-50 text-red-600"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <aside 
         className={`fixed md:static z-50 bg-white shadow-sm h-screen w-60 flex flex-col justify-between transition-transform duration-300 
                      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
                 >
            <button 
                onClick={onClose}
                className="md:hidden absolute top-3 right-3 p-2"
              >
                <X size={22} className="text-red-600 font-extrabold" />
            </button>      
      <div>
        <div className="mt-6 md:mt-0">
        <div className="flex items-center px-6 md:py-6 gap-2">
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
            G
          </div>
          <span className="font-bold text-lg">Wheelzie</span>
        </div>

        <nav className="mt-12">
          <ul className="space-y-1">
            <li>
              <Link
                to="/dashboard"
                onClick={() => handleNav("Dashboard")}
                className={navItemClass("Dashboard")}
              >
                <LayoutDashboard size={18} className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/bookings"
                onClick={() => handleNav("bookings")}
                className={navItemClass("bookings")}
              >
                <Calendar size={18} className="mr-3" />
                Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/newbookings"
                onClick={() => handleNav("new-Bookings")}
                className={navItemClass("new-Bookings")}
              >
                <Calendar size={18} className="mr-3" />
                New Bookings
              </Link>
            </li>

            <li>
              <Link
                to="/cars"
                onClick={() => handleNav("cars")}
                className={navItemClass("cars")}
              >
                <Car size={18} className="mr-3" />
                Units
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                onClick={() => handleNav("calendar")}
                className={navItemClass("calendar")}
              >
                <Calendar size={18} className="mr-3" />
                Calendar
              </Link>
            </li>
            <li>
              <Link
                to="/clients"
                onClick={() => handleNav("clients")}
                className={navItemClass("clients")}
              >
                <Users size={18} className="mr-3" />
                Clients
              </Link>
            </li>
            <li>
              <Link
                to="/drivers"
                onClick={() => handleNav("drivers")}
                className={navItemClass("drivers")}
              >
                <User size={18} className="mr-3" />
                Drivers
              </Link>
            </li>

            <li>
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className={`flex items-center px-6 py-2 w-full rounded-md ${
                  activePage === "financials"
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Wallet size={18} className="mr-3" />
                Financials
                <ChevronDown
                  size={16}
                  className={`ml-auto transition-transform ${
                    openDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openDropdown && (
                <ul className="pl-14 text-sm text-gray-500 space-y-1">
                  <li>
                    <Link
                      to="/financials/invoices"
                      className="hover:text-gray-700"
                    >
                      Invoices
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/financials/reports"
                      className="hover:text-gray-700"
                    >
                      Reports
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/tracking"
                onClick={() => handleNav("tracking")}
                className={navItemClass("tracking")}
              >
                <Truck size={18} className="mr-3" />
                Tracking
              </Link>
            </li>
            <li>
              <Link
                to="/messages"
                onClick={() => handleNav("message")}
                className={navItemClass("message")}
              >
                <MessageSquare size={18} className="mr-3" />
                Messages
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500"></span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      </div>

      <div className="p-4">
        <div className="bg-red-600 text-white rounded-lg p-3 mb-4">
          <p className="text-sm">
            Optimize your operations and enhance customer satisfaction with{" "}
            <span className="font-bold">Wheelzie</span>
          </p>
          <button className="mt-2 bg-white text-red-600 text-sm px-3 py-1 rounded-md">
            Update Now
          </button>
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
