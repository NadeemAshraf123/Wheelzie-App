import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../app/store";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCars,
  addCar,
  updateCar,
  deleteCar,
  selectCars,
  selectCarsStatus,
} from "../../../features/CarsSlice";
import AddCarForm from "./AddCarForm";
import EditCarForm from "./EditCarForm";

type Car = {
  id: number;
  name: string;
  model_type: string | null;
  license_plate: string;
  daily_rate: number | null;
  image?: string;
  file?: File;
};

const Cars: React.FC = () => {
  const dispatch = useAppDispatch();
  const cars = useSelector(selectCars);
  const status = useSelector(selectCarsStatus);

  const [search, setSearch] = useState("");
  const [selectedCarForEdit, setSelectedCarForEdit] = useState<Car | null>(
    null
  );
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCars());
    }
  }, [dispatch, status]);

  const handleAddCar = (data: Car) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("model_type", data.model_type || "");
    formData.append("license_plate", data.license_plate);
    formData.append("daily_rate", data.daily_rate?.toString() || "0");
    if (data.file) formData.append("image", data.file);

    dispatch(addCar(formData))
      .unwrap()
      .then(() => {
        toast.success("Car added successfully");
        setShowAddForm(false);
      })
      .catch(() => toast.error("Failed to add car"));
  };

  const handleUpdateCar = (data: Partial<Car>) => {
    if (!selectedCarForEdit) return;

    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("model_type", data.model_type || "");
    formData.append("license_plate", data.license_plate || "");
    formData.append("daily_rate", data.daily_rate?.toString() || "0");
    if (data.file) formData.append("image", data.file);

    dispatch(updateCar({ id: selectedCarForEdit.id, formData }))
      .unwrap()
      .then(() => {
        toast.success("Car updated successfully");
        setShowEditForm(false);
      })
      .catch(() => toast.error("Failed to update car"));
  };

  const handleDeleteCar = (id: number, name: string) => {
    toast(
      (t) => (
        <div>
          <div>
            Are you sure you want to delete <strong>{name}</strong>?
          </div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                dispatch(deleteCar(id))
                  .unwrap()
                  .then(() => {
                    toast.dismiss(t.id);
                    toast.success("Car deleted successfully");
                  })
                  .catch(() => {
                    toast.dismiss(t.id);
                    toast.error("Failed to delete car");
                  });
              }}
              className="px-2 py-1 cursor-pointer bg-green-500 text-white rounded"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-2 py-1 cursor-pointer bg-red-500 text-white rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search for car..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowAddForm(true)}
          className="px-3 py-1 bg-blue-500 cursor-pointer rounded-lg text-white hover:bg-blue-700"
        >
          + Add Car
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-6 py-3 border-b">Image</th>
              <th className="px-6 py-3 border-b">Car</th>
              <th className="px-6 py-3 border-b">Model</th>
              <th className="px-6 py-3 border-b">License</th>
              <th className="px-6 py-3 border-b">Rate / Day</th>
              <th className="px-6 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <img
                    src={car.image || "https://via.placeholder.com/80"}
                    alt={car.name}
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) =>
                      (e.currentTarget.src = "https://via.placeholder.com/80")
                    }
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {car.name || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {car.model_type || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {car.license_plate || "N/A"}
                </td>
                <td className="px-6 py-4 font-medium text-gray-600">
                  {car.daily_rate !== null ? `$${car.daily_rate}` : "N/A"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCarForEdit(car);
                        setShowEditForm(true);
                      }}
                      className="px-2 py-1 cursor-pointer text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCar(car.id, car.name)}
                      className="px-2 py-1 cursor-pointer text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCars.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No cars found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-md max-w-lg bg-white rounded-lg p-4 relative">
            <button
              onClick={() => {
                setShowAddForm(false);
                setShowEditForm(false);
              }}
              className="absolute  cursor-pointer top-2 right-3 text-gray-500 hover:text-gray-800 text-lg"
            >
              X
            </button>
            {showAddForm && (
              <AddCarForm
                onClose={() => setShowAddForm(false)}
                onSubmit={handleAddCar}
              />
            )}
            {showEditForm && selectedCarForEdit && (
              <EditCarForm
                car={selectedCarForEdit}
                onClose={() => setShowEditForm(false)}
                onSubmit={handleUpdateCar}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;
