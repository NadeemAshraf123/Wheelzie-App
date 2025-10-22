import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import '../../styles/Custom.css';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC = ({ onToggleSidebar }) => {
  const activePage = useSelector((state: RootState) => state.ui.activePage);
  console.log("activePage", activePage);
  const formattedPage =
    activePage.charAt(0).toUpperCase() + activePage.slice(1);

  return (
    <header className=" bg-gray-200  md:bg-gray-200  p-2 md:p-0 shadow-lg border-b border-gray-200 ">
      <div className="flex items-center justify-between md:px-6 md:py-4">
        <button onClick={onToggleSidebar} className="hamburger-button custom-md-hidden px-2 text-xl">
          <FontAwesomeIcon icon={faBars} className="text-xl text-gray-700" />
        </button>

        <div className="flex-1">
          <h2 className="text-[10px] md:text-xl font-semibold text-gray-800">
            {formattedPage}
          </h2>
          {/* <p className="text-[8px] md:text-sm text-gray-500 md:mt-1">Welcome back</p> */}
        </div>

        <div className="flex items-center md:space-x-4">
          <button className="relative mr-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <FontAwesomeIcon
              icon={faBell}
              className="text-md md:text-[26px] text-yellow-500"
            />
            <span className="absolute -top-1 md:-top-2 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 md:w-4 md:h-4 flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex mr-1 items-center md:space-x-3 border-l border-gray-200 md:pl-4">
            <div className="text-right">
              <p className="text-[10px] font-medium text-gray-900">
                Admin User
              </p>
              <p className="text-[8px] text-gray-500">Super Admin</p>
            </div>
            <div className="w-5 h-5 md:w-12 md:h-12 ml-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
