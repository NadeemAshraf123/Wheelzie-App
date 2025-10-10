import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBooking } from '../../../features/BookingSlice';
import type { AppDispatch } from '../../../app/store';

const AddBookingForm = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    booking_date: '',
    client_id: '',
    driver_id: '',
    car_id: '',
    plan_days: '',
    start_date: '',
    end_date: '',
    payment: '',
    status: 'Ongoing',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!formData.client_id || !formData.driver_id || !formData.car_id) {
      alert('Please fill all required fields');
      return;
    }

    await dispatch(addBooking(formData));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4">Add Booking</h2>

        {[
          { label: 'Booking Date', name: 'booking_date' },
          { label: 'Client ID', name: 'client_id' },
          { label: 'Driver ID', name: 'driver_id' },
          { label: 'Car ID', name: 'car_id' },
          { label: 'Plan Days', name: 'plan_days' },
          { label: 'Start Date', name: 'start_date' },
          { label: 'End Date', name: 'end_date' },
          { label: 'Payment', name: 'payment' },
        ].map(({ label, name }) => (
          <div key={name} className="mb-3">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type="text"
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        ))}

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookingForm;
