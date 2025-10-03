import { FC } from 'react';
import { FiSearch, FiGlobe, FiBell } from 'react-icons/fi';

const Navbar: FC = () => {
  
return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <div className="text-xl font-bold text-gray-800">Dashboard</div>
      <div className="flex items-center gap-6">
        <FiSearch className="w-5 h-5 text-gray-600 cursor-pointer" />
        <FiGlobe className="w-5 h-5 text-gray-600 cursor-pointer" />
        <div className="relative">
          <FiBell className="w-5 h-5 text-gray-600 cursor-pointer" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="https://via.placeholder.com/32"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="text-sm text-gray-700 leading-tight">
            <div className="font-medium">Abram Schleifer</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
