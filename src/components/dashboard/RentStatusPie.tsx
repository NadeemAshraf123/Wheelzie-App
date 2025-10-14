import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface RentStatusData {
  hired: number;
  pending: number;
  cancelled: number;
}

const RentStatusDonut: React.FC = () => {


  const { data, isLoading, error } = useQuery({
    queryKey: ["rentStatus"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/rentStatus");
      return res.data;
    },
  });

  if (isLoading)
    return <div className="bg-white rounded-xl shadow p-4">Loading rent status...</div>;

  if (error)
    return (
      <div className="bg-white rounded-xl shadow p-4 text-red-500">
        Error loading rent status: {(error as Error).message}
      </div>
    );

  const rentData = data as RentStatusData;

  const total = rentData.hired + rentData.pending + rentData.cancelled;
  const hiredPercent = Math.round((rentData.hired / total) * 100);
  const pendingPercent = Math.round((rentData.pending / total) * 100);
  const cancelledPercent = Math.round((rentData.cancelled / total) * 100);

  const chartData = {
    labels: ["Hired", "Pending", "Cancelled"],
    datasets: [
      {
        data: [rentData.hired, rentData.pending, rentData.cancelled],
        backgroundColor: [
          "#111827", 
          "#ef4422", 
          "#f3f4f6", 
        ],
        borderWidth: 0,
        cutout: "70%",
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white w-sm min-h-4/12 rounded-2xl shadow-sm p-5">
    
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Rent Status</h3>
        <button className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-md hover:bg-gray-200">
          This Week ▾
        </button>
      </div>

    
      <div className="h-52 flex items-center justify-center ">
        <Pie data={chartData} options={options} />
      </div>

      
      <div className="mt-6 space-y-2 text-sm">
        
        <div className="flex justify-between text-gray-700">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#111827]" />
            <span>Hired</span>
          </div>
          <div className="font-semibold">
            {hiredPercent}% <span className="text-green-500">↑</span>
          </div>
        </div>

        
        <div className="flex justify-between text-gray-700">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-600" />
            <span>Pending</span>
          </div>
          <div className="font-semibold">
            {pendingPercent}% <span className="text-red-600">↓</span>
          </div>
        </div>

        
        <div className="flex justify-between text-gray-700">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#f3f4f6] border border-gray-300" />
            <span>Cancelled</span>
          </div>
          <div className="font-semibold">
            {cancelledPercent}% <span className="text-green-500">↑</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentStatusDonut;
