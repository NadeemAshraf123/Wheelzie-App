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

const Drivers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const drivers = useSelector(selectDrivers);
  const status = useSelector(selectDriversStatus);
  const error = useSelector((state: RootState) => state.drivers.error);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDriverForEdit, setSelectedDriverForEdit] = useState<
    any | null
  >(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDrivers());
    }
  }, [dispatch, status]);

  const handleAddDriver = async (data: any) => {
    try {
      await dispatch(
        addDriver({
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status,
          profile_image: "https://via.placeholder.com/100",
          address: data.address || "N/A",
        })
      ).unwrap();
      toast.success("Driver added successfully");
      setShowAddForm(false);
    } catch (err: any) {
      toast.error("Failed to add driver");
      console.error(err);
    }
  };

  const handleUpdateDriver = async (payload: {
    id: number;
    data: FormData;
  }) => {
    try {
      await dispatch(updateDriver(payload)).unwrap();
      toast.success("Driver updated successfully");
      setShowEditForm(false);
    } catch (err: any) {
      toast.error("Failed to update driver");
      console.error(err);
    }
  };

  const handleDeleteDriver = async (id: number) => {
    try {
      await dispatch(deleteDriver(id)).unwrap();
      toast.success("Driver deleted successfully");
      setSelectedDriver(null);
    } catch (err: any) {
      toast.error("Failed to delete driver");
      console.error(err);
    }
  };

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? driver.status === statusFilter : true)
  );

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className="w-2/3 p-6 overflow-y-auto border-r border-gray-300">
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search for driver"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded w-1/2"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">All Status</option>
            <option value="On Duty">On Duty</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Sick Leave">Sick Leave</option>
          </select>

          <button
            onClick={() => setShowAddForm(true)}
            className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Add Driver
          </button>
        </div>

        {status === "loading" && (
          <div className="p-4 text-center">Loading drivers...</div>
        )}
        {status === "failed" && (
          <div className="p-4 text-center text-red-600">
            Error: {String(error)}
          </div>
        )}

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {status !== "loading" &&
              filteredDrivers.map((driver) => (
                <tr
                  key={driver.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedDriver(driver);
                    toast.success(`Viewing ${driver.name}`);
                  }}
                >
                  <td className="p-2 flex items-center gap-2">
                    <img
                      src={
                        driver.profile_image ||
                        driver.profileImage ||
                        "https://via.placeholder.com/40"
                      }
                      alt={driver.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {driver.name}
                  </td>
                  <td className="p-2">{driver.email}</td>
                  <td className="p-2">{driver.phone}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        driver.status === "On Duty"
                          ? "bg-green-500"
                          : driver.status === "Off Duty"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {driver.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDriverForEdit(driver);
                          setShowEditForm(true);
                        }}
                        className="bg-gray-300 text-gray-800 rounded-md px-2"
                      >
                        edit
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast(
                            (t) => (
                              <div className="flex items-center gap-3">
                                <span>
                                  Delete <b>{driver.name}</b>?
                                </span>
                                <button
                                  className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                                  onClick={() => {
                                    handleDeleteDriver(driver.id);
                                    toast.dismiss(t.id);
                                  }}
                                >
                                  Yes
                                </button>
                                <button
                                  className="bg-gray-300 text-black px-2 py-1 rounded text-sm"
                                  onClick={() => toast.dismiss(t.id)}
                                >
                                  No
                                </button>
                              </div>
                            ),
                            { duration: 4000, position: "top-center" }
                          );
                        }}
                        className="bg-red-600 text-white rounded-md px-2"
                      >
                        del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {status !== "loading" && filteredDrivers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No drivers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedDriver && (
        <div className="w-1/3 p-6 bg-gray-50 overflow-y-auto border-l border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img
                src={
                  selectedDriver.profile_image ||
                  "https://via.placeholder.com/100"
                }
                alt={selectedDriver.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold">{selectedDriver.name}</h2>
                <p className="text-sm text-gray-600">{selectedDriver.status}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <p>
              <strong>Email:</strong> {selectedDriver.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedDriver.phone}
            </p>
            <p>
              <strong>Address:</strong> {selectedDriver.address || "N/A"}
            </p>
          </div>

          <div className="flex gap-2 mt-6">
            <button className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 w-full">
              Message
            </button>
            <button
              className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 w-full"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDriverForEdit(selectedDriver);
                setShowEditForm(true);
              }}
            >
              Edit
            </button>
          </div>
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
            <AddDriverForm
              onClose={() => setShowAddForm(false)}
              onSubmit={handleAddDriver}
            />
          </div>
        </div>
      )}

      {showEditForm && selectedDriverForEdit && (
        <div className="absolute inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] relative">
            <button
              onClick={() => setShowEditForm(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
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
