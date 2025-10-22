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
  const [selectedDriverForEdit, setSelectedDriverForEdit] =
    useState<Driver | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [statusOptions] = useState(["On Duty", "Off Duty", "Sick Leave"]);

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
  toast((t) => (
    <div>
      <div>Are you sure you want to delete <strong>{name}</strong>?</div>
      <div className="mt-2 flex gap-2">
        <button 
          onClick={() => {
            dispatch(deleteDriver(id))
            .unwrap()
            .then(() => {
              toast.dismiss(t.id);
              toast.success("Driver deleted successfully");
            });
          }}
          className="px-2 py-1 bg-green-500 text-white rounded"
        >
          Yes
        </button>
        <button 
          className="px-2 py-1 bg-red-500 text-white rounded"
          onClick={() => toast.dismiss(t.id)}
        >
          No
        </button>
      </div>
    </div>
  ), { duration: 10000 })
}


const handleStatusChange = async (id: number, newStatus: string) => {
  const driver = drivers.find((d) => d.id === id);
  if (!driver) return;

  const formData = new FormData();
  formData.append("name", driver.name);
  formData.append("email", driver.email);
  formData.append("phone", driver.phone);
  formData.append("status", newStatus);
  formData.append("address", driver.address || "N/A");

  if (driver.file instanceof File) {
    formData.append("profile_image", driver.file);
  }

  dispatch(updateDriver({ id, data: formData }))
    .unwrap()
    .then(() => toast.success("Status updated"))
    .catch((err) => {
      console.error("Update failed:", err);
      toast.error("Failed to update status");
    });
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
    <div className="bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search for driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="On Duty">On Duty</option>
          <option value="Off Duty">Off Duty</option>
          <option value="Sick Leave">Sick Leave</option>
        </select>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-3 py-1 bg-blue-500 cursor-pointer rounded-lg text-white hover:bg-blue-700"
        >
          + Add Driver
        </button>
      </div>

      {status === "loading" ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading drivers...</span>
        </div>
      ) : status === "failed" ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error: </strong>
          {typeof error === "object"
            ? (error as any).detail || JSON.stringify(error)
            : (error as any) || "Failed to load drivers"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-6 py-3 border-b">Profile</th>
                <th className="px-6 py-3 border-b">Name</th>
                <th className="px-6 py-3 border-b">Email</th>
                <th className="px-6 py-3 border-b">Phone</th>
                <th className="px-6 py-3 border-b">Status</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <img
                      src={
                        driver.profile_image ||
                        driver.profileImage ||
                        "https://via.placeholder.com/80"
                      }
                      alt={driver.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src = "https://via.placeholder.com/80")
                      }
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {driver.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {driver.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {driver.phone || "N/A"}
                  </td>
                        <td>
                  <select
                    value={driver.status}
                    onChange={(e) =>
                      handleStatusChange(driver.id, e.target.value)
                    }
                    className={`px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none ${getStatusColor(
                      driver.status
                    )} text-white`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedDriverForEdit(driver);
                          setShowEditForm(true);
                        }}
                        className="px-2 py-1 cursor-pointer text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteDriver(driver.id, driver.name)
                        }
                        className="px-2 py-1 cursor-pointer text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDrivers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No drivers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-md max-w-lg bg-white rounded-lg p-6 relative">
            <button
              onClick={() => {
                setShowAddForm(false);
                setShowEditForm(false);
              }}
              className="absolute cursor-pointer top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              X
            </button>
            {showAddForm && (
              <AddDriverForm
                onClose={() => setShowAddForm(false)}
                onSubmit={handleAddDriver}
              />
            )}
            {showEditForm && selectedDriverForEdit && (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
