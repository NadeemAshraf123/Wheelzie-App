import React, { useEffect, useMemo, useState } from "react";
import AddBookingForm from "./AddBookingsForm";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBookings,
  deleteBooking,
  updateBooking,
  addBooking,
} from "../../../features/BookingSlice";
import type { AppDispatch, RootState } from "../../../app/store";
import toast from "react-hot-toast";

interface Booking {
  id: number;
  booking_id: string;
  booking_date: string;
  client: { id: number; name: string; email: string; phone: string };
  driver: { id: number; name: string; email: string; phone: string };
  car: { id: number; name: string; model_type: string; license_plate: string };
  plan_days: number;
  start_date: string;
  end_date: string;
  payment: string | number;
  status: string;
}

const BookingsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status, error } = useSelector(
    (state: RootState) => state.bookings
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBookings());
    }
  }, [dispatch, status]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
        setSelectedBooking(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleDeleteConfirm = (id: number) => {
    toast(
      (t) => (
        <div>
          <div>Are you sure you want to delete this booking?</div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                dispatch(deleteBooking(id))
                  .unwrap()
                  .then(() => {
                    toast.dismiss(t.id);
                    toast.success("Booking deleted");
                  })
                  .catch(() => {
                    toast.dismiss(t.id);
                    toast.error("Failed to delete booking");
                  });
              }}
              className="px-2 py-1 bg-green-400 text-white rounded-r-md"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-2 py-1  bg-red-400 text-white rounded-r-md"
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleAddNew = () => {
    setSelectedBooking(null);
    setShowModal(true);
  };


  const filteredBookings = useMemo(() => {
    if (!data || data.length === 0) return [];

    const term = searchTerm.trim().toLowerCase();
    if (!term) return data;

  
    return data.filter((booking: Booking) =>
      booking.booking_id.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);


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
          ? (error as any).detail || JSON.stringify(error)
          : (error as any) || "Failed to load bookings"}
      </div>
    );

  return (
    <div className=" bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4 p-2">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="search"
          placeholder="Search by booking id..."
          className="px-4 py-2 border border-gray-300 rounded-lg w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"        />
        <button
          onClick={handleAddNew}
          className="px-3 py-1 bg-blue-500 cursor-pointer rounded-lg text-white hover:bg-blue-700"
        >
          + Add Booking
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => {
            setShowModal(false);
            setSelectedBooking(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-lg p-4"
          >
            <AddBookingForm
              editingBooking={selectedBooking}
              onClose={() => {
                setShowModal(false);
                setSelectedBooking(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
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
              <th className="px-6 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBookings.map((booking: Booking) => (
              <tr
                key={booking.booking_id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4">{booking.booking_id}</td>
                <td className="px-6 py-4">
                  {new Date(booking.booking_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{booking.client?.name}</td>
                <td className="px-6 py-4">{booking.driver?.name}</td>
                <td className="px-6 py-4">{booking.car?.model_type}</td>
                <td className="px-6 py-4">{booking.plan_days}</td>
                <td className="px-6 py-4">
                  {new Date(booking.start_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(booking.end_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-semibold">${booking.payment}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status.toLowerCase() === "ongoing"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status.toLowerCase() === "returned"
                        ? "bg-green-100 text-green-800"
                        : booking.status.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status.toLowerCase() === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : booking.status.toLowerCase() === "completed"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(booking)}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(booking.id)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTable;
