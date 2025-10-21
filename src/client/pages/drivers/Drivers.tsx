import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import {
  fetchDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  selectDrivers,
  selectDriversStatus,
} from "../../../features/DriversSlice";
import AddDriverForm from "./AddDriverForm";
import EditDriverForm from "./EditDriverForm";

type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  address: string;
  profile_image?: string;
  profileImage?: string;
  file?: File;
};

const Drivers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const drivers = useSelector(selectDrivers);
  const status = useSelector(selectDriversStatus);
  const error = useSelector((state: RootState) => state.drivers.error);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDriverForEdit, setSelectedDriverForEdit] = useState<Driver | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDrivers());
    }
  }, [dispatch, status]);

  const handleAddDriver = (data: Driver) => {
    dispatch(
      addDriver({
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        profile_image: "https://via.placeholder.com/100",
        address: data.address || "N/A",
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Driver added successfully");
        setShowAddForm(false);
      })
      .catch(() => toast.error("Failed to add driver"));
  };

  const handleUpdateDriver = (payload: { id: number; data: FormData }) => {
    dispatch(updateDriver(payload))
      .unwrap()
      .then(() => {
        toast.success("Driver updated successfully");
        setShowEditForm(false);
      })
      .catch(() => toast.error("Failed to update driver"));
  };

  const handleDeleteDriver = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      dispatch(deleteDriver(id))
        .unwrap()
        .then(() => toast.success("Driver deleted successfully"))
        .catch(() => toast.error("Failed to delete driver"));
    }
  };

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? driver.status === statusFilter : true)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Duty":
        return "bg-green-500";
      case "Off Duty":
        return "bg-yellow-500";
      case "Sick Leave":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full">
      
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search for driver"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="On Duty">On Duty</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Sick Leave">Sick Leave</option>
          </select>

          <button
            onClick={() => setShowAddForm(true)}
            className="ml-auto bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Driver
          </button>
        </div>
      </div>

      {status === "loading" ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : status === "failed" ? (
        <div className="text-center py-10 text-red-600">Error: {String(error)}</div>
      ) : filteredDrivers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No drivers found</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-lg uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-lg uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-lg uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-lg uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-lg uppercase tracking-wider">
                  Status
                </th>
             
                <th className="px-6 py-3 text-left text-xs font-lg uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={driver.profile_image || driver.profileImage || "https://via.placeholder.com/80"}
                      alt={driver.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src = "https://via.placeholder.com/80")
                      }
                    />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{driver.name || "N/A"}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">{driver.email || "N/A"}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">{driver.phone || "N/A"}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(driver.status)}`}
                    >
                      {driver.status || "N/A"}
                    </span>
                  </td>
                  
                 
                  
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => {
                        setSelectedDriverForEdit(driver);
                        setShowEditForm(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDriver(driver.id, driver.name)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>


          </table>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] relative">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✖
            </button>
            <AddDriverForm
              onClose={() => setShowAddForm(false)}
              onSubmit={handleAddDriver}
            />
          </div>
        </div>
      )}

      {showEditForm && selectedDriverForEdit && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] relative">
            <button
              onClick={() => setShowEditForm(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-900 cursor-pointer text-xl"
            >
              ✖
            </button>
            <EditDriverForm
              driver={selectedDriverForEdit}
              onClose={() => setShowEditForm(false)}
              onSubmit={(formData) =>
                handleUpdateDriver({
                  data: formData,
                  id: selectedDriverForEdit.id,
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;