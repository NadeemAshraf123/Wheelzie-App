import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BookingsTable: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/bookings');
      return res.data;
    }
  });

  if (isLoading) return <div>Loading bookings table...</div>;
  if (error) return <div>Error loading bookings table: {error.message}</div>;

  return (
    <div className="bg-white shadow rounded p-4 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2">Car Bookings</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Booking ID</th>
            <th className="p-2">Date</th>
            <th className="p-2">Customer</th>
            <th className="p-2">Car Model</th>
            <th className="p-2">Duration</th>
            <th className="p-2">Start</th>
            <th className="p-2">End</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((booking: any) => (
            <tr key={booking.id} className="border-t">
              <td className="p-2">{booking.id}</td>
              <td className="p-2">{booking.bookingDate}</td>
              <td className="p-2">{booking.customerName}</td>
              <td className="p-2">{booking.carModel}</td>
              <td className="p-2">{booking.duration} Days</td>
              <td className="p-2">{booking.startDate}</td>
              <td className="p-2">{booking.endDate}</td>
              <td className="p-2">{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
