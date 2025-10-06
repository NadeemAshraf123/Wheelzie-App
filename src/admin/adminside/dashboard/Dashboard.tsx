import React from 'react';
import MetricsSection from './MetricsSection';
import EarningsChart from './EarningsChart';
import BookingsChart from './BookingsChart';
import RentStatusPie from './RentStatusPie';
import Reminders from './Reminders';
import BookingsTable from './BookingsTable';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <MetricsSection />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EarningsChart />
        <BookingsChart />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RentStatusPie />
        <Reminders />
      </div>
      <BookingsTable />
    </div>
  );
};

export default Dashboard;
