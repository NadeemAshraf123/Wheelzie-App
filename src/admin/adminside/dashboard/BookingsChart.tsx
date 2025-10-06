import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const BookingsChart: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bookingsOverview'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/bookingsOverview');
      return res.data;
    }
  });

  if (isLoading) return <div>Loading bookings chart...</div>;
  if (error) return <div>Error loading bookings chart: {error.message}</div>;

  const chartData = {
    labels: data.map((d: any) => d.month),
    datasets: [
      {
        label: 'Monthly Bookings',
        data: data.map((d: any) => d.count),
        backgroundColor: '#10b981',
      },
    ],
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-2">Bookings Overview</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default BookingsChart;
