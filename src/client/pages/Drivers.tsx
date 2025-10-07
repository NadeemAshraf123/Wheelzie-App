import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  avatar: string;
  address: string;
  schedule?: {
    date: string;
    assignment: string;
    vehicle?: string;
  }[];
};

const fetchDrivers = async (): Promise<Driver[]> => {
  const res = await fetch('http://localhost:3000/drivers');
  if (!res.ok) throw new Error('Failed to fetch drivers');
  return res.json();
};

const Drivers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
  });

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter ? driver.status === statusFilter : true)
  );

  return (
    <div className="flex h-screen overflow-hidden">
      
      <div className="w-2/3 p-6 overflow-y-auto border-r border-gray-300">
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search for driver"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 border rounded w-1/2"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">All Status</option>
            <option value="On Duty">On Duty</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Sick Leave">Sick Leave</option>
          </select>
          <button className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Add Driver
          </button>
        </div>

        
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
            ) : (
              filteredDrivers.map(driver => (
                <tr
                  key={driver.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedDriver(driver)}
                >
                  <td className="p-2 flex items-center gap-2">
                    <img src={driver.avatar} alt={driver.name} className="w-8 h-8 rounded-full" />
                    {driver.name}
                  </td>
                  <td className="p-2">{driver.email}</td>
                  <td className="p-2">{driver.phone}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-white text-sm ${
                      driver.status === 'On Duty' ? 'bg-green-500' :
                      driver.status === 'Off Duty' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {selectedDriver && (
        <div className="w-1/3 p-6 bg-gray-50 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img src={selectedDriver.avatar} alt={selectedDriver.name} className="w-16 h-16 rounded-full" />
              <div>
                <h2 className="text-xl font-semibold">{selectedDriver.name}</h2>
                <p className="text-sm text-gray-600">{selectedDriver.status}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">✉️</button>
              <button className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">✏️</button>
            </div>
          </div>

          <div className="mb-4 space-y-6">
            <p><strong>Email:</strong> {selectedDriver.email}</p>
            <p><strong>Phone:</strong> {selectedDriver.phone}</p>
            <p><strong>Address:</strong> {selectedDriver.address} </p>
          </div>

          <div className="mt-16">
            <h3 className="font-semibold mb-2">Calendar (August 2028)</h3>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isScheduled = selectedDriver.schedule?.some(s => s.date.endsWith(`-08-${day.toString().padStart(2, '0')}`));
                return (
                  <div key={day} className={`p-2 border rounded ${isScheduled ? 'bg-blue-100 font-bold' : ''}`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mt-4">Upcoming Assignments</h3>
            <ul className="list-disc pl-5 text-sm">
              {selectedDriver.schedule?.map((s, idx) => (
                <li key={idx}>
                  <strong>{new Date(s.date).toLocaleDateString()}</strong>: {s.assignment}
                  {s.vehicle && ` (${s.vehicle})`}
                </li>
              )) || <p>No assignments</p>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
