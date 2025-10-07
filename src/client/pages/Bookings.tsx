import React from "react";

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
  const statsData = {
    upcoming: 145,
    upcomingChange: "1.25%",
    canceled: 86,
    completed: 88,
    completedChange: "4.02%",
    combined: 298,
    combinedChange: "3.58%",
  };

  const chartData = [
    { month: "Jan", done: 425, canceled: 75 },
    { month: "Feb", done: 255, canceled: 45 },
    { month: "Mar", done: 0, canceled: 0 },
    { month: "Apr", done: 255, canceled: 45 },
    { month: "May", done: 340, canceled: 60 },
    { month: "Jun", done: 425, canceled: 75 },
    { month: "Jul", done: 255, canceled: 45 },
    { month: "Aug", done: 340, canceled: 60 },
    { month: "Sep", done: 425, canceled: 75 },
    { month: "Oct", done: 510, canceled: 90 },
    { month: "Nov", done: 340, canceled: 60 },
    { month: "Dec", done: 425, canceled: 75 },
  ];

  const bookingsData: CarBooking[] = [
    {
      bookingId: "BK-WZ1001",
      bookingDate: "Aug 1, 2028",
      customerName: "Alice Johnson",
      carModel: "Toyota Corolla",
      plan: "Sector",
      duration: "2 Days",
      startDate: "Aug 1, 2028",
      endDate: "Aug 2, 2028",
      payment: "$50",
      paymentStatus: "Fold",
      status: "Examins",
    },
    {
      bookingId: "BK-WZ1002",
      bookingDate: "Aug 1, 2028",
      customerName: "Bob Smith",
      carModel: "Honda Civic",
      plan: "Sector",
      duration: "7 Days",
      startDate: "Aug 1, 2028",
      endDate: "Aug 2, 2028",
      payment: "$350",
      paymentStatus: "Folding",
      status: "Crypting",
    },
    {
      bookingId: "BK-WZ1003",
      bookingDate: "Aug 2, 2028",
      customerName: "Charlie Davis",
      carModel: "Ford Focus",
      plan: "Interstock",
      duration: "31 Days",
      startDate: "Aug 2, 2028",
      endDate: "Sep 2, 2028",
      payment: "$000",
      paymentStatus: "Fold",
      status: "Crypting",
    },
    {
      bookingId: "BK-WZ1004",
      bookingDate: "Aug 2, 2028",
      customerName: "Diane White",
      carModel: "Chevrolet Malibu",
      plan: "Sector",
      duration: "1 Day",
      startDate: "Aug 2, 2028",
      endDate: "Aug 2, 2028",
      payment: "$50",
      paymentStatus: "Fold",
      status: "Examins",
    },
    {
      bookingId: "BK-WZ1005",
      bookingDate: "Aug 3, 2028",
      customerName: "Edward Green",
      carModel: "Nissan Altima",
      plan: "Sector",
      duration: "8 Days",
      startDate: "Aug 3, 2028",
      endDate: "Aug 10, 2028",
      payment: "$350",
      paymentStatus: "Folding",
      status: "Conceited",
    },
    {
      bookingId: "BK-WZ1006",
      bookingDate: "Aug 3, 2028",
      customerName: "Flora Brown",
      carModel: "BMW X5",
      plan: "SUV",
      duration: "32 Days",
      startDate: "Aug 3, 2028",
      endDate: "Sep 3, 2028",
      payment: "$500",
      paymentStatus: "Fold",
      status: "Crypting",
    },
    {
      bookingId: "BK-WZ1007",
      bookingDate: "Aug 4, 2028",
      customerName: "George Clark",
      carModel: "Audi Q7",
      plan: "SUV",
      duration: "2 Days",
      startDate: "Aug 4, 2028",
      endDate: "Aug 5, 2028",
      payment: "$70",
      paymentStatus: "Fold",
      status: "Examins",
    },
    {
      bookingId: "BK-WZ1008",
      bookingDate: "Aug 4, 2028",
      customerName: "Helen Martinez",
      carModel: "Mazda 3",
      plan: "Sector",
      duration: "7 Days",
      startDate: "Aug 4, 2028",
      endDate: "Aug 10, 2028",
      payment: "$450",
      paymentStatus: "Folding",
      status: "Conceited",
    },
    {
      bookingId: "BK-WZ1009",
      bookingDate: "Aug 5, 2028",
      customerName: "Ivan Rodriguez",
      carModel: "Hyundai Elantra",
      plan: "Sector",
      duration: "31 Days",
      startDate: "Aug 5, 2028",
      endDate: "Sep 5, 2028",
      payment: "$200",
      paymentStatus: "Fold",
      status: "Crypting",
    },
    {
      bookingId: "BK-WZ1010",
      bookingDate: "Aug 5, 2028",
      customerName: "Jane Wilson",
      carModel: "Mercedes C-Class",
      plan: "Sector",
      duration: "2 Days",
      startDate: "Aug 5, 2028",
      endDate: "Aug 8, 2028",
      payment: "$60",
      paymentStatus: "Fold",
      status: "Examins",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "examins":
        return "bg-yellow-100 text-yellow-800";
      case "crypting":
        return "bg-blue-100 text-blue-800";
      case "conceited":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const maxChartValue = Math.max(...chartData.map((item) => item.value));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-9xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Car Bookings Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-400 mb-2">
                  Upcoming Bookings
                </h3>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-gray-300">
                    {statsData.upcoming}
                  </span>
                  <span className="text-green-500 font-medium">
                    +{statsData.upcomingChange}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2">From last week</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-400 mb-2">
                  Canceled Bookings
                </h3>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-gray-300">
                    {statsData.canceled}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-400 mb-2">
                  Completed Bookings
                </h3>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-gray-300">
                    {statsData.completed}
                  </span>
                  <span className="text-green-500 font-medium">
                    +{statsData.completedChange}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2">From last week</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-400 mb-2">
                  Combined Bookings
                </h3>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-gray-300">
                    {statsData.combined}
                  </span>
                  <span className="text-green-500 font-medium">
                    +{statsData.combinedChange}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2">From last week</p>
              </div>
            </div>
          </div>

         <div className="lg:col-span-2">
            <div className=" p-6 rounded-lg shadow h-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Bookings Overview
              </h3>

              <div className="flex items-end justify-between h-48 mt-8">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 mx-1"
                  >
                    <div className="flex space-x-1 w-full justify-center">
                      <div
                        className="bg-black w-3 rounded-t relative group"
                        style={{
                          height: `${(item.done / maxChartValue) * 100}%`,
                        }}
                      >
                        <div className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-gray-800 text-white px-2 py-1 rounded">
                          Done: {item.done}
                        </div>
                      </div>

                      <div
                        className="bg-red-500 w-3 rounded-t relative group"
                        style={{
                          height: `${(item.canceled / maxChartValue) * 100}%`,
                        }}
                      >
                        <div className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-gray-800 text-white px-2 py-1 rounded">
                          Canceled: {item.canceled}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-4 mt-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-black rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Done</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Canceled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Car Bookings
              </h2>
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
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
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
                  <span className="text-sm text-gray-700">
                    Results per page
                  </span>
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
