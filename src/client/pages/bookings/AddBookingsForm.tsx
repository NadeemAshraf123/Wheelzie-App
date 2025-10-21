import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBooking, updateBooking } from "../../../features/BookingSlice";
import { fetchDrivers } from "../../../features/DriversSlice";
import { fetchCars } from "../../../features/CarsSlice";
import { fetchClients } from "../../../features/ClientsSlice";
import type { AppDispatch, RootState } from "../../../app/store";
import toast from "react-hot-toast";

interface BookingFormProps {
  onClose: () => void;
  editingBooking?: any;
}

const AddBookingForm: React.FC<BookingFormProps> = ({
  onClose,
  editingBooking,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { drivers } = useSelector((state: RootState) => state.drivers);
  const { cars } = useSelector((state: RootState) => state.cars);
  const { clients } = useSelector((state: RootState) => state.clients);

  const today = new Date().toISOString().split("T")[0];

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
    status: "Pending",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [ratePerDay, setRatePerDay] = useState<number>(0);

  useEffect(() => {
    if (editingBooking) {
      console.log("editing booking rate", editingBooking.rate_per_day);
      setFormData({
        booking_date: editingBooking.booking_date,
        client: editingBooking.client.id.toString(),
        driver: editingBooking.driver.id.toString(),
        car: editingBooking.car.id.toString(),
        plan_days: editingBooking.plan_days.toString(),
        start_date: editingBooking.start_date,
        end_date: editingBooking.end_date,
        rate_per_day: editingBooking.rate_per_day?.toString() || "",
        payment: editingBooking.payment.toString(),
        status: editingBooking.status,
      });
      const rate =
        editingBooking.rate_per_day || editingBooking.car?.daily_rate || 0;

      setRatePerDay(rate);
    }
  }, [editingBooking]);

  useEffect(() => {
    dispatch(fetchDrivers());
    dispatch(fetchCars());
    dispatch(fetchClients());
  }, [dispatch]);

  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffDays = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays >= 0)
        setFormData((prev) => ({ ...prev, plan_days: diffDays.toString() }));
    }
  }, [formData.start_date, formData.end_date]);

  useEffect(() => {
    if (ratePerDay && formData.plan_days) {
      setFormData((prev) => ({
        ...prev,
        payment: (ratePerDay * Number(formData.plan_days)).toString(),
      }));
    }
  }, [ratePerDay, formData.plan_days]);

  
  const isEditable = !editingBooking || formData.status === "Pending";
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (editingBooking && !isEditable && name !== "status") return;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "car") {
      const selectedCar = cars.find((c) => c.id === Number(value));
      setRatePerDay(selectedCar?.daily_rate || 0);
    }

  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.booking_date) newErrors.booking_date = "Booking date required";
    if (!formData.client) newErrors.client = "Client selection required";
    if (!formData.driver) newErrors.driver = "Driver selection required";
    if (!formData.car) newErrors.car = "Car selection required";
    if (!formData.start_date) newErrors.start_date = "Start date required";
    if (!formData.end_date) newErrors.end_date = "End date required";
    if (
      formData.start_date &&
      formData.end_date &&
      new Date(formData.end_date) < new Date(formData.start_date)
    ) {
      newErrors.end_date = "End date cannot be before start date";
    }
    if (!formData.status) newErrors.status = "Status required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      booking_id: editingBooking
        ? editingBooking.booking_id
        : "BK" + Date.now().toString().slice(-10),

      booking_date: formData.booking_date,
      client_id: Number(formData.client),
      driver_id: Number(formData.driver),
      car_id: Number(formData.car),
      plan_days: Number(formData.plan_days),
      start_date: formData.start_date,
      end_date: formData.end_date,
      payment: Number(formData.payment),
      status: formData.status,
      rate_per_day: ratePerDay,
    };

    try {
      if (editingBooking) {
        await dispatch(
          updateBooking({ id: editingBooking.id, bookingData: payload })
        );
        toast.success("Booking updated!");
      } else {
        await dispatch(addBooking(payload));
        toast.success("Booking added!");
      }
      onClose();
    } catch {
      toast.error("Operation failed!");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mt-5 md:mb-2">
          {editingBooking ? "Edit Booking" : "Add Booking"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className=" lg:mb-3">
            <label className="block text-sm font-medium">Booking Date</label>
            <input
              type="date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              min={today}
              disabled={!isEditable && editingBooking ? true : false}
              className={`mt-1 block w-full border rounded px-3 py-2 ${
                errors.booking_date ? "border-red-500" : "border-gray-300"
              } ${!isEditable && editingBooking ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
            {errors.booking_date && (
              <p className="text-red-500 text-xs">{errors.booking_date}</p>
            )}
          </div>

          <div className="lg:mb-3">
            <label className="block text-sm font-medium">Client</label>
            <select
              name="client"
              value={formData.client}
              onChange={handleChange}
              disabled={!isEditable && editingBooking ? true : false}
              className={`mt-1 block w-full border rounded px-3 py-2 ${
                errors.client ? "border-red-500" : "border-gray-300"
              } ${!isEditable && editingBooking ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              <option value="">Select Client</option>
              {clients.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.client && (
              <p className="text-red-500 text-xs">{errors.client}</p>
            )}
          </div>

          <div className="lg:mb-3">
            <label className="block text-sm font-medium">Driver</label>
            <select
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              disabled={!isEditable && editingBooking ? true : false}
              className={`mt-1 block w-full border rounded px-3 py-2 ${
                errors.driver ? "border-red-500" : "border-gray-300"
              } ${!isEditable && editingBooking ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              <option value="">Select Driver</option>
              {drivers.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.driver && (
              <p className="text-red-500 text-xs">{errors.driver}</p>
            )}
          </div>

          <div className="lg:mb-3">
            <label className="block text-sm font-medium">Car</label>
            <select
              name="car"
              value={formData.car}
              onChange={handleChange}
              disabled={!isEditable && editingBooking ? true : false}
              className={`mt-1 block w-full border rounded px-3 py-2 ${
                errors.car ? "border-red-500" : "border-gray-300"
              } ${!isEditable && editingBooking ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              <option value="">Select Car</option>
              {cars.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.license_plate})
                </option>
              ))}
            </select>
            {errors.car && <p className="text-red-500 text-xs">{errors.car}</p>}
          </div>

          <div className="lg:mb-3">
            <label className="block text-sm font-medium">Rate per day</label>
            <input
              type="number"
              value={ratePerDay}
              readOnly
              className="mt-1 block w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {["start_date", "end_date"].map((name) => (
            <div key={name} className="lg:mb-3">
              <label className="block text-sm font-medium">
                {name === "start_date" ? "Start Date" : "End Date"}
              </label>
              <input
                type="date"
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                disabled={!isEditable && editingBooking ? true : false}
                min={
                  name === "start_date"
                    ? formData.booking_date || today
                    : formData.start_date
                }
                className={`mt-1 block w-full border rounded px-3 py-2 ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                } ${!isEditable && editingBooking ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {errors[name] && (
                <p className="text-red-500 text-xs">{errors[name]}</p>
              )}
            </div>
          ))}

          <div className="lg:mb-3">
            <label className="block text-sm font-medium">Plan Days</label>
            <input
              type="number"
              value={formData.plan_days}
              readOnly
              className="mt-1 block w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div className="lg:mb-3">
            <label className="block text-sm font-medium">Payment</label>
            <input
              type="number"
              value={formData.payment}
              readOnly
              className="mt-1 block w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div className="lg:mb-3">
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              
              className={`mt-1 block w-full border rounded px-3 py-2 ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="Pending">Pending</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Returned">Returned</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs">{errors.status}</p>
            )}
          </div>

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
              {editingBooking ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookingForm;
