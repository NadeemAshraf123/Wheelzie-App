import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const RentStatusPie: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['rentStatus'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/rentStatus');
      return res.data;
    }
  });

  if (isLoading) return <div>Loading rent status...</div>;
  if (error) return <div>Error loading rent status: {error.message}</div>;

  const chartData = {
    labels: ['Hired', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [data.hired, data.pending, data.cancelled],
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
      },
    ],
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-2">Rent Status (This Week)</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default RentStatusPie;
