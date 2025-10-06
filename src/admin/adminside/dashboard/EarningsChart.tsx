import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const EarningsChart: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['earnings'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/earnings');
      return res.data;
    }
  });

  if (isLoading) return <div>Loading earnings chart...</div>;
  if (error) return <div>Error loading earnings chart: {error.message}</div>;

  const chartData = {
    labels: data.map((d: any) => d.month),
    datasets: [
      {
        label: 'Monthly Earnings',
        data: data.map((d: any) => d.amount),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-2">Earnings Summary</h3>
      <Line data={chartData} />
    </div>
  );
};

export default EarningsChart;
