import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Reminders: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/reminders');
      return res.data;
    }
  });

  if (isLoading) return <div>Loading reminders...</div>;
  if (error) return <div>Error loading reminders: {error.message}</div>;

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-2">Reminders</h3>
      <ul className="list-disc pl-5 space-y-2">
        {data.map((item: string, index: number) => (
          <li key={index} className="text-gray-700">{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Reminders;
