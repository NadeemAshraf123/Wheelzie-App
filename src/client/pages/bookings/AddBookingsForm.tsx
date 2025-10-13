import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBooking } from "../../../features/BookingSlice";
import { fetchDrivers } from "../../../features/DriversSlice";
import { fetchCars } from "../../../features/CarsSlice";
import { fetchClients } from "../../../features/ClientsSlice";
import type { AppDispatch, RootState } from "../../../app/store";

const AddBookingForm = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { drivers } = useSelector((state: RootState) => state.drivers);
  const { cars } = useSelector((state: RootState) => state.cars);
  const { clients } = useSelector((state: RootState) => state.clients);

  useEffect(() => {
    dispatch(fetchDrivers());
    dispatch(fetchCars());
    dispatch(fetchClients());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    booking_date: "",
    client: "",
    driver: "",
    car: "",
    plan_days: "",
    start_date: "",
    end_date: "",
    rate_per_day: "",
    payment: "",
    status: "Ongoing",
  });

  const [ratePerDay, setRatePerDay] = useState<number>(0);

 
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffTime = end.getTime() - start.getTime();
      if (diffTime >= 0) {
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setFormData((prev) => ({ ...prev, plan_days: diffDays.toString() }));
      }
    }
  }, [formData.start_date, formData.end_date]);

 
  useEffect(() => {
    if (ratePerDay && formData.plan_days) {
      const totalPayment = ratePerDay * Number(formData.plan_days);
      setFormData((prev) => ({ ...prev, payment: totalPayment.toString() }));
    }
  }, [ratePerDay, formData.plan_days]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

   
    setFormData((prev) => ({ ...prev, [name]: value }));

  
    if (name === "car") {
      const selectedCar = cars.find((c) => c.id === Number(value));
      setRatePerDay(selectedCar?.daily_rate || 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.client || !formData.driver || !formData.car) {
      alert("Please add client name and select driver and car");
      return;
    }

    const payload = {
      booking_id: "BK" + Date.now().toString().slice(-10),
      booking_date: formData.booking_date,
      client_id: Number(formData.client),
      driver_id: Number(formData.driver),
      car_id: Number(formData.car),
      plan_days: Number(formData.plan_days),
      start_date: formData.start_date,
      end_date: formData.end_date,
      payment: Number(formData.payment),
      status: formData.status,
    };

    await dispatch(addBooking(payload));
    onClose();
  };

  
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4">Add Booking</h2>

    
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Booking Date
          </label>
          <input
            type="date"
            name="booking_date"
            value={formData.booking_date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
            min={today}
          />
        </div>

      
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Client</label>
          <select
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select Client</option>
            {clients?.map((client: any) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

    
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Driver</label>
          <select
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select Driver</option>
            {drivers?.map((driver: any) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Car</label>
          <select
            name="car"
            value={formData.car}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select Car</option>
            {cars?.map((car: any) => (
              <option key={car.id} value={car.id}>
                {car.name} ({car.license_plate})
              </option>
            ))}
          </select>
        </div>

      
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Rate per day</label>
          <input
            type="number"
            value={ratePerDay}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          />
        </div>

      
        {[
          { label: "Start Date", name: "start_date", type: "date" },
          { label: "End Date", name: "end_date", type: "date" },
          { label: "Plan Days (Auto)", name: "plan_days", type: "number", disabled: true },
          { label: "Payment (Auto)", name: "payment", type: "number", disabled: true },
        ].map(({ label, name, type, disabled }) => (
          <div key={name} className="mb-3">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              disabled={disabled}
              className={`mt-1 block w-full border border-gray-300 rounded px-3 py-2 ${
                disabled ? "bg-gray-100" : ""
              }`}
              required={!disabled}
              min={
                name === "start_date"
                  ? formData.booking_date || today
                  : name === "end_date"
                  ? formData.start_date
                  : undefined
              }
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
