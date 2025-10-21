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
      <div className="bg-gray-100 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4 p-2">
          <input
            type="search"
            placeholder="Search for client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddClick}
            className="px-3 py-1 bg-blue-500 cursor-pointer rounded-lg text-white hover:bg-blue-700"
          >
            + Add Client
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b">Select</th>
                <th className="px-6 py-3 border-b">Client</th>
                <th className="px-6 py-3 border-b">Phone</th>
                <th className="px-6 py-3 border-b">Address</th>
                <th className="px-6 py-3 border-b">Documents</th>
                <th className="px-6 py-3 border-b">Points</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={() => handleSelectClient(client.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 flex items-center">
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
                      <div className="text-sm font-medium text-gray-900">
                        {client.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {client.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {client.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {client.address}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{client.document_name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {client.points}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(client)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        disabled={deleting}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isAddOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-lg p-4 relative"
            >
              <button
                onClick={() => setIsAddOpen(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
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

        {isEditOpen && editingClient && (
          <EditClientModal client={editingClient} onClose={closeEdit} />
        )}
      </div>
    </>
  );
};

export default ClientManagementPage;
