import React from 'react';

interface CarBooking {
  bookingId: string;
  bookingDate: string;
  customerName: string;
  carModel: string;
  plan: string;
  duration: string;
  startDate: string;
  endDate: string;
  payment: string;
  paymentStatus: string;
  status: string;
}

const Bookings: React.FC = () => {
  // Static data for stats cards
  const statsData = {
    upcoming: 145,
    upcomingChange: '1.25%',
    canceled: 86,
    completed: 88,
    completedChange: '4.02%',
    combined: 298,
    combinedChange: '3.58%'
  };

  // Static data for chart
  const chartData = [
    { month: 'Jan', value: 500 },
    { month: 'Feb', value: 300 },
    { month: 'Mar', value: 0 },
    { month: 'Apr', value: 300 },
    { month: 'May', value: 400 },
    { month: 'Jun', value: 500 },
    { month: 'Jul', value: 300 },
    { month: 'Aug', value: 400 },
    { month: 'Sep', value: 500 },
    { month: 'Oct', value: 600 },
    { month: 'Nov', value: 400 },
    { month: 'Dec', value: 500 },
  ];

  // Static data for bookings table
  const bookingsData: CarBooking[] = [
    {
      bookingId: 'BK-WZ1001',
      bookingDate: 'Aug 1, 2028',
      customerName: 'Alice Johnson',
      carModel: 'Toyota Corolla',
      plan: 'Sector',
      duration: '2 Days',
      startDate: 'Aug 1, 2028',
      endDate: 'Aug 2, 2028',
      payment: '$50',
      paymentStatus: 'Fold',
      status: 'Examins'
    },
    {
      bookingId: 'BK-WZ1002',
      bookingDate: 'Aug 1, 2028',
      customerName: 'Bob Smith',
      carModel: 'Honda Civic',
      plan: 'Sector',
      duration: '7 Days',
      startDate: 'Aug 1, 2028',
      endDate: 'Aug 2, 2028',
      payment: '$350',
      paymentStatus: 'Folding',
      status: 'Crypting'
    },
    {
      bookingId: 'BK-WZ1003',
      bookingDate: 'Aug 2, 2028',
      customerName: 'Charlie Davis',
      carModel: 'Ford Focus',
      plan: 'Interstock',
      duration: '31 Days',
      startDate: 'Aug 2, 2028',
      endDate: 'Sep 2, 2028',
      payment: '$000',
      paymentStatus: 'Fold',
      status: 'Crypting'
    },
    {
      bookingId: 'BK-WZ1004',
      bookingDate: 'Aug 2, 2028',
      customerName: 'Diane White',
      carModel: 'Chevrolet Malibu',
      plan: 'Sector',
      duration: '1 Day',
      startDate: 'Aug 2, 2028',
      endDate: 'Aug 2, 2028',
      payment: '$50',
      paymentStatus: 'Fold',
      status: 'Examins'
    },
    {
      bookingId: 'BK-WZ1005',
      bookingDate: 'Aug 3, 2028',
      customerName: 'Edward Green',
      carModel: 'Nissan Altima',
      plan: 'Sector',
      duration: '8 Days',
      startDate: 'Aug 3, 2028',
      endDate: 'Aug 10, 2028',
      payment: '$350',
      paymentStatus: 'Folding',
      status: 'Conceited'
    },
    {
      bookingId: 'BK-WZ1006',
      bookingDate: 'Aug 3, 2028',
      customerName: 'Flora Brown',
      carModel: 'BMW X5',
      plan: 'SUV',
      duration: '32 Days',
      startDate: 'Aug 3, 2028',
      endDate: 'Sep 3, 2028',
      payment: '$500',
      paymentStatus: 'Fold',
      status: 'Crypting'
    },
    {
      bookingId: 'BK-WZ1007',
      bookingDate: 'Aug 4, 2028',
      customerName: 'George Clark',
      carModel: 'Audi Q7',
      plan: 'SUV',
      duration: '2 Days',
      startDate: 'Aug 4, 2028',
      endDate: 'Aug 5, 2028',
      payment: '$70',
      paymentStatus: 'Fold',
      status: 'Examins'
    },
    {
      bookingId: 'BK-WZ1008',
      bookingDate: 'Aug 4, 2028',
      customerName: 'Helen Martinez',
      carModel: 'Mazda 3',
      plan: 'Sector',
      duration: '7 Days',
      startDate: 'Aug 4, 2028',
      endDate: 'Aug 10, 2028',
      payment: '$450',
      paymentStatus: 'Folding',
      status: 'Conceited'
    },
    {
      bookingId: 'BK-WZ1009',
      bookingDate: 'Aug 5, 2028',
      customerName: 'Ivan Rodriguez',
      carModel: 'Hyundai Elantra',
      plan: 'Sector',
      duration: '31 Days',
      startDate: 'Aug 5, 2028',
      endDate: 'Sep 5, 2028',
      payment: '$200',
      paymentStatus: 'Fold',
      status: 'Crypting'
    },
    {
      bookingId: 'BK-WZ1010',
      bookingDate: 'Aug 5, 2028',
      customerName: 'Jane Wilson',
      carModel: 'Mercedes C-Class',
      plan: 'Sector',
      duration: '2 Days',
      startDate: 'Aug 5, 2028',
      endDate: 'Aug 8, 2028',
      payment: '$60',
      paymentStatus: 'Fold',
      status: 'Examins'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'examins':
        return 'bg-yellow-100 text-yellow-800';
      case 'crypting':
        return 'bg-blue-100 text-blue-800';
      case 'conceited':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const maxChartValue = Math.max(...chartData.map(item => item.value));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Car Bookings Dashboard</h1>
        
        {/* Stats and Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Side - Stats Cards (2 per row) */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upcoming Bookings */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Bookings</h3>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-gray-900">{statsData.upcoming}</span>
                  <span className="text-green-500 font-medium">+{statsData.upcomingChange}</span>
                </div>
                <p className="text-gray-500 text-sm mt-2">From last week</p>
              </div>

              {/* Canceled Bookings */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Canceled Bookings</h3>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-gray-900">{statsData.canceled}</span>
                </div>
              </div>

              {/* Completed Bookings */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed Bookings</h3>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-gray-900">{statsData.completed}</span>
                  <span className="text-green-500 font-medium">+{statsData.completedChange}</span>
                </div>
                <p className="text-gray-500 text-sm mt-2">From last week</p>
              </div>

              {/* Combined Bookings */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Combined Bookings</h3>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-gray-900">{statsData.combined}</span>
                  <span className="text-green-500 font-medium">+{statsData.combinedChange}</span>
                </div>
                <p className="text-gray-500 text-sm mt-2">From last week</p>
              </div>
            </div>
          </div>
          
          {/* Right Side - Booking Chart */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow h-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Bookings Overview</h3>
              
              <div className="flex items-end justify-between h-48 mt-8">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 mx-1">
                    <div
                      className="bg-blue-500 w-full rounded-t transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${(item.value / maxChartValue) * 100}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center space-x-4 mt-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Done</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table - Full Width */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Car Bookings</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookingsData.map((booking) => (
                    <tr key={booking.bookingId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {booking.bookingId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.bookingDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.carModel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.plan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.startDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {booking.payment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.paymentStatus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Showing {bookingsData.length} results
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Results per page</span>
                  <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;