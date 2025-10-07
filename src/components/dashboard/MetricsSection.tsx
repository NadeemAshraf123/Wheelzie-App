import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface MetricsData {
  totalEarnings: number;
  totalBookings: number;
  availableCars: number;
  totalCars: number;
}

const MetricsSection: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/metrics');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 md:gap-1">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-7 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-600 text-sm">Error loading metrics: {error.message}</p>
      </div>
    );
  }

  if (!data || typeof data !== 'object') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-yellow-600 text-sm">No metrics data available</p>
      </div>
    );
  }

  const metrics = data as MetricsData;

  const metricsWithFallbacks = {
    totalEarnings: metrics.totalEarnings ?? 0,
    totalBookings: metrics.totalBookings ?? 0,
    availableCars: metrics.availableCars ?? 0,
    totalCars: metrics.totalCars ?? 0,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getPercentageChange = (title: string) => {
    const changes = {
      'Total Revenue': { value: '+2.86%', trend: 'up' },
      'New Bookings': { value: '+1.73%', trend: 'up' },
      'Rented Cars': { value: '-2.88%', trend: 'down' },
      'Available Cars': { value: '+3.45%', trend: 'up' }
    };
    return changes[title as keyof typeof changes] || { value: '+0%', trend: 'up' };
  };

  const metricCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metricsWithFallbacks.totalEarnings),
      percentage: getPercentageChange('Total Revenue'),
      color: 'text-gray-900'
    },
    {
      title: 'New Bookings',
      value: formatNumber(metricsWithFallbacks.totalBookings),
      percentage: getPercentageChange('New Bookings'),
      color: 'text-gray-900'
    },
    {
      title: 'Rented Cars',
      value: `${formatNumber(metricsWithFallbacks.totalCars)} Unit`,
      percentage: getPercentageChange('Rented Cars'),
      color: 'text-gray-900'
    },
    {
      title: 'Available Cars',
      value: `${formatNumber(metricsWithFallbacks.availableCars)} Unit`,
      percentage: getPercentageChange('Available Cars'),
      color: 'text-gray-900'
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {metricCards.map((metric, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
              <p className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </p>
            </div>
            
            <div className="text-right flex flex-col">
              <span className={`text-sm font-semibold ${
                metric.percentage.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.percentage.trend === 'up' ? '↗' : '↘'}
                {metric.percentage.value}
              </span>
              <span className="text-xs text-gray-500 mt-1">from last week</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsSection;