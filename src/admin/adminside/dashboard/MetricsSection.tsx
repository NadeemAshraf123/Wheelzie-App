import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const MetricsSection: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/metrics');
      return res.data;
    }
  });

  if (isLoading) return <div>Loading metrics...</div>;
  if (error) return <div>Error loading metrics: {error.message}</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white shadow rounded p-4 text-center">
        <h4 className="text-sm font-semibold text-gray-500">Total Earnings</h4>
        <p className="text-xl font-bold text-blue-600">${data.totalEarnings}</p>
      </div>
      <div className="bg-white shadow rounded p-4 text-center">
        <h4 className="text-sm font-semibold text-gray-500">Total Bookings</h4>
        <p className="text-xl font-bold text-blue-600">{data.totalBookings}</p>
      </div>
      <div className="bg-white shadow rounded p-4 text-center">
        <h4 className="text-sm font-semibold text-gray-500">Available Cars</h4>
        <p className="text-xl font-bold text-blue-600">{data.availableCars}</p>
      </div>
      <div className="bg-white shadow rounded p-4 text-center">
        <h4 className="text-sm font-semibold text-gray-500">Total Cars</h4>
        <p className="text-xl font-bold text-blue-600">{data.totalCars}</p>
      </div>
    </div>
  );
};

export default MetricsSection;
