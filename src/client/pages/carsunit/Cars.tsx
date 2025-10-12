import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../app/store"
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
  const [selectedCarForEdit, setSelectedCarForEdit] = useState<Car | null>(null);
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
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      dispatch(deleteCar(id))
        .unwrap()
        .then(() => toast.success("Car deleted successfully"))
        .catch(() => toast.error("Failed to delete car"));
    }
  };

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 w-full">
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search for car"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-xl w-1/3"
        />

        <button
          onClick={() => setShowAddForm(true)}
          className="ml-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Car
        </button>
      </div>

      {status === "loading" ? (
        <div className="text-center py-10">Loading...</div>
      ) : filteredCars.length === 0 ? (
        <div className="text-center py-10">No cars found</div>
      ) : (
        <div className="space-y-2">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="flex items-center justify-between gap-6 p-4 bg-white rounded-lg shadow hover:bg-gray-50"
            >
              <img
                src={car.image ? car.image : "https://via.placeholder.com/80"}
                alt={car.name}
                className="w-26 h-26 rounded"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/80")
                }
              />

              <div className="w-40 font-semibold">{car.name || "N/A"}</div>
              <div className="w-32 text-gray-600">{car.model_type || "N/A"}</div>
              <div className="w-32 text-gray-600">{car.license_plate || "N/A"}</div>
              <div className="w-24 text-gray-600">
                {car.daily_rate !== null ? `$${car.daily_rate}` : "N/A"}
              </div>

              <button
                onClick={() => {
                  setSelectedCarForEdit(car);
                  setShowEditForm(true);
                }}
                className="bg-gray-300 px-2 py-1 text-gray-700 rounded-md"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteCar(car.id, car.name)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <div className="absolute inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] relative">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✖
            </button>
            <AddCarForm
              onClose={() => setShowAddForm(false)}
              onSubmit={handleAddCar}
            />
          </div>
        </div>
      )}

      {showEditForm && selectedCarForEdit && (
        <div className="absolute inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] relative">
            <button
              onClick={() => setShowEditForm(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✖
            </button>
            <EditCarForm
              car={selectedCarForEdit}
              onClose={() => setShowEditForm(false)}
              onSubmit={handleUpdateCar}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;
