import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface DashboardData {
  metrics: {
    totalEarnings: number;
    totalBookings: number;
    availableCars: number;
    totalCars: number;
  };
  earnings: { month: string; amount: number }[];
  bookingsOverview: { month: string; count: number }[];
  rentStatus: {
    hired: number;
    pending: number;
    cancelled: number;
  };
  reminders: string[];
  bookings: {
    id: string;
    bookingDate: string;
    customerName: string;
    carModel: string;
    duration: number;
    startDate: string;
    endDate: string;
    status: string;
  }[];
}

export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const [
        metricsRes,
        earningsRes,
        bookingsOverviewRes,
        rentStatusRes,
        remindersRes,
        bookingsRes
      ] = await Promise.all([
        axios.get('http://localhost:3000/metrics'),
        axios.get('http://localhost:3000/earnings'),
        axios.get('http://localhost:3000/bookingsOverview'),
        axios.get('http://localhost:3000/rentStatus'),
        axios.get('http://localhost:3000/reminders'),
        axios.get('http://localhost:3000/bookings')
      ]);

      return {
        metrics: metricsRes.data,
        earnings: earningsRes.data,
        bookingsOverview: bookingsOverviewRes.data,
        rentStatus: rentStatusRes.data,
        reminders: remindersRes.data,
        bookings: bookingsRes.data
      };
    }
  });
};
