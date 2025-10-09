import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Car } from "lucide-react";




const API_URL = "https://3d00fd53f473.ngrok-free.app/cars/";


const fetchCars = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch cars");
  return res.json();
};
const CarListPage: React.FC = () => {
  const { data: cars = [], isLoading, isError, error } = useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
  });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading cars...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-center text-red-600 mt-10">
        Error loading cars: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
  return (


    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-md max-w-6xl mx-auto p-6">
    
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Car className="w-5 h-5 text-red-500" />
            Car Inventory
          </h2>
          <p className="text-gray-500 text-sm">
            Total Cars:{" "}
            <span className="font-semibold text-gray-800">{cars.length}</span>
          </p>
        </div>
    
        {cars.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No cars found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b">Image</th>
                  <th className="px-4 py-2 border-b">Car Name</th>
                  <th className="px-4 py-2 border-b">Model Type</th>
                  <th className="px-4 py-2 border-b">License Plate</th>
                  <th className="px-4 py-2 border-b">Daily Rate</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car: any) => (
                  <tr
                    key={car.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">
                      <img
                        src="https://via.placeholder.com/80"
                        alt={car.name}
                        className="w-20 h-14 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2 font-medium">{car.name}</td>
                    <td className="px-4 py-2 text-gray-600">
                      {car.model_type}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {car.license_plate}
                    </td>
                    <td className="px-4 py-2 font-semibold text-green-600">
                      Rs. {car.daily_rate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default CarListPage;