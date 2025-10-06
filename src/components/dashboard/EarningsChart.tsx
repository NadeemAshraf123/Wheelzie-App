import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

interface EarningsData {
  month: string;
  amount: number;
}

const EarningsChart: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['earnings'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/earnings');
      return res.data;
    }
  });

  if (isLoading) return <div className="bg-white shadow rounded p-4">Loading earnings chart...</div>;
  if (error) return <div className="bg-white shadow rounded p-4">Error loading earnings chart: {error.message}</div>;
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="bg-white shadow rounded p-4">No earnings data available</div>;
  }

  const chartData = {
    labels: data.map((d: EarningsData) => d.month),
    datasets: [
      {
        label: 'Monthly Earnings ($)',
        data: data.map((d: EarningsData) => d.amount),
        borderColor: 'red',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 3,
        fill: true,
        tension: 0.4, 
        pointBackgroundColor: 'black',
        pointBorderColor: 'black',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Earnings Trend',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Amount ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Months'
        }
      }
    },
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-2">Earnings Summary</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default EarningsChart;