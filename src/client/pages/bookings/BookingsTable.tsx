import React, { useEffect, useState } from "react";
import AddBookingForm from "./AddBookingsForm";
import { useSelector, useDispatch } from "react-redux";
import { fetchBookings } from "../../../features/BookingSlice";
import type { AppDispatch, RootState } from "../../../app/store";

interface Booking {
  id: number;
  booking_id: string;
  booking_date: string;
  client: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string | null;
  };
  driver: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string | null;
  };
  car: {
    id: number;
    name: string;
    model_type: string;
    license_plate: string;
  };
  plan_days: number;
  start_date: string;
  end_date: string;
  payment: string;
  status: string;
}

const BookingsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, status, error } = useSelector(
    (state: RootState) => state.bookings
  );

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBookings());
    }
  }, [dispatch, status]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading bookings...</span>
      </div>
    );

  if (status === "failed")
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Error: </strong>
        {typeof error === "object"
          ? error.detail || JSON.stringify(error)
          : error || "Failed to load bookings"}
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        No bookings found
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold text-gray-400 mb-6">Bookings</h2>
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 px-4 py-2 bg-red-600 cursor-pointer text-white rounded hover:bg-red-700"
        >
          AddBooking
        </button>

        {showModal && <AddBookingForm onClose={() => setShowModal(false)} />}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking Date
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Car
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan Days
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((booking: Booking) => (
              <tr
                key={booking.booking_id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.booking_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.booking_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.client?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.driver?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.car?.model_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.plan_days}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.start_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.end_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  ${booking.payment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status.toLowerCase() === "ongoing"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status.toLowerCase() === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status.toLowerCase() === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTable;
