import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface Car {
  id: number;
  name: string;
  model_type: string;
  license_plate: string;
  daily_rate: number;
}

const fetchCars = async (): Promise<Car[]> => {
    
  const response = await fetch("https://83743e85f399.ngrok-free.app/cars/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    const text = await response.text();
    console.warn("Received non-JSON response:", text);
    throw new Error("Server did not return valid JSON");
  }
};

const CarList: React.FC = () => {

    const navigate = useNavigate();


  const {
    data: cars = [],
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg font-semibold text-gray-600">Loading cars...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-2xl mx-auto mt-8">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <strong className="font-bold">Error Loading Cars</strong>
        </div>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  } const HandleCarForm = () => {
    navigate('/addunit');
  }
 

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Available Cars
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{cars.length} cars available</span>
          </div>
          <button 
                onClick={HandleCarForm}
                className="text-lg bg-red-600 cursor-pointer rounded-lg text-white p-2">
            AddUnit
          </button>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No cars available</h3>
            <p className="mt-2 text-gray-500">Check back later for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 truncate mr-2">
                    {car.name}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    ID: {car.id}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path
                          fillRule="evenodd"
                          d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Model</span>
                    </div>
                    <span className="text-gray-800 font-semibold">
                      {car.model_type || "Not specified"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">License</span>
                    </div>
                    <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono font-bold text-gray-800 border">
                      {car.license_plate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Daily Rate</span>
                    </div>
                    <span className="text-green-600 font-bold text-xl">
                      ${car.daily_rate}
                      <span className="text-sm font-normal text-gray-500">/day</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarList;