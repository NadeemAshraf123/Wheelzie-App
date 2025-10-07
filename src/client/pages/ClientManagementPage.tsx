import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  points: number;
  documents: Document[];
}

const API_URL = 'http://localhost:3000/clients';

const fetchClients = async (): Promise<Client[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch clients');
  return response.json();
};

const deleteClient = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete client');
};

const updateClient = async (id: number, client: Partial<Client>): Promise<Client> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(client),
  });
  if (!response.ok) throw new Error('Failed to update client');
  return response.json();
};

const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(client),
  });
  if (!response.ok) throw new Error('Failed to create client');
  return response.json();
};

const ClientManagementPage = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { data: clients = [], isLoading, error } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setSelectedClients(prev => prev.filter(id => !prev.includes(id)));
    },
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedClients(filteredClients.map(c => c.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (id: number) => {
    setSelectedClients(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-red-600">
          Error loading clients. Make sure JSON Server is running on port 3000.
        </div>
      </div>
    );
  }

  const HandleClick = () => {
    navigate('/addclient' , { state: { from: 'clientManagement' }});
   
  }

  return (
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
                onClick={HandleClick}
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
                    checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
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
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={() => handleSelectClient(client.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{client.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{client.address}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {client.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center text-sm text-gray-700">
                          <FileText className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{doc.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{client.points}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        disabled={deleteMutation.isPending}
                        className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No clients found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagementPage;