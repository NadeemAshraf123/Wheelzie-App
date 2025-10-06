import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Define TypeScript interface
interface Booking {
  id: string;
  bookingDate: string;
  customerName: string;
  carModel: string;
  duration: number;
  startDate: string;
  endDate: string;
  status: 'Ongoing' | 'Completed' | 'Cancelled' | 'Upcoming';
}

const BookingsTable: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/bookings');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Car Bookings</h3>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-12 bg-gray-100 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Car Bookings</h3>
        <div className="bg-red-50 border border-red-200 rounded p-4 text-center">
          <p className="text-red-600">Error loading bookings: {error.message}</p>
        </div>
      </div>
    );
  }

  // Check if data exists and is an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Car Bookings</h3>
        <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center">
          <div className="text-gray-400 text-4xl mb-2">📋</div>
          <p className="text-gray-500">No bookings found</p>
          <p className="text-sm text-gray-400 mt-1">All bookings are processed</p>
        </div>
      </div>
    );
  }

  const bookings = data as Booking[];

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to get status styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Car Bookings</h3>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {bookings.length} bookings
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Car Model
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Duration
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Start Date
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                End Date
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr 
                key={booking.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 font-mono text-xs text-blue-600 font-medium">
                  {booking.id}
                </td>
                <td className="p-3 text-gray-600">
                  {formatDate(booking.bookingDate)}
                </td>
                <td className="p-3 font-medium text-gray-800">
                  {booking.customerName}
                </td>
                <td className="p-3 text-gray-600">
                  {booking.carModel}
                </td>
                <td className="p-3 text-center">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {booking.duration} days
                  </span>
                </td>
                <td className="p-3 text-gray-600">
                  {formatDate(booking.startDate)}
                </td>
                <td className="p-3 text-gray-600">
                  {formatDate(booking.endDate)}
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional: Table summary */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <span>
          Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
        </span>
        <div className="flex space-x-4">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
            Ongoing: {bookings.filter(b => b.status === 'Ongoing').length}
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            Completed: {bookings.filter(b => b.status === 'Completed').length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingsTable;