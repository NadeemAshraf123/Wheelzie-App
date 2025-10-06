import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BookingOverview {
  month: string;
  count: number;
}

const BookingsChart: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bookingsOverview'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/bookingsOverview');
      return res.data;
    }
  });

  if (isLoading) return <div className="bg-white shadow rounded p-4">Loading bookings chart...</div>;
  if (error) return <div className="bg-white shadow rounded p-4">Error loading bookings chart: {error.message}</div>;
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="bg-white shadow rounded p-4">No bookings data available</div>;
  }

  const chartData = {
    labels: data.map((d: BookingOverview) => d.month),
    datasets: [
      {
        label: 'Monthly Bookings',
        data: data.map((d: BookingOverview) => d.count),
        backgroundColor: data.map((_, i) => (i % 2 === 0 ? 'black' : 'red')),
        borderRadius: 6,
        barThickness: 24,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          title: (tooltipItems: any) => `Month: ${tooltipItems[0].label}`,
          label: (tooltipItem: any) => `Bookings: ${tooltipItem.formattedValue}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1200,
        ticks: {
          stepSize: 100,
          color: 'black',
        },
        grid: {
          drawBorder: false,
          color: (context: any) => {
            const value = context.tick.value;
            return value === 600 ? 'red' : 'black';
          },
        },
      },
      x: {
        ticks: {
          color: 'black',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Bookings Overview</h3>
        <select className="border rounded px-2 py-1 text-sm">
          <option>This Year</option>
        </select>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BookingsChart;
