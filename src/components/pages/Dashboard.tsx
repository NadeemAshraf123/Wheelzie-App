import React from 'react';
import MetricsSection from '../../components/dashboard/MetricsSection';
import EarningsChart from '../../components/dashboard/EarningsChart';
import BookingsChart from '../../components/dashboard/BookingsChart';
import RentStatusPie from '../dashboard/RentStatusPie';
import BookingsTable from '../dashboard/BookingsTable';
import Reminders from '../../components/dashboard/Reminders';

const Dashboard: React.FC = () => {
  return (
    <div className=" max-w-7xl p-4 space-y-4">
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2">
          <div className=" gap-6">
            <MetricsSection />
          </div>
        </div>

        <div className="xl:col-span-1">
          <RentStatusPie />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <EarningsChart />
        </div>
        <div>
          <BookingsChart />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2 space-y-6">
          <Reminders />
          <BookingsTable />
        </div>

        <div className="xl:col-span-1 space-y-6">
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
