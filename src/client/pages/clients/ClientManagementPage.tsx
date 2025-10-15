import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, FileText } from "lucide-react";
import toast from "react-hot-toast";
import EditClientModal from "./EditClientModal";
import AddClientForm from "./AddClientForm";
import {
  fetchClients,
  createClient,
  deleteClient,
  selectClients,
  selectClientsStatus,
  selectClientsError,
  selectClientsDeleting,
} from "../../../features/ClientsSlice";

const ClientManagementPage: React.FC = () => {
  const dispatch = useDispatch<any>();

  const clients = useSelector(selectClients);
  const status = useSelector(selectClientsStatus);
  const error = useSelector(selectClientsError);
  const deleting = useSelector(selectClientsDeleting);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchClients());
    }
  }, [dispatch, status]);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedClients(filteredClients.map((c) => c.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (id: number) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      dispatch(deleteClient(id));
    }
  };

  const handleAddClick = () => {
    setIsAddOpen(true);
  };

  const handleEditClick = (client: any) => {
    setEditingClient(client);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditingClient(null);
  };

  const handleAddClient = (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    document_name: string;
    file?: File;
  }) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("document_name", data.document_name);
    if (data.file) formData.append("profile_image", data.file);

    // ✅ Dispatch createClient instead of fetchClient
    dispatch(createClient(formData))
      .unwrap()
      .then(() => {
        toast.success("Client added successfully");
        setIsAddOpen(false);
      })
      .catch(() => toast.error("Failed to add client"));
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading clients...</div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-red-600">
          Error loading clients. Make sure server is live.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-9xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for client"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>
            <button
              className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors"
              onClick={handleAddClick}
            >
              Add Client
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedClients.length === filteredClients.length &&
                        filteredClients.length > 0
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client.id)}
                        onChange={() => handleSelectClient(client.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    <td className=" px-2 py-2  mt-10 md:px-6 md:py-4  flex items-center md:flex items-center ">
                      <img
                        src={
                          client.image ||
                          client.profile_image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            client.name
                          )}`
                        }
                        onError={(e) =>
                          (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            client.name
                          )}`)
                        }
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                        alt={client.name}
                      />
                      <div>
                        <div className="text-sm  font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">{client.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{client.address}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{client.document_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{client.points}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditClick(client)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          disabled={deleting}
                          className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-gray-500">No clients found.</div>
          )}
        </div>
      </div>

      {isEditOpen && editingClient && (
        <EditClientModal client={editingClient} onClose={closeEdit} />
      )}

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl  max-h-[100vh] p-2  w-[500px] relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-2 right-3 text-gray-500  hover:text-gray-800 text-xl"
            >
              ✖
            </button>
            <AddClientForm
              onClose={() => setIsAddOpen(false)}
              onSubmit={handleAddClient}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ClientManagementPage;
