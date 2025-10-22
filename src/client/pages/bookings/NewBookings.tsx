import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { createSelector } from "@reduxjs/toolkit";

const selectBookings = (state: RootState) => state.bookings.data;

export const selectConfirmedBookings = createSelector(
  [selectBookings],
  (bookings) => bookings
);

const NewBookings: React.FC = () => {
  const bookings = useSelector(selectConfirmedBookings);
  const status = useSelector((state: RootState) => state.bookings.status);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading bookings...</span>
      </div>
    );
  }

  if (status === "failed") {
    const error = useSelector((state: RootState) => state.bookings.error);
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Error: </strong>
        {error || "Failed to load bookings"}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        No bookings found
      </div>
    );
  }

  // return (
  //   <div className="p-6 bg-white rounded-lg shadow-md">
  //     <h2 className="text-xl font-bold text-gray-700 mb-4 p-1">New Bookings</h2>
  //     <div className="overflow-x-auto">
  //       <table className="min-w-full bg-white border border-gray-200 rounded-lg">
  //         <thead className="bg-gray-50">
  //           <tr>
  //             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
  //             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Booking Date</th>
  //             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
  //             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
  //             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
  //             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Plan Days</th>
  //             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
  //             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
  //             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
  //             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
  //           </tr>
  //         </thead>
  //         <tbody className="divide-y divide-gray-200">
  //           {bookings.map((booking) => (
  //             <tr key={booking.booking_id} className="hover:bg-gray-50 transition-colors">
  //               <td className="px-4 py-2 text-sm font-medium text-gray-900">{booking.booking_id}</td>
  //               <td className="px-4 py-2 text-sm text-gray-500">
  //                 {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : "—"}
  //               </td>
  //               <td className="px-4 py-2 text-sm text-gray-500">{booking.client?.name || "—"}</td>
  //               <td className="px-4 py-2 text-sm text-gray-500">{booking.driver?.name || booking.driver_id || "—"}</td>
  //               <td className="px-4 py-2 text-sm text-gray-500">{booking.car?.model_type || "—"}</td>
  //               <td className="px-4 py-2 text-sm text-gray-500">{booking.plan_days ?? "—"}</td>
  //               <td className="px-4 py-2 text-sm text-gray-500">
  //                 {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : "—"}
  //               </td>
  //               <td className="px-4 py-2 text-sm text-gray-500">
  //                 {booking.end_date ? new Date(booking.end_date).toLocaleDateString() : "—"}
  //               </td>
  //               <td className="px-4 py-2 text-sm text-gray-500">
  //                 {booking.payment ? `PKR ${booking.payment}` : "—"}
  //               </td>
  //               <td className="px-4 py-2">
  //                 <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
  //                   booking.status?.toLowerCase() === "ongoing" ? "bg-blue-100 text-blue-800" :
  //                   booking.status?.toLowerCase() === "confirmed" ? "bg-green-100 text-green-800" :
  //                   booking.status?.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-800" :
  //                   booking.status?.toLowerCase() === "cancelled" ? "bg-red-100 text-red-800" :
  //                   "bg-gray-100 text-gray-800"
  //                 }`}>
  //                   {booking.status || "—"}
  //                 </span>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );

return (
  <div className="bg-gray-100 rounded-xl shadow-md">
    {/* <h2 className="text-lg font-semibold text-gray-700 mb-4 px-2">New Bookings</h2> */}

    {status === "loading" ? (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading bookings...</span>
      </div>
    ) : status === "failed" ? (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Error: </strong>
        {error || "Failed to load bookings"}
      </div>
    ) : !bookings || bookings.length === 0 ? (
      <div className="px-6 py-8 text-center text-gray-500">No bookings found.</div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-6 py-3 border-b">Booking ID</th>
              <th className="px-6 py-3 border-b">Booking Date</th>
              <th className="px-6 py-3 border-b">Client</th>
              <th className="px-6 py-3 border-b">Driver</th>
              <th className="px-6 py-3 border-b">Car</th>
              <th className="px-6 py-3 border-b">Plan Days</th>
              <th className="px-6 py-3 border-b">Start Date</th>
              <th className="px-6 py-3 border-b">End Date</th>
              <th className="px-6 py-3 border-b">Payment</th>
              <th className="px-6 py-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.booking_id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{booking.booking_id}</td>
                <td className="px-6 py-4 text-gray-600">
                  {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4 text-gray-600">{booking.client?.name || "—"}</td>
                <td className="px-6 py-4 text-gray-600">{booking.driver?.name || booking.driver_id || "—"}</td>
                <td className="px-6 py-4 text-gray-600">{booking.car?.model_type || "—"}</td>
                <td className="px-6 py-4 text-gray-600">{booking.plan_days ?? "—"}</td>
                <td className="px-6 py-4 text-gray-600">
                  {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {booking.end_date ? new Date(booking.end_date).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-700">
                  {booking.payment ? `PKR ${booking.payment}` : "—"}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status?.toLowerCase() === "ongoing" ? "bg-blue-100 text-blue-800" :
                    booking.status?.toLowerCase() === "confirmed" ? "bg-green-100 text-green-800" :
                    booking.status?.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-800" :
                    booking.status?.toLowerCase() === "cancelled" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {booking.status || "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);


};

export default NewBookings;
